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

// Helper to extract the last assistant response from chatTemplate
function extractLastAssistantMessage(chatTemplate: Array<{ role: string; content: string }> | undefined): string | null {
  if (!chatTemplate || chatTemplate.length === 0) return null;
  // Find the last message from the model/assistant
  for (let i = chatTemplate.length - 1; i >= 0; i--) {
    if (chatTemplate[i].role === "model" || chatTemplate[i].role === "assistant") {
      return chatTemplate[i].content;
    }
  }
  return null;
}

serve(async (req) => {
  // Handle CORS preflight
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

    // Format messages for Neuronpedia API (chat format)
    const chatMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Using gemma-2-9b-it with a sycophancy feature for demonstration
    // The llama3.3-70b-it model with Assistant Axis vector is not available via public API
    // We use Gemma with a helpful/assistant-like feature instead
    const neuronpediaPayload = {
      defaultChatMessages: chatMessages,
      steeredChatMessages: chatMessages,
      modelId: "gemma-2-9b-it",
      features: [
        {
          modelId: "gemma-2-9b-it",
          layer: "9-gemmascope-res-131k",
          index: 62610, // This is a feature that modifies behavior
          strength: 48,
        },
      ],
      temperature: 0.7,
      n_tokens: 256,
      freq_penalty: 1,
      seed: Math.floor(Math.random() * 10000),
      strength_multiplier: 4,
      steer_special_tokens: true,
      steer_method: "SIMPLE_ADDITIVE",
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
          details: errorText 
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Neuronpedia response:", JSON.stringify(data, null, 2));

    // The API returns uppercase keys: DEFAULT, STEERED with chatTemplate (camelCase)
    const defaultData = data.DEFAULT || data.default;
    const steeredData = data.STEERED || data.steered;

    // Extract the last assistant message from chatTemplate
    const defaultResponse = extractLastAssistantMessage(defaultData?.chatTemplate || defaultData?.chat_template)
      || defaultData?.raw 
      || "No response generated";
    
    const steeredResponse = extractLastAssistantMessage(steeredData?.chatTemplate || steeredData?.chat_template)
      || steeredData?.raw 
      || "No response generated";

    return new Response(
      JSON.stringify({
        default: defaultResponse,
        steered: steeredResponse,
        shareUrl: data.shareUrl,
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
