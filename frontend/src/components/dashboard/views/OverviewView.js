import React from "react";
import { Package, ClipboardCheck, XCircle, Trophy, ChevronDown, TrendingUp } from "lucide-react";
import { formatPrice } from "../../../lib/api";
import StatCard from "../StatCard";
import SalesChart from "../SalesChart";
import TransactionsTable from "../TransactionsTable";
import TopProductsCard from "../TopProductsCard";

const RANGES = [
  { key: "1d", label: "1d" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "16m", label: "16m" },
  { key: "max", label: "Max" },
];

export default function OverviewView({ data, range, setRange, loading }) {
  const stats = data?.stats;
  const sales = data?.sales;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total products" value={loading ? "—" : stats?.total_products.value ?? 0} delta={stats?.total_products.delta_pct ?? 0} tint="emerald" />
        <StatCard icon={ClipboardCheck} label="Completed order" value={loading ? "—" : stats?.completed_orders.value ?? 0} delta={stats?.completed_orders.delta_pct ?? 0} tint="sky" />
        <StatCard icon={XCircle} label="Canceled order" value={loading ? "—" : stats?.canceled_orders.value ?? 0} delta={stats?.canceled_orders.delta_pct ?? 0} tint="rose" />
        <StatCard icon={Trophy} label="Top products" value={loading ? "—" : stats?.top_products.value ?? 0} delta={stats?.top_products.delta_pct ?? 0} tint="amber" />
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-slate-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm">Your sales report</p>
            <p className="text-xs text-slate-400">Look at your sales</p>
            <div className="flex items-end gap-3 mt-3">
              <span className="text-3xl sm:text-4xl font-bold text-slate-800" data-testid="sales-total">
                {loading ? "—" : formatPrice(sales?.total ?? 0)}
              </span>
              {sales && (
                <span className={`flex items-center gap-1 text-sm font-semibold mb-1 ${(sales.delta_amount ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  <TrendingUp size={15} />
                  {(sales.delta_amount ?? 0) >= 0 ? "+" : "-"}
                  {formatPrice(Math.abs(sales.delta_amount ?? 0))} ({Math.abs(sales.delta_pct ?? 0).toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            Total Sales <ChevronDown size={15} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="inline-flex bg-slate-50 rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                data-testid={`range-${r.key}`}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${range === r.key ? "bg-slate-800 text-white font-medium" : "text-slate-500 hover:text-slate-700"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <SalesChart series={sales?.series || []} currency={(data?.currency || "usd").toUpperCase()} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionsTable transactions={data?.transactions || []} />
        </div>
        <div>
          <TopProductsCard products={data?.top_products_list || []} />
        </div>
      </div>
    </div>
  );
}
