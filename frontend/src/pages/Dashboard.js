import React, { useEffect, useMemo, useState } from "react";
import { Bell, Calendar, Menu } from "lucide-react";
import { api } from "../lib/api";
import Sidebar from "../components/dashboard/Sidebar";
import OverviewView from "../components/dashboard/views/OverviewView";
import ProductsView from "../components/dashboard/views/ProductsView";
import AnalyticsView from "../components/dashboard/views/AnalyticsView";
import OrdersView from "../components/dashboard/views/OrdersView";
import CustomersView from "../components/dashboard/views/CustomersView";
import MarketingView from "../components/dashboard/views/MarketingView";
import ChannelView from "../components/dashboard/views/ChannelView";
import AppsView from "../components/dashboard/views/AppsView";

const SUMMARY_VIEWS = ["overview", "products", "analytics", "online-store"];

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

  const renderView = () => {
    switch (nav) {
      case "products":
        return <ProductsView data={data} loading={loading} />;
      case "analytics":
        return <AnalyticsView data={data} range={range} setRange={setRange} loading={loading} />;
      case "orders":
        return <OrdersView />;
      case "customer":
        return <CustomersView />;
      case "marketing":
        return <MarketingView />;
      case "online-store":
        return <ChannelView type="online-store" data={data} />;
      case "point-of-sale":
        return <ChannelView type="point-of-sale" />;
      case "shopify":
      case "tiktok":
      case "tokopedia":
        return <AppsView app={nav} />;
      case "add-apps":
        return <AppsView app="add-apps" />;
      case "overview":
      default:
        return <OverviewView data={data} range={range} setRange={setRange} loading={loading} />;
    }
  };

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

        <main className="flex-1 p-4 sm:p-6">
          {SUMMARY_VIEWS.includes(nav) && error && (
            <div className="bg-rose-50 text-rose-600 rounded-xl px-4 py-3 text-sm mb-6" data-testid="dash-error">
              Couldn't load dashboard: {error}
            </div>
          )}
          {renderView()}
        </main>
      </div>
    </div>
  );
}
