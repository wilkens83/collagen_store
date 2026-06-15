import React from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import useSection from "../useSection";
import StatCard from "../StatCard";
import { Panel, PageHeading, EmptyState, Loader } from "./_ui";

export default function MarketingView() {
  const { data, loading, error } = useSection("/dashboard/marketing");

  return (
    <div className="space-y-5">
      <PageHeading title="Marketing" subtitle="Newsletter subscribers and customer messages" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={Mail} label="Subscribers" value={loading ? "—" : data?.subscriber_count ?? 0} delta={0} tint="emerald" />
        <StatCard icon={MessageSquare} label="Messages" value={loading ? "—" : data?.message_count ?? 0} delta={0} tint="sky" />
      </div>

      {error && <Panel><EmptyState>Couldn't load marketing data: {error}</EmptyState></Panel>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title="Newsletter subscribers"
          action={
            <button className="inline-flex items-center gap-1.5 text-sm bg-emerald-600 text-white rounded-lg px-3 py-2 hover:bg-emerald-700">
              <Send size={14} /> Compose
            </button>
          }
        >
          {loading ? (
            <Loader />
          ) : (data?.subscribers || []).length === 0 ? (
            <EmptyState>No subscribers yet. Signups from the storefront appear here.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-50">
              {data.subscribers.map((s, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm" data-testid="subscriber-row">
                  <span className="text-slate-700">{s.customer}</span>
                  <span className="text-slate-400 text-xs">{s.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Contact messages">
          {loading ? (
            <Loader />
          ) : (data?.messages || []).length === 0 ? (
            <EmptyState>No messages yet.</EmptyState>
          ) : (
            <ul className="space-y-3">
              {data.messages.map((m, i) => (
                <li key={i} className="border border-slate-100 rounded-xl p-3" data-testid="message-row">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 text-sm">{m.name}</span>
                    <span className="text-xs text-slate-400">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.customer}</p>
                  <p className="text-sm text-slate-600 mt-1">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
