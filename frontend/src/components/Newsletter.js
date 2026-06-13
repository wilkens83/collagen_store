import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!consent) {
      setStatus({ ok: false, msg: "Please agree to the Privacy Policy to subscribe." });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/newsletter", { email, consent });
      setStatus({ ok: true, msg: data.message });
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.detail || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center pb-14 max-w-2xl mx-auto" data-testid="newsletter">
      <p className="eyebrow text-gold mb-3">Join the ritual</p>
      <h3 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
        Slow beauty, delivered to your inbox
      </h3>
      <p className="text-sage text-sm mb-6">
        Thoughtful skincare notes and early access to new arrivals. No noise.
      </p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          data-testid="newsletter-email-input"
          className="flex-1 max-w-sm bg-transparent border border-sage/40 rounded-lg px-4 py-3 text-cream placeholder:text-sage/70 focus:outline-none focus:border-gold"
        />
        <button type="submit" disabled={loading} className="btn-primary bg-gold hover:bg-gold/90" data-testid="newsletter-submit">
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
      <label className="flex items-start gap-2 justify-center text-xs text-sage mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          data-testid="newsletter-consent"
          className="mt-0.5 accent-gold"
        />
        <span>
          I agree to receive marketing emails and accept the{" "}
          <Link to="/privacy" className="underline hover:text-gold">Privacy Policy</Link>.
        </span>
      </label>
      {status && (
        <p className={`text-xs mt-3 ${status.ok ? "text-gold" : "text-red-300"}`} data-testid="newsletter-status">
          {status.msg}
        </p>
      )}
    </div>
  );
}
