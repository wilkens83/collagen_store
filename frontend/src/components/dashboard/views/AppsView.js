import React from "react";
import { ExternalLink, Plus, Check } from "lucide-react";
import { Panel, PageHeading } from "./_ui";

const APP_META = {
  shopify: {
    label: "Shopify",
    color: "#95BF47",
    url: "https://www.shopify.com",
    desc: "Sync your products, orders, and inventory with a Shopify storefront.",
  },
  tiktok: {
    label: "TikTok Shop",
    color: "#111827",
    url: "https://seller.tiktok.com",
    desc: "Sell your products directly to shoppers on TikTok Shop.",
  },
  tokopedia: {
    label: "Tokopedia",
    color: "#42B549",
    url: "https://www.tokopedia.com",
    desc: "List your catalog on Tokopedia's marketplace.",
  },
};

const MARKETPLACE = [
  ...Object.entries(APP_META).map(([key, m]) => ({ key, ...m })),
  { key: "mailchimp", label: "Mailchimp", color: "#FFE01B", url: "https://mailchimp.com", desc: "Automate email campaigns to your subscribers." },
  { key: "meta", label: "Meta Ads", color: "#1877F2", url: "https://business.facebook.com", desc: "Run ads across Facebook and Instagram." },
];

function AppLogo({ label, color, size = 40 }) {
  return (
    <span className="rounded-xl grid place-items-center text-white font-bold" style={{ backgroundColor: color, width: size, height: size }}>
      {label[0]}
    </span>
  );
}

export default function AppsView({ app }) {
  if (app === "add-apps") {
    return (
      <div className="space-y-5">
        <PageHeading title="Add apps" subtitle="Connect sales channels and tools" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MARKETPLACE.map((m) => (
            <Panel key={m.key} className="!p-4" >
              <div className="flex items-start gap-3">
                <AppLogo label={m.label} color={m.color} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{m.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                  <a href={m.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline">
                    <Plus size={14} /> Connect <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    );
  }

  const meta = APP_META[app];
  if (!meta) return null;

  return (
    <div className="space-y-5">
      <PageHeading title={meta.label} subtitle="App integration" />
      <Panel>
        <div className="flex flex-wrap items-start gap-4">
          <AppLogo label={meta.label} color={meta.color} size={56} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-slate-800 text-lg">{meta.label}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">Not connected</span>
            </div>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">{meta.desc}</p>

            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Sync products and pricing</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Import orders into this dashboard</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> One unified view of every channel</li>
            </ul>

            <a href={meta.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-emerald-700">
              Connect {meta.label} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </Panel>
    </div>
  );
}
