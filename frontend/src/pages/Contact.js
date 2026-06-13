import React, { useState } from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import { api } from "../lib/api";
import Seo from "../components/Seo";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await api.post("/contact", form);
      setStatus({ ok: true, msg: data.message });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.detail || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <Seo title="Contact" description="Get in touch with P-Nice customer support." />
      <section className="bg-cream-muted py-16 text-center">
        <p className="eyebrow text-gold mb-3">We're Here</p>
        <h1 className="h-section">Contact Us</h1>
      </section>

      <section className="container-pnice py-16 grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <div className="space-y-8">
          <p className="text-charcoal/80 leading-relaxed">
            Questions about your order, our formulas, or a return? Reach out — we typically reply
            within 1–2 business days.
          </p>
          <div className="space-y-5 text-forest">
            <div className="flex items-center gap-4">
              <Mail className="text-gold" strokeWidth={1.5} />
              {/* Business support email */}
              <a href="mailto:support@p-nice.com" className="hover:text-gold">support@p-nice.com</a>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="text-gold mt-1" strokeWidth={1.5} />
              {/* Business mailing address */}
              <span>P-Nice<br />3008 Woodbridge Dr SE<br />Grand Rapids, MI 49512, USA</span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="text-gold" strokeWidth={1.5} />
              <span>Mon–Fri, 9am–5pm (your timezone)</span>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5" data-testid="contact-form">
          <div>
            <label className="eyebrow text-stone block mb-2">Name</label>
            <input name="name" required value={form.name} onChange={change} data-testid="contact-name" className="w-full border border-stone/40 rounded-lg px-4 py-3 bg-cream focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="eyebrow text-stone block mb-2">Email</label>
            <input type="email" name="email" required value={form.email} onChange={change} data-testid="contact-email" className="w-full border border-stone/40 rounded-lg px-4 py-3 bg-cream focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="eyebrow text-stone block mb-2">Message</label>
            <textarea name="message" required rows={5} value={form.message} onChange={change} data-testid="contact-message" className="w-full border border-stone/40 rounded-lg px-4 py-3 bg-cream focus:outline-none focus:border-gold resize-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="contact-submit">
            {loading ? "Sending..." : "Send Message"}
          </button>
          {status && (
            <p className={`text-sm ${status.ok ? "text-sage" : "text-red-500"}`} data-testid="contact-status">{status.msg}</p>
          )}
        </form>
      </section>
    </div>
  );
}
