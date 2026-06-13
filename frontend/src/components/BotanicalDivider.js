import React from "react";

// Thin-line botanical flourish used as an elegant section divider.
export default function BotanicalDivider({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`} aria-hidden="true">
      <span className="h-px w-16 sm:w-24 bg-gold/50" />
      <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="text-gold">
        <path
          d="M24 2c-3 5-9 7-9 7s6 2 9 7c3-5 9-7 9-7s-6-2-9-7Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="24" cy="9" r="1.4" fill="currentColor" />
        <path d="M2 9h11M35 9h11" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="h-px w-16 sm:w-24 bg-gold/50" />
    </div>
  );
}
