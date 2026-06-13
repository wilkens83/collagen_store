import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <div className="container-luxe py-32 text-center" data-testid="not-found-page">
      <Seo title="Not Found" />
      <p className="eyebrow text-gold mb-4">404</p>
      <h1 className="h-section mb-6">This page drifted away</h1>
      <p className="text-charcoal/70 mb-8">Let's get you back to your ritual.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );
}
