import React, { useMemo, useRef, useState } from "react";

const W = 640;
const H = 240;
const PAD = { top: 24, right: 16, bottom: 28, left: 16 };

function smoothPath(pts) {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

export default function SalesChart({ series = [], currency = "USD" }) {
  const [hover, setHover] = useState(null);
  const ref = useRef(null);

  const fmt = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(v || 0);

  const { pts, line, area, hasData } = useMemo(() => {
    const n = series.length;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const values = series.map((s) => s.value || 0);
    const maxV = Math.max(...values, 1);
    const hasData = values.some((v) => v > 0);
    const pts = series.map((s, i) => {
      const x = PAD.left + (n <= 1 ? innerW / 2 : (innerW * i) / (n - 1));
      const y = PAD.top + innerH - (innerH * (s.value || 0)) / maxV;
      return { x, y, ...s };
    });
    const line = smoothPath(pts);
    const area =
      pts.length > 1
        ? `${line} L ${pts[pts.length - 1].x} ${H - PAD.bottom} L ${pts[0].x} ${H - PAD.bottom} Z`
        : "";
    return { pts, line, area, max: maxV, hasData };
  }, [series]);

  const onMove = (e) => {
    if (!ref.current || pts.length === 0) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - x);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setHover(nearest);
  };

  const labelEvery = Math.max(1, Math.ceil(series.length / 8));

  return (
    <div className="relative w-full">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        data-testid="sales-chart"
      >
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + (H - PAD.top - PAD.bottom) * g}
            y2={PAD.top + (H - PAD.top - PAD.bottom) * g}
            stroke="#eef2f7"
            strokeWidth="1"
          />
        ))}

        {area && <path d={area} fill="url(#salesFill)" />}
        {line && <path d={line} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />}

        {pts.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={p.x} y={H - 8} textAnchor="middle" className="fill-slate-400" fontSize="11">
              {p.label}
            </text>
          ) : null
        )}

        {hover != null && pts[hover] && (
          <g>
            <line
              x1={pts[hover].x}
              x2={pts[hover].x}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="#cbd5e1"
              strokeDasharray="4 4"
            />
            <circle cx={pts[hover].x} cy={pts[hover].y} r="5" fill="#10b981" stroke="#fff" strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {hover != null && pts[hover] && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none bg-slate-900 text-white rounded-lg px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(pts[hover].x / W) * 100}%`,
            top: `${(pts[hover].y / H) * 100}%`,
            marginTop: "-10px",
          }}
        >
          <div className="font-semibold">{pts[hover].label}</div>
          <div className="text-emerald-300">{fmt(pts[hover].value)}</div>
        </div>
      )}

      {!hasData && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="text-sm text-slate-400 bg-white/70 px-3 py-1 rounded-full">
            No sales in this period yet
          </span>
        </div>
      )}
    </div>
  );
}
