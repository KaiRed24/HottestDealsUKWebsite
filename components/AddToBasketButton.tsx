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

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
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
      className={`rounded-[var(--radius-sm)] font-medium px-6 py-3.5 min-h-11 transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed ${
        added ? "bg-paper text-blue border border-blue" : "bg-blue text-white hover:bg-[var(--blue-ink)]"
      } ${className}`}
    >
      {soldOut ? "Sold out" : added ? "Added ✓" : "Add to basket"}
    </button>
  );
}
