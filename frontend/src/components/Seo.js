import React from "react";
import { Helmet } from "react-helmet-async";

export default function Seo({ title, description, jsonLd, image }) {
  const fullTitle = title ? `${title} · LUXE SKIN` : "LUXE SKIN — Clean, Botanical Night Care";
  const desc =
    description ||
    "Calm, botanical, clean skincare. Two thoughtfully formulated night-care essentials. Secure checkout by Stripe.";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
