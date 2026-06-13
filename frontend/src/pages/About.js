import React from "react";
import Seo from "../components/Seo";
import BotanicalDivider from "../components/BotanicalDivider";
import BenefitIcon from "../components/BenefitIcon";

const VALUES = [
  { icon: "leaf", title: "Clean", body: "Carefully chosen ingredients, with cosmetic claims grounded in how skin looks and feels." },
  { icon: "heart", title: "Cruelty-Free", body: "Never tested on animals — beauty should never come at their expense." },
  { icon: "eye", title: "Transparent", body: "Plain-language ingredient lists and honest, non-medical product positioning." },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <Seo title="About" description="The P-Nice story — clean, botanical night care, formulated with restraint." />

      <section className="bg-forest text-cream py-20 text-center">
        <div className="container-pnice">
          <p className="eyebrow text-gold mb-4">Our Story</p>
          <h1 className="font-serif text-4xl lg:text-5xl tracking-wide uppercase font-light">Beauty, the slow way</h1>
        </div>
      </section>

      <section className="container-pnice py-16 max-w-3xl mx-auto text-charcoal/90 leading-relaxed space-y-6 text-lg">
        <p>
          P-Nice began with a simple idea: that a skincare routine should feel like a quiet,
          grounding ritual — not a chore or a chase after the next trend. We set out to make a small
          collection of clean, botanical formulas you'd genuinely look forward to using each night.
        </p>
        <p>
          We formulate with restraint, choosing ingredients for how they help skin look and feel,
          and we describe them honestly. Our products are cosmetics for external use — designed to
          support the appearance of healthy, hydrated, refreshed skin.
        </p>
        <p>
          Everything we make is cruelty-free and made in the USA, and we're committed to
          transparency in our ingredients, our claims, and our policies.
        </p>
      </section>

      <BotanicalDivider className="py-6" />

      <section className="container-pnice py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {VALUES.map((v) => (
            <div key={v.title} className="text-center">
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-5">
                <BenefitIcon name={v.icon} size={26} />
              </div>
              <h3 className="font-serif text-2xl text-forest mb-3">{v.title}</h3>
              <p className="text-charcoal/70 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
