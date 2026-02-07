import React from "react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  variant: "default" | "steered";
}

export function TypingIndicator({ variant }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "chat-bubble flex items-center gap-1",
          variant === "default" && "chat-bubble-assistant-default",
          variant === "steered" && "chat-bubble-assistant-steered"
        )}
      >
        <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
