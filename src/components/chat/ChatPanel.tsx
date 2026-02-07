import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  isLoading: boolean;
  variant: "default" | "steered";
}

export function ChatPanel({
  title,
  subtitle,
  messages,
  isLoading,
  variant,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl overflow-hidden border border-border/50",
        variant === "default" && "panel-default",
        variant === "steered" && "panel-steered"
      )}
    >
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-3 h-3 rounded-full",
              variant === "default" && "bg-panel-default-accent",
              variant === "steered" && "bg-panel-steered-accent"
            )}
          />
          <div>
            <h2 className="font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
      >
        {isEmpty && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">
                {variant === "default"
                  ? "Default Llama 3.3 70B responses"
                  : "Responses with Assistant Vector applied"}
              </p>
              <p className="text-xs mt-1 opacity-70">
                Send a message to start
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} variant={variant} />
        ))}

        {isLoading && <TypingIndicator variant={variant} />}
      </div>
    </div>
  );
}
