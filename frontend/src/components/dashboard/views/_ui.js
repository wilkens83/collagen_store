import React from "react";

export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-slate-100 ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHeading({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ children }) {
  return <div className="py-12 text-center text-slate-400 text-sm">{children}</div>;
}

export function Loader() {
  return <div className="py-12 text-center text-slate-400 text-sm">Loading…</div>;
}

export function StatusPill({ status }) {
  const map = {
    paid: "bg-emerald-50 text-emerald-600",
    active: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    unpaid: "bg-amber-50 text-amber-600",
    open: "bg-amber-50 text-amber-600",
    canceled: "bg-rose-50 text-rose-600",
    expired: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[status] || "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}
