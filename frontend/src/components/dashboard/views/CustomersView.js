import React, { useState } from "react";
import { Search, Users, Mail } from "lucide-react";
import { formatPrice } from "../../../lib/api";
import useSection from "../useSection";
import StatCard from "../StatCard";
import { Panel, PageHeading, EmptyState, Loader } from "./_ui";

export default function CustomersView() {
  const { data, loading, error } = useSection("/dashboard/customers");
  const [q, setQ] = useState("");
  const rows = (data?.customers || []).filter((c) => c.customer.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeading title="Customers" subtitle="People who have ordered from your store" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={Users} label="Customers" value={loading ? "—" : data?.total ?? 0} delta={0} tint="emerald" />
        <StatCard icon={Mail} label="Newsletter leads" value={loading ? "—" : data?.subscriber_leads ?? 0} delta={0} tint="sky" />
      </div>

      <Panel
        action={
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers" className="pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-300 w-52" />
          </div>
        }
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <EmptyState>Couldn't load customers: {error}</EmptyState>
        ) : rows.length === 0 ? (
          <EmptyState>No customers yet — they'll appear here after the first paid order.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Orders</th>
                  <th className="py-2 pr-3 font-medium">Total spent</th>
                  <th className="py-2 pr-3 font-medium">Last order</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0" data-testid="customer-row">
                    <td className="py-3 pr-3 font-medium text-slate-700">{c.customer}</td>
                    <td className="py-3 pr-3 text-slate-600">{c.orders}</td>
                    <td className="py-3 pr-3 font-semibold text-slate-700">{formatPrice(c.total_spent)}</td>
                    <td className="py-3 pr-3 text-slate-500">{c.last_order}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <p className="text-xs text-slate-400">Emails are masked for privacy while the dashboard is public.</p>
    </div>
  );
}
