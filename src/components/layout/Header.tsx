import React from "react";
import { ExternalLink, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-xl">🪿</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">
                Goose Explainability
              </h1>
              <p className="text-xs text-muted-foreground">
                Assistant Axis Demo • Llama 3.3 70B
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.anthropic.com/research/assistant-axis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </a>
            <a
              href="https://github.com/safety-research/assistant-axis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
