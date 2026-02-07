import React, { useState, KeyboardEvent } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  onReset: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export function ChatInput({ onSend, onReset, isLoading, hasMessages }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          {hasMessages && (
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              disabled={isLoading}
              className="shrink-0 border-border/50 hover:bg-secondary"
              title="Reset chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              className="min-h-[52px] max-h-32 resize-none bg-secondary/50 border-border/50 focus:border-primary/50 pr-12"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 h-8 w-8 bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
