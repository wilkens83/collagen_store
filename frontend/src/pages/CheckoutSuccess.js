import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api, formatPrice } from "../lib/api";
import Seo from "../components/Seo";
import BotanicalDivider from "../components/BotanicalDivider";

const MAX_ATTEMPTS = 6;
const POLL_INTERVAL = 2000;

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const [state, setState] = useState("polling"); // polling | paid | failed | timeout
  const [order, setOrder] = useState(null);
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setState("failed");
      return;
    }
    let attempts = 0;
    let active = true;

    const poll = async () => {
      try {
        const { data } = await api.get(`/checkout/status/${sessionId}`);
        if (!active) return;
        if (data.payment_status === "paid") {
          setOrder(data);
          setState("paid");
          if (!cleared.current) {
            clear();
            cleared.current = true;
          }
          return;
        }
        if (data.status === "expired") {
          setState("failed");
          return;
        }
        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setState("timeout");
          return;
        }
        setTimeout(poll, POLL_INTERVAL);
      } catch {
        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setState("timeout");
          return;
        }
        setTimeout(poll, POLL_INTERVAL);
      }
    };
    poll();
    return () => {
      active = false;
    };
  }, [sessionId, clear]);

  return (
    <div className="container-luxe py-20 min-h-[60vh] flex items-center justify-center" data-testid="checkout-success-page">
      <Seo title="Order Confirmation" />
      <div className="max-w-lg w-full text-center">
        {state === "polling" && (
          <div data-testid="status-polling">
            <Loader2 className="mx-auto text-gold animate-spin mb-6" size={48} />
            <h1 className="font-serif text-2xl text-forest">Confirming your payment…</h1>
            <p className="text-stone mt-3">One moment while we verify with Stripe.</p>
          </div>
        )}

        {state === "paid" && (
          <div data-testid="status-paid">
            <CheckCircle2 className="mx-auto text-sage mb-6" size={56} />
            <p className="eyebrow text-gold mb-3">Order Confirmed</p>
            <h1 className="font-serif text-3xl text-forest mb-3">Thank you for your order</h1>
            {order?.order_number && (
              <p className="text-charcoal/80">
                Order <strong>{order.order_number}</strong>
              </p>
            )}
            <p className="text-stone mt-2">
              A confirmation receipt has been sent{order?.email ? ` to ${order.email}` : ""}. A free
              sample is included in every order.
            </p>

            {order?.line_items?.length > 0 && (
              <div className="bg-cream-muted rounded-2xl p-6 mt-8 text-left shadow-soft">
                {order.line_items.map((li, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span className="text-charcoal/80">{li.quantity} × {li.name}</span>
                    <span className="font-serif text-charcoal">{formatPrice(li.line_total)}</span>
                  </div>
                ))}
                <div className="border-t border-stone/30 mt-3 pt-3 flex justify-between font-serif text-forest">
                  <span>Total</span>
                  <span>{formatPrice(order.amount)} USD</span>
                </div>
              </div>
            )}

            <BotanicalDivider className="py-8" />
            <Link to="/shop" className="btn-primary" data-testid="success-continue-shopping">Continue Shopping</Link>
          </div>
        )}

        {(state === "failed" || state === "timeout") && (
          <div data-testid="status-failed">
            <XCircle className="mx-auto text-stone mb-6" size={48} />
            <h1 className="font-serif text-2xl text-forest mb-3">
              {state === "timeout" ? "Still processing…" : "We couldn't confirm this order"}
            </h1>
            <p className="text-stone mb-8">
              {state === "timeout"
                ? "Your payment may still be completing. Please check your email for a confirmation, or contact us if you were charged."
                : "If you were charged, please contact support and we'll sort it out right away."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/cart" className="btn-secondary">Back to Cart</Link>
              <Link to="/contact" className="btn-primary">Contact Support</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
