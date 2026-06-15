import React from "react";
import { Store, CreditCard, ExternalLink, Package, DollarSign, CheckCircle2 } from "lucide-react";
import { formatPrice } from "../../../lib/api";
import { Panel, PageHeading } from "./_ui";

export default function ChannelView({ type, data }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://p-nice.shop";

  if (type === "online-store") {
    return (
      <div className="space-y-5">
        <PageHeading title="Online store" subtitle="Your live storefront" />
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
                <Store size={22} />
              </span>
              <div>
                <p className="font-semibold text-slate-800">P-Nice Store</p>
                <a href={origin} target="_blank" rel="noreferrer" className="text-sm text-emerald-600 hover:underline inline-flex items-center gap-1">
                  {origin.replace(/^https?:\/\//, "")} <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 font-medium">
              <CheckCircle2 size={15} /> Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <Package size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Products live</p>
                <p className="font-semibold text-slate-800">{data?.stats?.total_products.value ?? "—"}</p>
              </div>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <DollarSign size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Total revenue</p>
                <p className="font-semibold text-slate-800">{formatPrice(data?.analytics?.revenue_total ?? 0)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <a href={origin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-emerald-700">
              Visit store <ExternalLink size={14} />
            </a>
            <a href={`${origin}/shop`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 rounded-lg px-4 py-2 text-sm hover:bg-slate-50">
              Browse catalog
            </a>
          </div>
        </Panel>
      </div>
    );
  }

  // Point of sale
  return (
    <div className="space-y-5">
      <PageHeading title="Point of sale" subtitle="Sell in person" />
      <Panel>
        <div className="text-center py-8">
          <span className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto">
            <CreditCard size={26} />
          </span>
          <p className="font-semibold text-slate-800 mt-4">Point of Sale isn't connected</p>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Connect a POS to accept in-person payments at markets and pop-ups, with inventory synced to your online store.
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 bg-slate-800 text-white rounded-lg px-4 py-2 text-sm opacity-60 cursor-not-allowed"
            disabled
            title="POS setup is not available yet"
          >
            Set up POS (coming soon)
          </button>
        </div>
      </Panel>
    </div>
  );
}
