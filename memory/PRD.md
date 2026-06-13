# LUXE SKIN — Product Requirements & Build Log

## Original Problem Statement
Production-ready e-commerce site for premium skincare brand "LUXE SKIN" selling two physical
products via Stripe. Natural-luxe (calm, botanical, editorial) aesthetic. Strict Stripe
restricted-business + FTC cosmetic compliance. Full legal pages, secure checkout, confirmation email.

## Tech Stack / Architecture
- Frontend: React (CRA) + Tailwind CSS, React Router, framer-motion, lucide-react, react-helmet-async (SEO/JSON-LD).
- Backend: FastAPI + MongoDB (motor). All routes under `/api`.
- Payments: Stripe Checkout (hosted) via emergentintegrations StripeCheckout. Server-side pricing only; no card data stored.
- Email: Resend (order confirmation) — graceful skip when RESEND_API_KEY unset.

## User Choices
Stripe Checkout (hosted) · Resend email · default prices (Serum $68 / Cream $54) · MongoDB · user will supply own Stripe keys.

## Core Requirements (static)
- Two products with exact copy (cosmetic, non-medical/non-supplement positioning).
- Sticky header + announcement bar, slide-out cart drawer, localStorage cart.
- Home, Shop, Product Detail (x2), Cart, Checkout, Order Confirmation, About, Journal, Contact.
- Legal: Terms, Privacy, Refund, Shipping — linked in footer on every page.
- Cosmetic disclaimer on every product page + footer. Business transparency + "payments by Stripe" in footer.
- SEO meta, Open Graph, JSON-LD (Product + FAQPage). WCAG-conscious, mobile-first.

## What's Been Implemented (2026-06-13)
- ✅ Full storefront (all pages above) with natural-luxe design system (cream/forest/sage/gold).
- ✅ Backend APIs: products, config, checkout/session (server-side price), checkout/status (idempotent finalize), webhook/stripe (signature verified), contact, newsletter (consent required).
- ✅ Stripe hosted checkout flow verified (redirects to checkout.stripe.com); orders + payment_transactions collections.
- ✅ Compliance copy, disclaimers, consent on newsletter, PLACEHOLDERS for price/address/email/descriptor.
- ✅ Tested: 16 backend pytest + 18 frontend Playwright flows — 100% pass.

## Prioritized Backlog
- P1: Add own live Stripe keys (replace STRIPE_API_KEY) + set RESEND_API_KEY for live emails.
- P1: Fill PLACEHOLDERS (final prices, business legal name/address, support email, statement descriptor).
- P2: Account/login + order history; product reviews; richer Journal (CMS/blog).
- P2: Restrict CORS to deployed domain; split server.py into routers as catalog grows.

## Next Tasks
- Awaiting user: real Stripe keys, Resend API key, business details to replace placeholders.
