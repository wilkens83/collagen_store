import React from "react";

export default function Disclaimer({ className = "" }) {
  return (
    <p
      data-testid="cosmetic-disclaimer"
      className={`font-serif italic text-sm leading-relaxed text-stone ${className}`}
    >
      These statements have not been evaluated by the Food and Drug Administration. This
      product is not intended to diagnose, treat, cure, or prevent any disease. For external
      use only. Patch test before use; discontinue if irritation occurs.
    </p>
  );
}
