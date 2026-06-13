import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        className="bg-forest text-cream text-[11px] sm:text-xs py-2 text-center tracking-widest2 uppercase px-4"
        data-testid="announcement-bar"
      >
        Free shipping over $50 · Secure checkout · Clean, dermatologist-conscious formulas
      </div>

      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-stone/30">
        <div className="container-luxe flex items-center justify-between h-20">
          <button
            className="lg:hidden text-forest"
            onClick={() => setMobileOpen((o) => !o)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            to="/"
            className="font-display text-2xl sm:text-3xl tracking-widest2 text-forest"
            data-testid="logo-link"
          >
            P-NICE
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-xs tracking-widest2 uppercase transition-colors ${
                    isActive ? "text-gold" : "text-forest hover:text-gold"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5 text-forest">
            <button
              aria-label="Search"
              data-testid="search-icon"
              onClick={() => navigate("/shop")}
              className="hover:text-gold transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Account"
              data-testid="account-icon"
              onClick={() => navigate("/contact")}
              className="hidden sm:block hover:text-gold transition-colors"
            >
              <User size={20} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Cart"
              data-testid="cart-icon"
              onClick={openDrawer}
              className="relative hover:text-gold transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -top-2 -right-2 bg-gold text-cream text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-stone/30 bg-cream" data-testid="mobile-nav">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 text-sm tracking-widest2 uppercase text-forest border-b border-stone/10"
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
