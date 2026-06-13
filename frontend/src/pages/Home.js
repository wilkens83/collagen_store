import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../lib/api";
import Seo from "../components/Seo";
import ProductCard from "../components/ProductCard";
import BenefitIcon from "../components/BenefitIcon";
import BotanicalDivider from "../components/BotanicalDivider";

const BADGES = [
  { icon: "leaf", label: "Clean Ingredients" },
  { icon: "heart", label: "Cruelty-Free" },
  { icon: "pin", label: "Made in USA" },
];

const COMMITMENTS = [
  { icon: "leaf", label: "Clean" },
  { icon: "sparkles", label: "Effective" },
  { icon: "heart", label: "Cruelty-Free" },
  { icon: "flower", label: "Thoughtfully Formulated" },
  { icon: "eye", label: "Transparent" },
];

const TRUST = [
  { icon: "droplet", label: "Free shipping over $50" },
  { icon: "shield", label: "Secure Stripe checkout" },
  { icon: "flower", label: "Samples in every order" },
  { icon: "heart", label: "Responsive support" },
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

  const hero = products[0];

  return (
    <div data-testid="home-page">
      <Seo
        title="Clean, Botanical Night Care"
        description="LUXE SKIN — two thoughtfully formulated night-care essentials. Clean, cruelty-free, made in USA. Secure checkout by Stripe."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "LUXE SKIN",
          description: "Clean, botanical night care.",
        }}
      />

      {/* HERO */}
      <section className="bg-cream">
        <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div className="animate-fadeUp">
            <p className="eyebrow text-gold mb-5">Clean · Botanical · Night Care</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase font-light text-forest leading-[1.05]">
              Beauty, the<br />slow way.
            </h1>
            <p className="text-charcoal/80 text-lg leading-relaxed mt-6 max-w-md">
              Two thoughtfully formulated essentials designed to help your skin look polished,
              hydrated and refreshed by morning.
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <Link to="/shop" className="btn-primary" data-testid="hero-shop-cta">Shop the Collection</Link>
              <Link to="/about" className="btn-secondary" data-testid="hero-about-cta">Our Philosophy</Link>
            </div>
          </div>
          <div className="relative animate-fadeIn">
            <div className="overflow-hidden rounded-2xl shadow-lift aspect-[4/5] bg-cream-muted">
              <img
                src={hero?.images?.[0] || "https://images.unsplash.com/photo-1680443285773-ef42672d00da?q=85&w=1000"}
                alt="LUXE SKIN serum on a stone pedestal with botanicals"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-2 sm:left-6 bg-cream rounded-xl shadow-soft px-5 py-4 flex gap-5">
              {BADGES.map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center w-20">
                  <BenefitIcon name={b.icon} size={22} />
                  <span className="text-[10px] tracking-wider uppercase text-forest mt-2 leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BotanicalDivider className="py-10" />

      {/* THE COLLECTION */}
      <section className="container-luxe py-8 lg:py-12" data-testid="collection-section">
        <div className="text-center mb-12">
          <p className="eyebrow text-gold mb-3">The Collection</p>
          <h2 className="h-section">Two Rituals. One Glow.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BRAND STORY BAND */}
      <section className="bg-forest text-cream my-16">
        <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center py-16">
          <div className="overflow-hidden rounded-2xl aspect-[5/4] order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1581182800629-7d90925ad072?q=85&w=1000"
              alt="Natural skincare philosophy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow text-gold mb-4">Our Philosophy</p>
            <h2 className="font-serif text-3xl lg:text-4xl tracking-wide uppercase font-light mb-6">
              Formulated with restraint.
            </h2>
            <p className="text-sage leading-relaxed mb-4">
              We believe great skincare is quiet — a small set of well-made products you reach for
              every night. No noise, no overpromises. Just clean, considered formulas designed to
              help your skin look and feel its best.
            </p>
            <p className="text-sage leading-relaxed mb-8">
              Every product is cruelty-free, made in the USA, and positioned exactly as what it is:
              a cosmetic ritual for your skin.
            </p>
            <Link to="/about" className="btn-secondary border-gold" data-testid="story-learn-more">Learn More</Link>
          </div>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="container-luxe py-8" data-testid="commitments-section">
        <div className="text-center mb-12">
          <p className="eyebrow text-gold mb-3">Our Commitments</p>
          <h2 className="h-section">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {COMMITMENTS.map((c) => (
            <div key={c.label} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-4">
                <BenefitIcon name={c.icon} size={26} />
              </div>
              <span className="text-sm tracking-wide uppercase text-forest">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <BotanicalDivider className="py-12" />

      {/* TESTIMONIALS */}
      <section className="container-luxe py-8 text-center max-w-3xl mx-auto" data-testid="testimonials-section">
        <p className="eyebrow text-gold mb-6">In Their Words</p>
        <blockquote className="font-serif italic text-2xl sm:text-3xl text-sage leading-relaxed min-h-[160px]">
          “{TESTIMONIALS[active].quote}”
        </blockquote>
        <p className="mt-6 text-forest tracking-wide uppercase text-sm">{TESTIMONIALS[active].name}</p>
        <p className="text-xs text-stone mt-1">{TESTIMONIALS[active].note}</p>
        <div className="flex items-center justify-center gap-6 mt-8">
          <button onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="text-forest hover:text-gold" data-testid="testimonial-prev" aria-label="Previous"><ChevronLeft /></button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full ${i === active ? "bg-gold" : "bg-stone/50"}`} aria-label={`Testimonial ${i + 1}`} />
            ))}
          </div>
          <button onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)} className="text-forest hover:text-gold" data-testid="testimonial-next" aria-label="Next"><ChevronRight /></button>
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="bg-cream-muted mt-16" data-testid="trust-row">
        <div className="container-luxe grid grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {TRUST.map((t) => (
            <div key={t.label} className="flex flex-col items-center text-center gap-3">
              <BenefitIcon name={t.icon} size={26} />
              <span className="text-sm text-forest tracking-wide">{t.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
