"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/products";

export default function AddToBasketButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock_quantity === 0;

  function handleClick() {
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className={`rounded-[var(--radius)] font-medium px-6 py-3.5 min-h-11 transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed ${
        added ? "bg-blue-tint text-navy border border-navy" : "bg-navy text-white hover:bg-blue"
      } ${className}`}
    >
      {soldOut ? "Sold out" : added ? "Added ✓" : "Add to basket"}
    </button>
  );
}
