import React from "react";
import { DollarSign, ShoppingBag, Receipt, Percent } from "lucide-react";
import { formatPrice } from "../../../lib/api";
import SalesChart from "../SalesChart";
import StatCard from "../StatCard";
import { Panel, PageHeading, EmptyState } from "./_ui";

export default function AnalyticsView({ data, range, setRange, loading }) {
  const a = data?.analytics;
  const sales = data?.sales;
  const products = data?.top_products_list || [];
  const maxRev = Math.max(1, ...products.map((p) => p.revenue || 0));
  const totalUnits = products.reduce((s, p) => s + (p.units_sold || 0), 0);

  const RANGES = ["7d", "30d", "16m", "max"];

  return (
    <div className="space-y-6">
      <PageHeading title="Analytics" subtitle="Performance across your store" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total revenue" value={loading ? "—" : formatPrice(a?.revenue_total ?? 0)} delta={0} tint="emerald" />
        <StatCard icon={Receipt} label="Avg. order value" value={loading ? "—" : formatPrice(a?.avg_order_value ?? 0)} delta={0} tint="sky" />
        <StatCard icon={ShoppingBag} label="Completed orders" value={loading ? "—" : a?.status_breakdown.completed ?? 0} delta={0} tint="amber" />
        <StatCard icon={Percent} label="Units sold" value={loading ? "—" : totalUnits} delta={0} tint="rose" />
      </div>

      <Panel
        title="Sales over time"
        action={
          <div className="inline-flex bg-slate-50 rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${range === r ? "bg-slate-800 text-white font-medium" : "text-slate-500 hover:text-slate-700"}`}
              >
                {r === "max" ? "Max" : r}
              </button>
            ))}
          </div>
        }
      >
        <SalesChart series={sales?.series || []} currency={(data?.currency || "usd").toUpperCase()} />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Revenue by product">
          {products.length === 0 ? (
            <EmptyState>No product data yet.</EmptyState>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 truncate pr-2">{p.name}</span>
                    <span className="text-slate-700 font-semibold">{formatPrice(p.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((p.revenue || 0) / maxRev) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Order status">
          <div className="space-y-3">
            {[
              { label: "Completed", key: "completed", color: "bg-emerald-500" },
              { label: "Pending", key: "pending", color: "bg-amber-500" },
              { label: "Canceled", key: "canceled", color: "bg-rose-500" },
            ].map((row) => {
              const val = a?.status_breakdown?.[row.key] ?? 0;
              const total = Object.values(a?.status_breakdown || {}).reduce((s, v) => s + v, 0) || 1;
              return (
                <div key={row.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} /> {row.label}
                    </span>
                    <span className="text-slate-700 font-semibold">{val}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: `${(val / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
