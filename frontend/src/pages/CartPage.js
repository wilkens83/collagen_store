import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, Lock } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "../context/CartContext";
import { formatPrice } from "../lib/api";
import Seo from "../components/Seo";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 5.95;
  const total = subtotal + shipping;

  return (
    <div className="container-pnice py-16 min-h-[60vh]" data-testid="cart-page">
      <Seo title="Cart" />
      <h1 className="h-section mb-10">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone mb-6">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Explore the Collection</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.key} className="flex gap-5 border-b border-stone/20 pb-6" data-testid={`cartpage-line-${item.slug}`}>
                <img src={item.image} alt={item.name} className="w-24 h-28 object-cover rounded-lg bg-cream-muted" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link to={`/product/${item.slug}`} className="font-serif text-lg text-forest hover:text-gold">{item.name}</Link>
                    <span className="font-serif text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <p className="text-xs text-stone mt-1">{item.variant}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-stone/40 rounded-lg">
                      <button onClick={() => updateQty(item.key, item.quantity - 1)} className="px-3 py-2 text-forest hover:text-gold"><Minus size={14} /></button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.key, item.quantity + 1)} className="px-3 py-2 text-forest hover:text-gold"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.key)} className="text-stone hover:text-red-500 flex items-center gap-1 text-xs"><Trash2 size={14} /> Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cream-muted rounded-2xl p-7 h-fit shadow-soft">
            <h2 className="font-serif text-xl text-forest mb-6 uppercase tracking-wide">Order Summary</h2>
            <div className="space-y-3 text-charcoal/80">
              <div className="flex justify-between"><span>Subtotal</span><span data-testid="cartpage-subtotal">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between border-t border-stone/30 pt-3 font-serif text-lg text-forest"><span>Total</span><span data-testid="cartpage-total">{formatPrice(total)} USD</span></div>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-7" data-testid="cartpage-checkout">
              <Lock size={14} /> Proceed to Checkout
            </button>
            <p className="text-xs text-stone text-center mt-4">Secure checkout by Stripe · Free samples included</p>
          </div>
        </div>
      )}
    </div>
  );
}
