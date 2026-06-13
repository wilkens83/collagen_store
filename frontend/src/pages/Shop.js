import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import Seo from "../components/Seo";
import ProductCard from "../components/ProductCard";
import BotanicalDivider from "../components/BotanicalDivider";

const FILTERS = ["All", "Serums", "Moisturizers", "Night Care"];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data.products)).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return products;
    return products.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()));
  }, [products, filter]);

  return (
    <div data-testid="shop-page">
      <Seo title="Shop" description="Browse the full P-Nice collection — clean, botanical night care." />
      <section className="bg-cream-muted py-16 text-center">
        <p className="eyebrow text-gold mb-3">The Collection</p>
        <h1 className="h-section">Shop P-Nice</h1>
        <p className="text-charcoal/70 max-w-xl mx-auto mt-4 px-6">
          A small, considered range. Each formula is a cosmetic ritual designed to help your skin
          look its best.
        </p>
      </section>

      <BotanicalDivider className="py-10" />

      <section className="container-pnice pb-20">
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-testid="shop-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-testid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              className={`px-5 py-2 rounded-full text-xs tracking-widest2 uppercase border transition-colors ${
                filter === f
                  ? "bg-forest text-cream border-forest"
                  : "border-stone/40 text-forest hover:border-gold hover:text-gold"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-stone py-16">No products in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 max-w-5xl mx-auto">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
