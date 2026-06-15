import React, { useState } from "react";
import { ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";
import { formatPrice } from "../../lib/api";

export default function TopProductsCard({ products = [] }) {
  const [idx, setIdx] = useState(0);
  const has = products.length > 0;
  const current = has ? products[idx % products.length] : null;

  const move = (dir) =>
    setIdx((i) => (products.length ? (i + dir + products.length) % products.length : 0));

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-[0_10px_30px_rgba(5,150,105,0.25)] h-full flex flex-col">
      <div className="flex items-center gap-2">
        <PartyPopper size={20} />
        <h3 className="font-semibold text-lg">Congratulations! 🎉</h3>
      </div>
      <p className="text-emerald-50/90 text-sm mt-1">
        {has
          ? "Your best-performing products with the highest buyers."
          : "Your top products will be highlighted here once sales roll in."}
      </p>

      <div className="mt-5 flex-1 flex items-center gap-4">
        <button
          onClick={() => move(-1)}
          className="shrink-0 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center disabled:opacity-40"
          disabled={!has}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 bg-white/10 rounded-xl p-4 flex items-center gap-4 min-h-[104px]">
          {current ? (
            <>
              {current.image && (
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-16 h-16 rounded-lg object-cover ring-2 ring-white/30"
                />
              )}
              <div className="min-w-0">
                <p className="font-semibold truncate">{current.name}</p>
                <p className="text-emerald-50/90 text-sm">{formatPrice(current.price)}</p>
                <p className="text-xs text-emerald-50/70 mt-1">
                  {current.units_sold} sold · {formatPrice(current.revenue)} revenue
                </p>
              </div>
            </>
          ) : (
            <div className="text-emerald-50/80 text-sm">No products to show.</div>
          )}
        </div>

        <button
          onClick={() => move(1)}
          className="shrink-0 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center disabled:opacity-40"
          disabled={!has}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {has && (
        <div className="flex justify-center gap-1.5 mt-4">
          {products.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx % products.length ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
