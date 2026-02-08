import React from "react";
import { ExternalLink, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
                Feature Steering Demo • Gemma 2 9B
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">About</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">About Goose</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Goose is an explainable AI company built for the realities of the banking and financial services industry. We help institutions deploy advanced AI systems that are transparent, auditable, and aligned with regulatory and risk requirements—so decision-makers can trust not just the outcomes, but the reasoning behind them.
                  </p>
                  <p>
                    Our technology makes complex models understandable to humans, enabling clearer credit decisions, risk assessments, compliance reviews, and governance across the AI lifecycle. By turning "black box" models into interpretable systems, Goose bridges the gap between innovation and accountability in finance.
                  </p>
                  <p>
                    Goose was founded by Elad Moshe, Iñigo Martos, and Roberto Palacios, combining expertise in AI, financial systems, and scalable product development to bring explainable AI from theory into real-world banking operations.
                  </p>
                  <p className="pt-2">
                    <a 
                      href="mailto:info@gooseai.com" 
                      className="text-primary hover:underline font-medium"
                    >
                      Contact us at info@gooseai.com
                    </a>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
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
