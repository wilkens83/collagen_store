import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import Newsletter from "./Newsletter";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { to: "/shop", label: "All Products" },
      { to: "/product/retinol-peptide-face-serum", label: "Retinol & Peptide Serum" },
      { to: "/product/sleep-night-recovery-cream", label: "Sleep+ Night Cream" },
    ],
  },
  {
    title: "About",
    links: [
      { to: "/about", label: "Our Philosophy" },
      { to: "/journal", label: "Journal" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/shipping-policy", label: "Shipping Policy" },
      { to: "/refund-policy", label: "Refund & Returns" },
      { to: "/contact", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/refund-policy", label: "Refund Policy" },
      { to: "/shipping-policy", label: "Shipping Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-cream pt-16 pb-10" data-testid="site-footer">
      <div className="container-pnice">
        <Newsletter />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 border-t border-cream/10 pt-12">
          <div className="col-span-2">
            <div className="inline-flex bg-cream rounded-xl px-4 py-3 mb-5 shadow-soft">
              <img src="/logo-pnice.png" alt="P-Nice" className="h-12 w-auto" />
            </div>
            <p className="text-sage text-sm leading-relaxed max-w-xs">
              Clean, botanical night care from P-Nice — thoughtfully formulated to help your skin
              look and feel its best. Cruelty-free. Made in USA.
            </p>
            <div className="flex gap-4 mt-6 text-sage">
              <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-gold transition-colors"><Twitter size={20} strokeWidth={1.5} /></a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs tracking-widest2 uppercase text-gold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sage hover:text-gold transition-colors text-sm"
                      data-testid={`footer-link-${l.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 text-sage text-xs leading-relaxed space-y-3">
          <p className="italic font-serif">
            These statements have not been evaluated by the Food and Drug Administration. This
            product is not intended to diagnose, treat, cure, or prevent any disease. For external
            use only. Patch test before use; discontinue if irritation occurs.
          </p>
          <p>
            Payments are securely processed by Stripe. We never store your card details. Prices in
            USD.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3">
            <span>
              P-Nice · 3008 Woodbridge Dr SE, Grand Rapids, MI 49512 ·{" "}
              <a href="mailto:support@p-nice.com" className="hover:text-gold">
                support@p-nice.com
              </a>
            </span>
            <span>© {new Date().getFullYear()} P-Nice. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
