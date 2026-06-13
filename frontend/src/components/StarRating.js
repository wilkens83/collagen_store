import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating = 5, count, className = "" }) {
  const full = Math.round(rating);
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="star-rating">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            className={i <= full ? "fill-gold text-gold" : "text-stone"}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {count != null && (
        <span className="text-xs text-stone tracking-wide">
          {rating.toFixed(1)} · {count} reviews
        </span>
      )}
    </div>
  );
}
