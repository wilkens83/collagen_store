import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Check, Plus, Minus, ShoppingBag, Zap } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { useCart } from "../context/CartContext";
import Seo from "../components/Seo";
import BenefitIcon from "../components/BenefitIcon";
import BotanicalDivider from "../components/BotanicalDivider";
import Disclaimer from "../components/Disclaimer";
import ProductCard from "../components/ProductCard";

const TRUST = [
  { icon: "leaf", label: "Clean ingredients" },
  { icon: "heart", label: "Cruelty-Free" },
  { icon: "pin", label: "Made in USA" },
];

function Section({ title, children, id }) {
  return (
    <section className="py-10 border-b border-stone/20" data-testid={`section-${id}`}>
      <h2 className="font-serif text-2xl text-forest mb-6 uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, closeDrawer } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setProduct(null);
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setRelated(data.related);
      setVariant(data.product.variants[0]);
      setActiveImg(0);
      setQty(1);
    }).catch(() => navigate("/shop"));
  }, [slug, navigate]);

  if (!product) {
    return <div className="container-pnice py-32 text-center text-stone" data-testid="product-loading">Loading…</div>;
  }

  const buyNow = () => {
    addItem(product, variant, qty);
    closeDrawer();
    navigate("/checkout");
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: product.images,
    brand: { "@type": "Brand", name: "P-Nice" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div data-testid={`product-detail-${product.slug}`}>
      <Seo
        title={product.name}
        description={product.short_description}
        image={product.images[0]}
        jsonLd={[productJsonLd, faqJsonLd]}
      />

      {/* TOP: gallery + buy box */}
      <section className="container-pnice py-14 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="overflow-hidden rounded-2xl bg-cream-muted aspect-square shadow-soft">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" data-testid="product-main-image" />
          </div>
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                data-testid={`thumb-${i}`}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeImg ? "border-gold" : "border-transparent"
                }`}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold mb-3">{product.category}</p>
          <h1 className="font-serif text-3xl lg:text-4xl text-forest leading-tight">{product.name}</h1>
          <p className="font-serif text-2xl text-charcoal mt-4">{formatPrice(product.price)} <span className="text-sm text-stone">USD</span></p>
          <p className="text-charcoal/80 leading-relaxed mt-4">{product.short_description}</p>

          <ul className="space-y-3 mt-6">
            {product.benefits.map((b) => (
              <li key={b} className="flex gap-3 text-charcoal/90">
                <Check className="text-gold shrink-0 mt-1" size={18} strokeWidth={2} />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-6 mt-7">
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-xs text-forest tracking-wide">
                <BenefitIcon name={t.icon} size={18} /> {t.label}
              </div>
            ))}
          </div>

          {/* Variant + qty */}
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div>
              <label className="eyebrow text-stone block mb-2">Size</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                data-testid="variant-select"
                className="border border-stone/40 rounded-lg px-4 py-3 bg-cream focus:outline-none focus:border-gold"
              >
                {product.variants.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow text-stone block mb-2">Quantity</label>
              <div className="flex items-center border border-stone/40 rounded-lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3 text-forest hover:text-gold" data-testid="qty-dec"><Minus size={16} /></button>
                <span className="px-4" data-testid="qty-value">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3 text-forest hover:text-gold" data-testid="qty-inc"><Plus size={16} /></button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button onClick={() => addItem(product, variant, qty)} className="btn-secondary flex-1" data-testid="pdp-add-to-cart">
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button onClick={buyNow} className="btn-primary flex-1" data-testid="pdp-buy-now">
              <Zap size={16} /> {product.cta_text}
            </button>
          </div>

          <p className="text-xs text-stone text-center mt-5" data-testid="inline-trust-line">
            Free shipping over $50 · Secure checkout · Free samples
          </p>
        </div>
      </section>

      {/* DETAILS */}
      <div className="container-pnice max-w-4xl mx-auto pb-10">
        <Section title="Benefits" id="benefits">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.benefit_tiles.map((t) => (
              <div key={t.label} className="bg-cream-muted rounded-xl p-6 text-center">
                <BenefitIcon name={t.icon} size={28} className="mx-auto mb-3" />
                <span className="text-sm text-forest">{t.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Key Ingredients" id="ingredients">
          <ul className="grid sm:grid-cols-2 gap-5">
            {product.key_ingredients.map((ing) => (
              <li key={ing.name} className="flex gap-4">
                <BenefitIcon name={ing.icon} size={22} className="shrink-0 mt-1" />
                <div>
                  <p className="font-serif text-forest">{ing.name}</p>
                  <p className="text-sm text-charcoal/70">{ing.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Description" id="description">
          <p className="text-charcoal/80 leading-relaxed text-lg">{product.description}</p>
        </Section>

        <Section title="How to Use" id="how-to-use">
          <ol className="space-y-4">
            {product.how_to_use.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="font-serif text-gold text-xl w-8 shrink-0">{i + 1}.</span>
                <span className="text-charcoal/80 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Specifications" id="specs">
          <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between border-b border-stone/20 py-2">
                <dt className="text-stone text-sm tracking-wide uppercase">{s.label}</dt>
                <dd className="text-charcoal text-right text-sm">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="FAQ" id="faq">
          <div className="space-y-3">
            {product.faq.map((f, i) => (
              <div key={i} className="border border-stone/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-forest font-serif"
                  data-testid={`faq-toggle-${i}`}
                >
                  {f.q}
                  <Plus size={18} className={`transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 text-charcoal/80 leading-relaxed" data-testid={`faq-answer-${i}`}>{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        <div className="py-10">
          <Disclaimer />
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      {related.length > 0 && (
        <section className="bg-cream-muted py-16">
          <div className="container-pnice">
            <BotanicalDivider className="mb-10" />
            <h2 className="h-section text-center mb-12">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
