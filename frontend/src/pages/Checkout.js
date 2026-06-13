import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "../context/CartContext";
import { api, formatPrice } from "../lib/api";
import Seo from "../components/Seo";
import Disclaimer from "../components/Disclaimer";

export default function Checkout() {
  const { items, subtotal } = useCart();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.95;
  const total = subtotal + shipping;

  const pay = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, variant: i.variant })),
        origin_url: window.location.origin,
        email,
      };
      const { data } = await api.post("/checkout/session", payload);
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe-hosted checkout
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Unable to start checkout.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-pnice py-32 text-center" data-testid="checkout-empty">
        <Seo title="Checkout" />
        <p className="text-stone mb-6">There's nothing to check out yet.</p>
        <Link to="/shop" className="btn-primary">Explore the Collection</Link>
      </div>
    );
  }

  return (
    <div className="container-pnice py-16 min-h-[60vh]" data-testid="checkout-page">
      <Seo title="Checkout" />
      <h1 className="h-section mb-10 text-center">Secure Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Order summary */}
        <div className="bg-cream-muted rounded-2xl p-7 shadow-soft order-2 lg:order-1">
          <h2 className="font-serif text-xl text-forest mb-6 uppercase tracking-wide">Order Summary</h2>
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.key} className="flex gap-4" data-testid={`checkout-line-${i.slug}`}>
                <img src={i.image} alt={i.name} className="w-16 h-20 object-cover rounded-lg" />
                <div className="flex-1 text-sm">
                  <p className="font-serif text-forest">{i.name}</p>
                  <p className="text-stone text-xs">{i.variant} · Qty {i.quantity}</p>
                </div>
                <span className="font-serif text-charcoal">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone/30 mt-6 pt-4 space-y-2 text-charcoal/80 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-serif text-lg text-forest pt-2"><span>Total</span><span data-testid="checkout-total">{formatPrice(total)} USD</span></div>
          </div>
        </div>

        {/* Payment */}
        <div className="order-1 lg:order-2">
          <form onSubmit={pay} className="space-y-5">
            <div>
              <label className="eyebrow text-stone block mb-2">Email for receipt</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                data-testid="checkout-email"
                className="w-full border border-stone/40 rounded-lg px-4 py-3 bg-cream focus:outline-none focus:border-gold"
              />
            </div>
            <div className="bg-cream-muted rounded-xl p-4 flex items-start gap-3 text-sm text-charcoal/80">
              <ShieldCheck className="text-gold mt-0.5 shrink-0" strokeWidth={1.5} />
              <span>
              Card details are entered securely on Stripe's hosted checkout. We never see or store
                your card number. Shipping address is collected at the next step.
              </span>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="pay-with-stripe">
              <Lock size={14} /> {loading ? "Redirecting to Stripe..." : `Pay ${formatPrice(total)} with Stripe`}
            </button>
            {error && <p className="text-sm text-red-500" data-testid="checkout-error">{error}</p>}
            <p className="text-xs text-stone text-center">Free shipping over $50 · Secure checkout · Free samples</p>
          </form>
          <div className="mt-8">
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
