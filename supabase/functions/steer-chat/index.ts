import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SteerRequest {
  messages: ChatMessage[];
}

// Use Gemma 2 9B with the "helpful assistant" feature (well-documented & supported)
const STEER_VECTOR_REF = {
  modelId: "gemma-2-9b-it",
  source: "9-gemmascope-res-131k",
  index: "43393", // "helpful assistant" feature
  strength: 40,
} as const;

// Helper to extract the last assistant response from chatTemplate
function extractLastAssistantMessage(chatTemplate: Array<{ role: string; content: string }> | undefined): string | null {
  if (!chatTemplate || chatTemplate.length === 0) return null;
  for (let i = chatTemplate.length - 1; i >= 0; i--) {
    if (chatTemplate[i].role === "model" || chatTemplate[i].role === "assistant") {
      return chatTemplate[i].content;
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const NEURONPEDIA_API_KEY = Deno.env.get("NEURONPEDIA_API_KEY");
    if (!NEURONPEDIA_API_KEY) {
      console.error("NEURONPEDIA_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = (await req.json()) as SteerRequest;
    console.log("Received messages:", JSON.stringify(messages, null, 2));

    const chatMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const vectorInfo = STEER_VECTOR_REF;
    console.log("Using Neuronpedia Gemma 2 9B vector:", vectorInfo);

    const neuronpediaPayload = {
      defaultChatMessages: chatMessages,
      steeredChatMessages: chatMessages,
      modelId: vectorInfo.modelId,
      features: [
        {
          modelId: vectorInfo.modelId,
          layer: vectorInfo.source,
          index: vectorInfo.index,
          strength: vectorInfo.strength,
        },
      ],
      temperature: 0.5,
      n_tokens: 32,
      freq_penalty: 2,
      seed: 16,
      strength_multiplier: 4,
      steer_special_tokens: true,
      
    };

    console.log("Calling Neuronpedia API with payload:", JSON.stringify(neuronpediaPayload, null, 2));

    const response = await fetch("https://www.neuronpedia.org/api/steer-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": NEURONPEDIA_API_KEY,
      },
      body: JSON.stringify(neuronpediaPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Neuronpedia API error:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Neuronpedia API error: ${response.status}`, 
          details: errorText,
          note: "Llama 3.3 70B steering failed. The custom vector may have dimension mismatch or the model may require special API access."
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Neuronpedia response:", JSON.stringify(data, null, 2));

    const defaultData = data.DEFAULT || data.default;
    const steeredData = data.STEERED || data.steered;

    const defaultResponse = extractLastAssistantMessage(defaultData?.chatTemplate || defaultData?.chat_template)
      || defaultData?.raw || "No response generated";
    
    const steeredResponse = extractLastAssistantMessage(steeredData?.chatTemplate || steeredData?.chat_template)
      || steeredData?.raw || "No response generated";

    return new Response(
      JSON.stringify({
        default: defaultResponse,
        steered: steeredResponse,
        shareUrl: data.shareUrl,
        model: "gemma-2-9b-it",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
