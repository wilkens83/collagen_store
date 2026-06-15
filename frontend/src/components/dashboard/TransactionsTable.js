import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { formatPrice } from "../../lib/api";

export default function TransactionsTable({ transactions = [] }) {
  const [q, setQ] = useState("");

  const filtered = transactions.filter((t) => {
    const hay = `${t.order_id} ${t.item} ${t.platform}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-slate-800">Last transaction</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              data-testid="txn-search"
              className="pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-300 w-44"
            />
          </div>
          <button className="p-2 rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 pr-3 font-medium w-8"></th>
              <th className="py-2 pr-3 font-medium">Order ID</th>
              <th className="py-2 pr-3 font-medium">Item</th>
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Price</th>
              <th className="py-2 pr-3 font-medium">Platform</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  {transactions.length === 0
                    ? "No transactions yet — they'll appear here as orders come in."
                    : "No matches for your search."}
                </td>
              </tr>
            )}
            {filtered.map((t, i) => (
              <tr key={`${t.order_id}-${i}`} className="border-b border-slate-50 last:border-0" data-testid="txn-row">
                <td className="py-3 pr-3">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-400" />
                </td>
                <td className="py-3 pr-3 font-medium text-slate-700">{t.order_id}</td>
                <td className="py-3 pr-3 text-slate-600">{t.item}</td>
                <td className="py-3 pr-3 text-slate-500">{t.date}</td>
                <td className="py-3 pr-3 font-semibold text-slate-700">{formatPrice(t.price)}</td>
                <td className="py-3 pr-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {t.platform}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
