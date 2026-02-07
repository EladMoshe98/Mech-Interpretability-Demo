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

    // Call Neuronpedia's steer-chat API
    // This endpoint generates both default and steered responses
    const neuronpediaPayload = {
      defaultChatMessages: chatMessages,
      steeredChatMessages: chatMessages,
      modelId: "llama3.3-70b-it",
      features: [
        {
          modelId: "llama3.3-70b-it",
          layer: "40-neuronpedia-resid-post",
          index: 101874252,
          strength: 10,
        },
      ],
      temperature: 0.7,
      n_tokens: 512,
      freq_penalty: 0,
      seed: Math.floor(Math.random() * 10000),
      strength_multiplier: 1,
      steer_special_tokens: false,
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

    // Extract the responses
    // The API returns { default: { raw, chat_template }, steered: { raw, chat_template }, id, shareUrl }
    const defaultResponse = data.default?.chat_template?.[data.default.chat_template.length - 1]?.content 
      || data.default?.raw 
      || "No response generated";
    
    const steeredResponse = data.steered?.chat_template?.[data.steered.chat_template.length - 1]?.content 
      || data.steered?.raw 
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
