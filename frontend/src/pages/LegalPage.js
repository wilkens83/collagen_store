import React from "react";
import { LEGAL } from "../data/legal";
import Seo from "../components/Seo";
import BotanicalDivider from "../components/BotanicalDivider";
import Disclaimer from "../components/Disclaimer";

export default function LegalPage({ docKey }) {
  const doc = LEGAL[docKey];
  if (!doc) return null;

  return (
    <div data-testid={`legal-page-${docKey}`}>
      <Seo title={doc.title} description={doc.intro} />
      <section className="bg-cream-muted py-16 text-center">
        <p className="eyebrow text-gold mb-3">Policy</p>
        <h1 className="h-section">{doc.title}</h1>
      </section>

      <article className="container-luxe py-14 max-w-3xl mx-auto">
        <p className="text-charcoal/80 leading-relaxed text-lg mb-10">{doc.intro}</p>
        <div className="space-y-9">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-serif text-xl text-forest mb-2">{s.h}</h2>
              <p className="text-charcoal/80 leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>

        <BotanicalDivider className="py-12" />
        <Disclaimer />
        <p className="text-xs text-stone mt-6">
          This is editable starter content provided for convenience and is not legal advice. Please
          review and customize with a qualified professional before launch.
        </p>
      </article>
    </div>
  );
}
