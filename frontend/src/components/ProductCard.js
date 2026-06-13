import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/api";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="group" data-testid={`product-card-${product.slug}`}>
      <Link to={`/product/${product.slug}`} className="block">
        <div className="overflow-hidden rounded-xl bg-cream-muted relative mb-5 aspect-[4/5] shadow-soft">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <span className="absolute top-3 left-3 bg-cream/90 text-forest text-[10px] tracking-widest2 uppercase px-3 py-1 rounded-full">
            {product.category.split(" / ")[0]}
          </span>
        </div>
      </Link>
      <div className="text-center px-1">
        <StarRating rating={product.rating} className="justify-center mb-2" />
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif text-xl text-forest hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-stone mt-1 mb-3 line-clamp-2">{product.subheadline}</p>
        <p className="font-serif text-lg text-charcoal mb-4">{formatPrice(product.price)}</p>
        <button
          onClick={() => addItem(product, product.variants[0], 1)}
          className="btn-secondary w-full"
          data-testid={`add-to-cart-${product.slug}`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
