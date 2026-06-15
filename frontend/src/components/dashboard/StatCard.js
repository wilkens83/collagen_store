import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, delta = 0, tint = "emerald" }) {
  const up = delta >= 0;
  const tints = {
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-slate-100">
      <div className="flex items-start justify-between">
        <span className={`w-10 h-10 rounded-xl grid place-items-center ${tints[tint] || tints.emerald}`}>
          <Icon size={20} strokeWidth={1.9} />
        </span>
      </div>
      <p className="text-slate-400 text-sm mt-4">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl font-bold text-slate-800" data-testid={`stat-${label}`}>
          {value}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold mb-1 ${
            up ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
