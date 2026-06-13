import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Check, Plus, Minus, ShoppingBag, Zap, ChevronDown, Truck, ShieldCheck, Gift } from "lucide-react";
import { api, formatPrice } from "../lib/api";
import { useCart } from "../context/CartContext";
import Seo from "../components/Seo";
import BenefitIcon from "../components/BenefitIcon";
import BotanicalDivider from "../components/BotanicalDivider";
import Disclaimer from "../components/Disclaimer";
import ProductCard from "../components/ProductCard";

const BUY_TRUST = [
  { Icon: Truck, label: "Free shipping", sub: "over $50" },
  { Icon: ShieldCheck, label: "Secure checkout", sub: "by Stripe" },
  { Icon: Gift, label: "Free samples", sub: "in every order" },
];

function SectionLabel({ children }) {
  return <p className="text-xs tracking-widest2 uppercase text-gold mb-6">{children}</p>;
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
  const [showInci, setShowInci] = useState(false);

  useEffect(() => {
    setProduct(null);
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setRelated(data.related);
      setVariant(data.product.variants[0]);
      setActiveImg(0);
      setQty(1);
      setShowInci(false);
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

      {/* BREADCRUMB */}
      <div className="container-pnice pt-8">
        <nav className="text-xs tracking-wide uppercase text-stone flex gap-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <span>/</span>
          <span className="text-forest">{product.name}</span>
        </nav>
      </div>

      {/* TOP: gallery + buy box */}
      <section className="container-pnice py-10 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                data-testid={`thumb-${i}`}
                aria-label={`View image ${i + 1}`}
                className={`w-16 h-20 rounded-lg overflow-hidden border transition-colors shrink-0 ${
                  i === activeImg ? "border-gold" : "border-stone/30 hover:border-stone"
                }`}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden rounded-2xl bg-cream-muted aspect-[4/5] shadow-soft">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" data-testid="product-main-image" />
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold mb-3">{product.category}</p>
          <h1 className="font-serif font-light uppercase tracking-[0.06em] text-3xl lg:text-[2.6rem] leading-[1.1] text-forest">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-serif text-3xl text-charcoal">{formatPrice(product.price)}</span>
            <span className="text-sm text-stone tracking-wide">USD · {product.size}</span>
          </div>

          <p className="text-charcoal/80 leading-relaxed mt-5">{product.short_description}</p>

          <ul className="space-y-3 mt-6">
            {product.benefits.map((b) => (
              <li key={b} className="flex gap-3 text-charcoal/90">
                <Check className="text-gold shrink-0 mt-1" size={18} strokeWidth={2} />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-xs text-forest tracking-wide uppercase">
            {product.badges.map((b, i) => (
              <React.Fragment key={b}>
                {i > 0 && <span className="text-stone/50">|</span>}
                <span className="flex items-center gap-2"><BenefitIcon name="check" size={15} /> {b}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Format + qty */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <label className="eyebrow text-stone block mb-3">Format</label>
              <div className="flex gap-3" data-testid="format-options">
                {product.variants.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    data-testid={`format-option-${i}`}
                    className={`px-5 py-2.5 rounded-lg border text-sm transition-colors ${
                      variant === v ? "border-forest bg-forest text-cream" : "border-stone/40 text-forest hover:border-forest"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="eyebrow text-stone block mb-3">Quantity</label>
              <div className="flex items-center border border-stone/40 rounded-lg w-fit">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-forest hover:text-gold" data-testid="qty-dec" aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="px-4 min-w-[2.5rem] text-center" data-testid="qty-value">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-forest hover:text-gold" data-testid="qty-inc" aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button onClick={() => addItem(product, variant, qty)} className="btn-primary w-full" data-testid="pdp-add-to-cart">
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button onClick={buyNow} className="btn-secondary w-full" data-testid="pdp-buy-now">
              <Zap size={16} /> Buy Now
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-7 border-t border-stone/20" data-testid="inline-trust-line">
            {BUY_TRUST.map(({ Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5">
                <Icon size={20} strokeWidth={1.5} className="text-gold" />
                <span className="text-xs text-forest leading-tight">{label}</span>
                <span className="text-[10px] text-stone leading-tight">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFIT TILES */}
      <section className="container-pnice pb-4" data-testid="section-benefits">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl bg-cream-muted divide-y divide-stone/15 lg:divide-y-0 lg:divide-x">
          {product.benefit_tiles.map((t) => (
            <div key={t.label} className="p-7 text-center flex flex-col items-center">
              <BenefitIcon name={t.icon} size={30} className="mb-3" />
              <span className="text-sm tracking-wide uppercase text-forest font-bold">{t.label}</span>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">{t.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THREE-COLUMN BAND: ingredients · description+usage · specs */}
      <section className="container-pnice py-14">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Ingredients */}
          <div data-testid="section-ingredients">
            <SectionLabel>Key Ingredients</SectionLabel>
            <ul className="space-y-5">
              {product.key_ingredients.map((ing) => (
                <li key={ing.name} className="flex gap-4">
                  <span className="w-11 h-11 rounded-full bg-cream-muted border border-gold/30 flex items-center justify-center shrink-0">
                    <BenefitIcon name={ing.icon} size={20} />
                  </span>
                  <div>
                    <p className="font-serif text-forest leading-tight">{ing.name}</p>
                    <p className="text-sm text-charcoal/70 leading-relaxed mt-1">{ing.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            {product.full_ingredients && (
              <div className="mt-6">
                <button
                  onClick={() => setShowInci((s) => !s)}
                  className="flex items-center gap-2 text-xs tracking-widest2 uppercase text-forest hover:text-gold"
                  data-testid="toggle-full-ingredients"
                >
                  See all ingredients
                  <ChevronDown size={16} className={`transition-transform ${showInci ? "rotate-180" : ""}`} />
                </button>
                {showInci && (
                  <p className="text-xs text-charcoal/60 leading-relaxed mt-3" data-testid="full-ingredients">
                    <span className="font-bold not-italic">INCI: </span>{product.full_ingredients}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Description + usage */}
          <div className="lg:px-2" data-testid="section-description">
            <SectionLabel>Description</SectionLabel>
            <p className="text-charcoal/80 leading-relaxed">{product.description}</p>

            <div className="mt-10" data-testid="section-how-to-use">
              <SectionLabel>How to Use</SectionLabel>
              <ol className="grid grid-cols-2 gap-x-6 gap-y-7">
                {product.usage_steps.map((step, i) => (
                  <li key={i} className="text-center flex flex-col items-center">
                    <BenefitIcon name={step.icon} size={26} className="mb-3" />
                    <span className="text-sm font-serif text-forest">{i + 1}. {step.title}</span>
                    <p className="text-xs text-charcoal/65 leading-relaxed mt-1.5">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Specs */}
          <div className="lg:border-l lg:border-stone/20 lg:pl-12" data-testid="section-specs">
            <SectionLabel>Details</SectionLabel>
            <dl className="space-y-5">
              {product.spec_panel.map((s) => (
                <div key={s.label} className="flex gap-3">
                  <BenefitIcon name={s.icon} size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-[11px] tracking-widest2 uppercase text-stone">{s.label}</dt>
                    <dd className="text-sm text-charcoal mt-0.5">{s.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-pnice max-w-4xl mx-auto pb-6" data-testid="section-faq">
        <SectionLabel>Frequently Asked</SectionLabel>
        <div className="space-y-3">
          {product.faq.map((f, i) => (
            <div key={i} className="border border-stone/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex justify-between items-center px-5 py-4 text-left text-forest font-serif"
                data-testid={`faq-toggle-${i}`}
              >
                {f.q}
                <Plus size={18} className={`transition-transform shrink-0 ${openFaq === i ? "rotate-45" : ""}`} />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-5 text-charcoal/80 leading-relaxed" data-testid={`faq-answer-${i}`}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMER + WARNINGS */}
      <div className="container-pnice max-w-4xl mx-auto pb-10 space-y-4">
        <Disclaimer />
        {product.warnings && (
          <p className="text-xs text-stone leading-relaxed" data-testid="product-warnings">
            <span className="uppercase tracking-wide text-charcoal/70">Safety: </span>{product.warnings}
          </p>
        )}
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
