import React from "react";
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Megaphone,
  Tag,
  Store,
  CreditCard,
  Plus,
  Leaf,
  X,
} from "lucide-react";

const MAIN = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "orders", label: "Orders", icon: ShoppingCart, badgeKey: "orders" },
  { key: "products", label: "Products", icon: Package },
  { key: "customer", label: "Customer", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "marketing", label: "Marketing", icon: Megaphone },
  { key: "discount", label: "Discount", icon: Tag },
];

const CHANNELS = [
  { key: "online-store", label: "Online store", icon: Store },
  { key: "point-of-sale", label: "Point of sale", icon: CreditCard },
];

const APPS = [
  { key: "shopee", label: "Shopee", color: "#EE4D2D" },
  { key: "tiktok", label: "Tiktok", color: "#111827" },
  { key: "tokopedia", label: "Tokopedia", color: "#22C55E" },
];

function NavItem({ item, active, badge, onSelect }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(item.key)}
      data-testid={`nav-${item.key}`}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-700 font-semibold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      <Icon size={18} strokeWidth={1.9} className={active ? "text-emerald-600" : "text-slate-400"} />
      <span className="flex-1 text-left">{item.label}</span>
      {badge > 0 && (
        <span className="text-[11px] font-semibold text-white bg-rose-500 rounded-full px-2 py-0.5 leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ active, onSelect, badges = {}, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white grid place-items-center">
              <Leaf size={18} strokeWidth={2} />
            </span>
            <span className="font-semibold text-slate-800 text-lg tracking-tight">P-Nice</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-6">
          <div>
            <p className="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Main Menu
            </p>
            <div className="space-y-1">
              {MAIN.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  active={active === item.key}
                  badge={item.badgeKey ? badges[item.badgeKey] : 0}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Sales Channel
            </p>
            <div className="space-y-1">
              {CHANNELS.map((item) => (
                <NavItem key={item.key} item={item} active={active === item.key} onSelect={onSelect} />
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 mb-2 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Apps
            </p>
            <div className="space-y-1">
              {APPS.map((app) => (
                <button
                  key={app.key}
                  type="button"
                  onClick={() => onSelect(app.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    active === app.key
                      ? "bg-slate-100 text-slate-800 font-semibold"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-md grid place-items-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.label[0]}
                  </span>
                  <span className="flex-1 text-left">{app.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => onSelect("add-apps")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-emerald-600 hover:bg-emerald-50 font-medium"
              >
                <Plus size={18} strokeWidth={2} />
                <span>Add apps</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
