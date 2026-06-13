import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "P-Nice";
const DEFAULT_TITLE = "Retinol & Peptide Serum & Collagen Night Cream — P-Nice";
const DEFAULT_DESC =
  "Clean, botanical night-care from P-Nice: a Retinol & Peptide face serum and a Collagen + Hyaluronic Acid night cream. Cruelty-free, made in USA. Free shipping over $50.";
const DEFAULT_KEYWORDS =
  "retinol serum, retinol and peptide serum, peptide serum for face, collagen night cream, hyaluronic acid night cream, melatonin night cream, anti-aging night care, clean skincare, cruelty-free skincare";

export default function Seo({ title, description, jsonLd, image, keywords, noindex }) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const url = typeof window !== "undefined" ? window.location.href : undefined;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      {url && <link rel="canonical" href={url} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
