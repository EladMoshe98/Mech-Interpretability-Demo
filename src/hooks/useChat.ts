import { useState, useCallback } from "react";
import { ChatMessage, ChatState } from "@/types/chat";
import { sendSteerChat } from "@/services/steerService";

export function useChat() {
  const [defaultChat, setDefaultChat] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });
  
  const [steeredChat, setSteeredChat] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessageId = crypto.randomUUID();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content,
    };

    // Add user message to both chats
    setDefaultChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));
    
    setSteeredChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Build conversation history (without IDs for API)
      const conversationHistory = [
        ...defaultChat.messages.map(({ role, content }) => ({ role, content })),
        { role: "user" as const, content },
      ];

      const response = await sendSteerChat(conversationHistory);

      // Add assistant responses
      const defaultAssistantId = crypto.randomUUID();
      const steeredAssistantId = crypto.randomUUID();

      setDefaultChat((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { id: defaultAssistantId, role: "assistant", content: response.default },
        ],
        isLoading: false,
      }));

      setSteeredChat((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { id: steeredAssistantId, role: "assistant", content: response.steered },
        ],
        isLoading: false,
      }));

      if (response.shareUrl) {
        setShareUrl(response.shareUrl);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Remove user message on error and set error state
      setDefaultChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== userMessageId),
        isLoading: false,
      }));
      
      setSteeredChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => m.id !== userMessageId),
        isLoading: false,
      }));

      throw error;
    }
  }, [defaultChat.messages]);

  const resetChat = useCallback(() => {
    setDefaultChat({ messages: [], isLoading: false });
    setSteeredChat({ messages: [], isLoading: false });
    setShareUrl(null);
  }, []);

  return {
    defaultChat,
    steeredChat,
    shareUrl,
    sendMessage,
    resetChat,
  };
}
