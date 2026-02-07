import React from "react";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  variant: "default" | "steered";
}

export function ChatBubble({ message, variant }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "chat-bubble",
          isUser && "chat-bubble-user",
          !isUser && variant === "default" && "chat-bubble-assistant-default",
          !isUser && variant === "steered" && "chat-bubble-assistant-steered"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
