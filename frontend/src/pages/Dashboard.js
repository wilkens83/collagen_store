import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  ClipboardCheck,
  XCircle,
  Trophy,
  Bell,
  Calendar,
  ChevronDown,
  Menu,
  TrendingUp,
} from "lucide-react";
import { api, formatPrice } from "../lib/api";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import TopProductsCard from "../components/dashboard/TopProductsCard";

const RANGES = [
  { key: "1d", label: "1d" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "16m", label: "16m" },
  { key: "max", label: "Max" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nav, setNav] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Dashboard · P-Nice";
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/dashboard/summary?range=${range}`)
      .then(({ data }) => {
        if (active) {
          setData(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (active) setError(e.response?.data?.detail || e.message || "Failed to load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [range]);

  const today = useMemo(
    () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    []
  );

  const stats = data?.stats;
  const sales = data?.sales;

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex text-slate-800">
      <Sidebar
        active={nav}
        onSelect={(k) => {
          setNav(k);
          setMenuOpen(false);
        }}
        badges={{ orders: data?.pending_orders || 0 }}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden text-slate-500" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="font-semibold text-slate-800 truncate">
                {greeting()}, {data?.owner || "there"}!
              </h1>
              <p className="text-xs text-slate-400 truncate">Here's what's happening with your store today</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              <Calendar size={15} /> {today}
            </span>
            <button className="relative text-slate-500 hover:text-slate-700" aria-label="Notifications">
              <Bell size={20} />
              {data?.pending_orders > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] grid place-items-center bg-rose-500 text-white rounded-full">
                  {data.pending_orders}
                </span>
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center text-white text-sm font-semibold">
              {(data?.owner || "P")[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 rounded-xl px-4 py-3 text-sm" data-testid="dash-error">
              Couldn't load dashboard: {error}
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Package}
              label="Total products"
              value={loading ? "—" : stats?.total_products.value ?? 0}
              delta={stats?.total_products.delta_pct ?? 0}
              tint="emerald"
            />
            <StatCard
              icon={ClipboardCheck}
              label="Completed order"
              value={loading ? "—" : stats?.completed_orders.value ?? 0}
              delta={stats?.completed_orders.delta_pct ?? 0}
              tint="sky"
            />
            <StatCard
              icon={XCircle}
              label="Canceled order"
              value={loading ? "—" : stats?.canceled_orders.value ?? 0}
              delta={stats?.canceled_orders.delta_pct ?? 0}
              tint="rose"
            />
            <StatCard
              icon={Trophy}
              label="Top products"
              value={loading ? "—" : stats?.top_products.value ?? 0}
              delta={stats?.top_products.delta_pct ?? 0}
              tint="amber"
            />
          </div>

          {/* Sales report */}
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
                    <span
                      className={`flex items-center gap-1 text-sm font-semibold mb-1 ${
                        (sales.delta_amount ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
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
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      range === r.key ? "bg-slate-800 text-white font-medium" : "text-slate-500 hover:text-slate-700"
                    }`}
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

          {/* Transactions + top products */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <TransactionsTable transactions={data?.transactions || []} />
            </div>
            <div>
              <TopProductsCard products={data?.top_products_list || []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
