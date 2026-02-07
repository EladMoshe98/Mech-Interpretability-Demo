export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface SteerResponse {
  default: string;
  steered: string;
  shareUrl?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}
