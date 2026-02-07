import React from "react";
import { useChat } from "@/hooks/useChat";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ChatInput } from "@/components/chat/ChatInput";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { defaultChat, steeredChat, sendMessage, resetChat } = useChat();
  const { toast } = useToast();

  const handleSend = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
    }
  };

  const isLoading = defaultChat.isLoading || steeredChat.isLoading;
  const hasMessages = defaultChat.messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      {/* Main Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Default Panel */}
          <ChatPanel
            title="Default"
            subtitle="No steering applied"
            messages={defaultChat.messages}
            isLoading={defaultChat.isLoading}
            variant="default"
          />

          {/* Steered Panel */}
          <ChatPanel
            title="Steered"
            subtitle="Financial Assistant Related Feature steering applied"
            messages={steeredChat.messages}
            isLoading={steeredChat.isLoading}
            variant="steered"
          />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput
        onSend={handleSend}
        onReset={resetChat}
        isLoading={isLoading}
        hasMessages={hasMessages}
      />

      <Footer />
    </div>
  );
};

export default Index;
