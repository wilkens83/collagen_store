import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, Lock } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "../context/CartContext";
import { formatPrice } from "../lib/api";

export default function CartDrawer() {
  const { items, subtotal, drawerOpen, closeDrawer, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      <div
        className={`fixed inset-0 bg-forest/20 z-50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        data-testid="cart-overlay"
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-50 shadow-lift flex flex-col transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone/30">
          <h2 className="font-serif text-xl text-forest tracking-wide uppercase">Your Cart</h2>
          <button onClick={closeDrawer} data-testid="cart-drawer-close" aria-label="Close cart" className="text-forest hover:text-gold">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-stone mb-6">Your cart is quietly waiting.</p>
            <button onClick={() => { closeDrawer(); navigate("/shop"); }} className="btn-primary" data-testid="cart-empty-shop">
              Explore the Collection
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 bg-cream-muted text-center text-xs text-forest tracking-wide">
              {remaining > 0
                ? `You're ${formatPrice(remaining)} away from free shipping`
                : "You've unlocked free shipping ✦"}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4" data-testid={`cart-line-${item.slug}`}>
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg bg-cream-muted" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <Link to={`/product/${item.slug}`} onClick={closeDrawer} className="font-serif text-forest leading-tight hover:text-gold">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.key)} className="text-stone hover:text-red-500" aria-label="Remove" data-testid={`cart-remove-${item.slug}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-stone mt-1">{item.variant}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone/40 rounded-lg">
                        <button onClick={() => updateQty(item.key, item.quantity - 1)} className="px-2 py-1 text-forest hover:text-gold" data-testid={`cart-dec-${item.slug}`}><Minus size={14} /></button>
                        <span className="px-3 text-sm" data-testid={`cart-qty-${item.slug}`}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.key, item.quantity + 1)} className="px-2 py-1 text-forest hover:text-gold" data-testid={`cart-inc-${item.slug}`}><Plus size={14} /></button>
                      </div>
                      <span className="font-serif text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone/30 px-6 py-5 space-y-4">
              <div className="flex justify-between text-forest">
                <span className="tracking-wide uppercase text-sm">Subtotal</span>
                <span className="font-serif text-lg" data-testid="cart-subtotal">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-stone">Shipping & taxes calculated at checkout. Free samples in every order.</p>
              <button onClick={goCheckout} className="btn-primary w-full" data-testid="proceed-to-checkout">
                <Lock size={14} /> Proceed to Checkout
              </button>
              <button onClick={() => { closeDrawer(); navigate("/cart"); }} className="block w-full text-center text-xs tracking-widest2 uppercase text-forest hover:text-gold" data-testid="view-cart-link">
                View full cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
