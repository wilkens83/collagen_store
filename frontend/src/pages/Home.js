import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck, Gift, Headphones } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import Seo from "../components/Seo";
import ProductCard from "../components/ProductCard";
import BenefitIcon from "../components/BenefitIcon";
import BotanicalDivider from "../components/BotanicalDivider";

const SERUM_SLUG = "retinol-peptide-face-serum";

const HERO_BENEFITS = [
  { icon: "leaf", label: "Clean Ingredients" },
  { icon: "flower", label: "Balance & Calm" },
  { icon: "droplet", label: "Gentle & Effective" },
];

const COMMITMENTS = [
  { icon: "leaf", label: "Natural", note: "Thoughtful, skin-friendly ingredients." },
  { icon: "sparkles", label: "Effective", note: "Formulas designed to visibly perform." },
  { icon: "droplet", label: "Pure", note: "No needless or controversial fillers." },
  { icon: "heart", label: "Ethical", note: "Cruelty-free and responsibly made." },
  { icon: "flower", label: "Ritual", note: "Simple gestures for lasting wellbeing." },
];

const TRUST = [
  { Icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
  { Icon: ShieldCheck, label: "Secure Payment", sub: "Card & PayPal via Stripe" },
  { Icon: Gift, label: "Free Samples", sub: "In every order" },
  { Icon: Headphones, label: "Customer Care", sub: "Here to help you" },
];

const TESTIMONIALS = [
  { quote: "My skin feels calmer and looks smoother in the morning. The serum sinks in beautifully and never feels heavy.", name: "Maya R.", note: "Illustrative review" },
  { quote: "The night cream turned my evening routine into something I actually look forward to. The lavender is so soothing.", name: "Jordan T.", note: "Illustrative review" },
  { quote: "Elegant, gentle, and effective-feeling. My complexion looks more refreshed and hydrated when I wake up.", name: "Priya S.", note: "Illustrative review" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data.products)).catch(() => {});
  }, []);

  const serum = products.find((p) => p.slug === SERUM_SLUG) || products[0];
  const others = products.filter((p) => p.slug !== serum?.slug);

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "P-Nice",
    description:
      "Clean, botanical night-care: a Retinol & Peptide face serum and a Collagen + Hyaluronic Acid night cream. Cruelty-free, made in USA.",
    url: typeof window !== "undefined" ? window.location.origin : undefined,
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      priceCurrency: "USD",
      price: typeof p.price === "number" ? p.price.toFixed(2) : p.price,
      itemOffered: { "@type": "Product", name: p.name },
    })),
  };

  return (
    <div data-testid="home-page">
      <Seo
        title="Retinol & Peptide Serum & Collagen Night Cream"
        description="Discover P-Nice clean night-care — a Retinol & Peptide face serum to refine the look of fine lines, and a Collagen + Hyaluronic Acid night cream for overnight hydration. Cruelty-free, made in USA. Free shipping over $50."
        image={serum?.images?.[0]}
        jsonLd={homeJsonLd}
      />

      {/* HERO — serum-forward */}
      <section className="bg-cream overflow-hidden">
        <div className="container-pnice grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div className="animate-fadeUp">
            <p className="eyebrow text-gold mb-5">Clean · Botanical · Night Care</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase font-light text-forest leading-[1.05]">
              Skincare in<br />service of your<br />natural glow.
            </h1>
            <div className="w-16 h-px bg-gold/60 my-7" />
            <p className="text-charcoal/80 text-lg leading-relaxed max-w-md">
              A small ritual of well-made night-care, led by our Retinol &amp; Peptide Serum —
              formulated to help your skin look polished, hydrated and refreshed by morning.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link to={`/product/${SERUM_SLUG}`} className="btn-primary" data-testid="hero-serum-cta">Shop the Retinol Serum</Link>
              <Link to="/about" className="btn-secondary" data-testid="hero-about-cta">Our Philosophy</Link>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-12">
              {HERO_BENEFITS.map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center w-24">
                  <BenefitIcon name={b.icon} size={24} />
                  <span className="text-[11px] tracking-wide uppercase text-forest mt-2 leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fadeIn">
            <div className="overflow-hidden rounded-2xl shadow-lift aspect-[4/5] bg-cream-muted">
              <img
                src={serum?.images?.[0] || "https://images.unsplash.com/photo-1680443285773-ef42672d00da?q=85&w=1000"}
                alt="P-Nice Retinol & Peptide Face Serum on a stone pedestal with botanicals"
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              to={`/product/${SERUM_SLUG}`}
              className="absolute top-5 left-5 bg-cream/95 backdrop-blur rounded-full px-4 py-2 text-[11px] tracking-widest2 uppercase text-forest shadow-soft hover:text-gold"
            >
              Hero · Retinol &amp; Peptide Serum
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED SERUM SPOTLIGHT — dark band */}
      {serum && (
        <section className="bg-forest text-cream" data-testid="serum-spotlight">
          <div className="container-pnice grid lg:grid-cols-2 gap-12 items-center py-16">
            <div className="overflow-hidden rounded-2xl aspect-[5/4] order-1">
              <img src={serum.images[0]} alt={serum.name} className="w-full h-full object-cover" />
            </div>
            <div className="order-2">
              <p className="eyebrow text-gold mb-4">The Hero Product</p>
              <h2 className="font-serif text-3xl lg:text-[2.5rem] tracking-wide uppercase font-light leading-[1.1] mb-5">
                {serum.name}
              </h2>
              <p className="text-sage leading-relaxed mb-6 max-w-md">{serum.subheadline}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-7">
                {serum.benefit_tiles?.slice(0, 3).map((t) => (
                  <span key={t.label} className="flex items-center gap-2 text-sm text-cream/90">
                    <BenefitIcon name={t.icon} size={18} /> {t.label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-6">
                <Link to={`/product/${SERUM_SLUG}`} className="btn-secondary border-gold inline-flex" data-testid="spotlight-cta">
                  Discover the Serum <ArrowRight size={16} />
                </Link>
                <span className="font-serif text-2xl">{formatPrice(serum.price)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BRAND STORY */}
      <section className="bg-cream" data-testid="story-section">
        <div className="container-pnice grid lg:grid-cols-2 gap-12 items-center py-20">
          <div className="overflow-hidden rounded-2xl aspect-[5/4] order-2 lg:order-1 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1581182800629-7d90925ad072?q=85&w=1000"
              alt="A calm, botanical skincare philosophy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 relative">
            <p className="eyebrow text-gold mb-4">Our Philosophy</p>
            <h2 className="font-serif text-3xl lg:text-4xl tracking-wide uppercase font-light text-forest mb-6 leading-[1.15]">
              A quieter kind of<br />skincare.
            </h2>
            <p className="text-charcoal/80 leading-relaxed mb-4 max-w-md">
              We believe great skincare is calm — a small set of well-made products you reach for
              every night. No noise, no overpromises. Just clean, considered formulas built around
              your skin's natural overnight rhythm.
            </p>
            <p className="text-charcoal/80 leading-relaxed mb-8 max-w-md">
              Every product is cruelty-free, made in the USA, and positioned exactly as what it is:
              a cosmetic ritual for your skin.
            </p>
            <Link to="/about" className="btn-secondary" data-testid="story-learn-more">Learn More</Link>
          </div>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="container-pnice py-16" data-testid="commitments-section">
        <div className="text-center mb-14">
          <p className="eyebrow text-gold mb-3">Our Commitments</p>
          <h2 className="h-section">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y divide-stone/15 md:divide-y-0 md:divide-x md:divide-stone/15">
          {COMMITMENTS.map((c) => (
            <div key={c.label} className="flex flex-col items-center text-center px-4 py-6">
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-4">
                <BenefitIcon name={c.icon} size={26} />
              </div>
              <span className="text-sm tracking-wide uppercase text-forest mb-2">{c.label}</span>
              <p className="text-xs text-charcoal/65 leading-relaxed">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE ESSENTIALS */}
      <section className="bg-cream-muted py-16" data-testid="collection-section">
        <div className="container-pnice">
          <div className="text-center mb-12">
            <p className="eyebrow text-gold mb-3">The Essentials</p>
            <h2 className="h-section">Build Your Night Ritual</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((p) => (
              <div key={p.id} className="bg-cream rounded-2xl border border-stone/20 p-6 shadow-soft">
                <ProductCard product={p} />
              </div>
            ))}
            <Link
              to="/shop"
              className="rounded-2xl border border-gold/40 p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-gold transition-colors"
              data-testid="essentials-shop-all"
            >
              <BotanicalDivider className="w-24" />
              <h3 className="font-serif text-xl text-forest">The Complete Ritual</h3>
              <p className="text-sm text-charcoal/70 max-w-[16rem]">Serum and night cream, together — explore the full collection.</p>
              <span className="btn-secondary mt-2 inline-flex">Shop All <ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL + TRUST BAND */}
      <section className="container-pnice py-16" data-testid="testimonials-section">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="eyebrow text-gold mb-6">In Their Words</p>
            <blockquote className="font-serif italic text-2xl sm:text-3xl text-sage leading-relaxed min-h-[150px]">
              “{TESTIMONIALS[active].quote}”
            </blockquote>
            <p className="mt-6 text-forest tracking-wide uppercase text-sm">{TESTIMONIALS[active].name}</p>
            <p className="text-xs text-stone mt-1">{TESTIMONIALS[active].note}</p>
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
              <button onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="text-forest hover:text-gold" data-testid="testimonial-prev" aria-label="Previous"><ChevronLeft /></button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full ${i === active ? "bg-gold" : "bg-stone/50"}`} aria-label={`Testimonial ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)} className="text-forest hover:text-gold" data-testid="testimonial-next" aria-label="Next"><ChevronRight /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-10 gap-x-6 lg:border-l lg:border-stone/20 lg:pl-16" data-testid="trust-row">
            {TRUST.map(({ Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <Icon size={24} strokeWidth={1.5} className="text-gold" />
                <span className="text-sm text-forest tracking-wide uppercase">{label}</span>
                <span className="text-xs text-stone leading-tight">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
