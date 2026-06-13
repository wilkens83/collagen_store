import React from "react";
import Seo from "../components/Seo";
import BotanicalDivider from "../components/BotanicalDivider";

const POSTS = [
  {
    title: "The Case for a Slower Night Routine",
    excerpt: "Why winding down your skincare ritual may help you enjoy it more — and stick with it.",
    image: "https://images.unsplash.com/photo-1555820585-c5ae44394b79?q=85&w=900",
    tag: "Ritual",
  },
  {
    title: "Understanding Retinol & Peptides (Gently)",
    excerpt: "A plain-language look at two of skincare's most talked-about cosmetic ingredients.",
    image: "https://images.unsplash.com/photo-1680443285773-ef42672d00da?q=85&w=900",
    tag: "Ingredients",
  },
  {
    title: "Hydration, Layered",
    excerpt: "How hyaluronic acid and rich creams work together to help skin look plump by morning.",
    image: "https://images.unsplash.com/photo-1763503836825-97f5450d155a?q=85&w=900",
    tag: "Hydration",
  },
];

export default function Journal() {
  return (
    <div data-testid="journal-page">
      <Seo title="Journal" description="Thoughtful skincare notes from P-Nice." />
      <section className="bg-cream-muted py-16 text-center">
        <p className="eyebrow text-gold mb-3">The Journal</p>
        <h1 className="h-section">Notes on Slow Beauty</h1>
      </section>
      <BotanicalDivider className="py-10" />
      <section className="container-luxe pb-20 grid md:grid-cols-3 gap-10">
        {POSTS.map((post) => (
          <article key={post.title} className="group cursor-pointer" data-testid="journal-post">
            <div className="overflow-hidden rounded-xl aspect-[4/3] mb-5 bg-cream-muted shadow-soft">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <span className="eyebrow text-gold">{post.tag}</span>
            <h3 className="font-serif text-xl text-forest mt-2 mb-2 group-hover:text-gold transition-colors">{post.title}</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">{post.excerpt}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
