import React, { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { formatPrice } from "../../../lib/api";
import { Panel, PageHeading, EmptyState, StatusPill } from "./_ui";

export default function ProductsView({ data, loading }) {
  const [q, setQ] = useState("");
  const products = (data?.top_products_list || []).filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeading title="Products" subtitle={`${data?.top_products_list?.length ?? 0} products in your catalog`} />

      <Panel
        action={
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              data-testid="products-search"
              className="pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-300 w-52"
            />
          </div>
        }
      >
        {loading ? (
          <EmptyState>Loading products…</EmptyState>
        ) : products.length === 0 ? (
          <EmptyState>No products match your search.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-slate-100 rounded-xl p-4 flex gap-4" data-testid="product-card">
                {p.image && <img src={p.image} alt={p.name} className="w-20 h-24 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                    <StatusPill status="active" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{p.category}</p>
                  <p className="text-xs text-slate-400">{p.size}</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{formatPrice(p.price)}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{p.units_sold} sold</span>
                    <span>·</span>
                    <span>{formatPrice(p.revenue)} rev.</span>
                  </div>
                  <a
                    href={`/product/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline mt-2"
                  >
                    View in store <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
