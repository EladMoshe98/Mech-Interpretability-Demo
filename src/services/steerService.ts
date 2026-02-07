import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, SteerResponse } from "@/types/chat";

export async function sendSteerChat(
  messages: Omit<ChatMessage, "id">[]
): Promise<SteerResponse> {
  const { data, error } = await supabase.functions.invoke<SteerResponse>(
    "steer-chat",
    {
      body: { messages },
    }
  );

  if (error) {
    console.error("Steer chat error:", error);
    throw new Error(error.message || "Failed to get response");
  }

  if (!data) {
    throw new Error("No response received");
  }

  return data;
}
