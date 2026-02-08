import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ASSISTANT_AXIS_VECTOR, VECTOR_METADATA } from "./assistant-axis-vector.ts";

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

// Cache for uploaded vector ID
let cachedVectorId: string | null = null;
let cachedVectorSource: string | null = null;

// Upload the custom vector to Neuronpedia and get a vector ID
async function uploadCustomVector(apiKey: string): Promise<{ vectorId: string; source: string } | null> {
  if (cachedVectorId && cachedVectorSource) {
    console.log("Using cached vector ID:", cachedVectorId);
    return { vectorId: cachedVectorId, source: cachedVectorSource };
  }

  try {
    console.log("Uploading custom Assistant Axis vector to Neuronpedia...");
    const response = await fetch("https://www.neuronpedia.org/api/vector/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        modelId: VECTOR_METADATA.modelId,
        layerNumber: VECTOR_METADATA.layerNumber,
        hookType: VECTOR_METADATA.hookType,
        vector: ASSISTANT_AXIS_VECTOR,
        vectorLabel: VECTOR_METADATA.vectorLabel,
        vectorDefaultSteerStrength: VECTOR_METADATA.vectorDefaultSteerStrength,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vector upload failed:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log("Vector upload response:", JSON.stringify(data, null, 2));
    
    // Cache the result
    cachedVectorId = data.vectorId || data.id;
    cachedVectorSource = data.source || `${VECTOR_METADATA.layerNumber}-neuronpedia-${VECTOR_METADATA.hookType}`;
    
    return { vectorId: cachedVectorId!, source: cachedVectorSource! };
  } catch (error) {
    console.error("Error uploading vector:", error);
    return null;
  }
}

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

    // First, try to upload the custom vector and use Llama 3.3 70B
    const vectorInfo = await uploadCustomVector(NEURONPEDIA_API_KEY);
    
    let neuronpediaPayload;
    
    if (!vectorInfo) {
      // Return error instead of falling back to cat persona
      console.error("Vector upload failed - cannot proceed without custom vector");
      return new Response(
        JSON.stringify({ 
          error: "Vector upload failed", 
          details: "The custom Assistant Axis vector could not be uploaded to Neuronpedia. This may be due to model dimension mismatch or API access restrictions for Llama 3.3 70B.",
          suggestion: "Llama 3.3 70B inference may require special API access. Contact Neuronpedia for access."
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the custom Assistant Axis vector with Llama 3.3 70B
    console.log("Using custom Assistant Axis vector with Llama 3.3 70B");
    const neuronpediaPayload = {
      defaultChatMessages: chatMessages,
      steeredChatMessages: chatMessages,
      modelId: VECTOR_METADATA.modelId,
      features: [
        {
          modelId: VECTOR_METADATA.modelId,
          layer: vectorInfo.source,
          index: vectorInfo.vectorId,
          strength: VECTOR_METADATA.vectorDefaultSteerStrength,
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
        model: vectorInfo ? "llama3.3-70b-it" : "gemma-2-9b-it",
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
