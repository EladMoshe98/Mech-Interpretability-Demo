import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-3 px-4">
      <div className="container mx-auto">
        <p className="text-xs text-center text-muted-foreground">
          Powered by{" "}
          <a
            href="https://www.neuronpedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Neuronpedia API
          </a>{" "}
          • This demo is for research purposes and may contain examples of AI failure modes
        </p>
      </div>
    </footer>
  );
}
