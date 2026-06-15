import React, { useState } from "react";
import { Search } from "lucide-react";
import { formatPrice } from "../../../lib/api";
import useSection from "../useSection";
import { Panel, PageHeading, EmptyState, Loader, StatusPill } from "./_ui";

export default function OrdersView() {
  const { data, loading, error } = useSection("/dashboard/orders");
  const [tab, setTab] = useState("orders");
  const [q, setQ] = useState("");

  const rows = (data?.[tab === "orders" ? "orders" : "pending"] || []).filter((r) =>
    `${r.order_id} ${r.item} ${r.customer}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeading title="Orders" subtitle="Paid orders and open checkouts" />

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex bg-slate-50 rounded-lg p-1">
            <button onClick={() => setTab("orders")} data-testid="orders-tab-paid" className={`px-3 py-1.5 text-sm rounded-md ${tab === "orders" ? "bg-slate-800 text-white" : "text-slate-500"}`}>
              Paid ({data?.counts?.paid ?? 0})
            </button>
            <button onClick={() => setTab("pending")} data-testid="orders-tab-pending" className={`px-3 py-1.5 text-sm rounded-md ${tab === "pending" ? "bg-slate-800 text-white" : "text-slate-500"}`}>
              Pending ({data?.counts?.pending ?? 0})
            </button>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders" className="pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-300 w-52" />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <EmptyState>Couldn't load orders: {error}</EmptyState>
        ) : rows.length === 0 ? (
          <EmptyState>
            {tab === "orders" ? "No paid orders yet — they'll appear here after the first checkout." : "No open checkouts right now."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Order ID</th>
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.order_id}-${i}`} className="border-b border-slate-50 last:border-0" data-testid="order-row">
                    <td className="py-3 pr-3 font-medium text-slate-700">{r.order_id}</td>
                    <td className="py-3 pr-3 text-slate-600">{r.item}</td>
                    <td className="py-3 pr-3 text-slate-500">{r.customer}</td>
                    <td className="py-3 pr-3 text-slate-500">{r.date}</td>
                    <td className="py-3 pr-3 font-semibold text-slate-700">{formatPrice(r.amount)}</td>
                    <td className="py-3 pr-3"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
