import React from "react";
import { ExternalLink, HelpCircle } from "lucide-react";
import gooseLogo from "@/assets/goose-logo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={gooseLogo} 
              alt="Goose logo" 
              className="w-9 h-9 rounded-md"
            />
            <div className="flex items-baseline gap-2">
              <h1 className="font-bold text-xl tracking-wide text-foreground">
                GOOSE
              </h1>
              <span className="text-sm text-muted-foreground">
                AI Financial Advisory
              </span>
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
                    Goose builds explainable, auditable AI for the financial industry—replacing black-box models with systems banks and regulators can trust.
                  </p>
                  <p>
                    We use <span className="font-medium text-foreground">feature steering</span>: brain surgery on LLMs—directly shaping internal reasoning, not just prompts. Powered by the open-source <a href="https://www.neuronpedia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Neuronpedia API</a>.
                  </p>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground/70 mb-1">Founded by</p>
                    <p className="font-bold text-foreground tracking-wide">
                      ELAD MOSHE • IÑIGO MARTOS • ROBERTO PALACIOS
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground/60">
                      © Goose Inc. All rights reserved.
                    </p>
                  </div>
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
