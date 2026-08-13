"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";

const AUTOPLAY_MS = 5000;

export default function FeaturedShowcase({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (i: number) => setIndex((i + products.length) % products.length),
    [products.length]
  );

  useEffect(() => {
    if (!isPlaying || isHovered || reducedMotion || products.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, reducedMotion, products.length]);

  if (products.length === 0) return null;

  const product = products[index];
  const imageSrc = product.image_url as string;

  return (
    <section
      className="w-full px-6 py-24 sm:py-32 border-b border-grey-line"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsHovered(false);
      }}
    >
      <div className="mx-auto max-w-[1280px] flex items-end justify-between mb-10">
        <h2 className="text-h2 font-semibold tracking-[-0.02em] text-text">
          Featured picks
        </h2>
        <Link href="/shop" className="text-sm text-blue hover:text-navy transition-colors">
          Shop all
        </Link>
      </div>

      <div className="mx-auto max-w-[1280px] rounded-[var(--radius)] border border-grey-line overflow-hidden grid sm:grid-cols-2 bg-white">
        <div className="relative aspect-[4/3] sm:aspect-auto bg-blue-tint p-10 sm:p-14 lg:p-20">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-contain"
            priority={index === 0}
          />
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20">
          <p className="text-xs uppercase tracking-wide text-muted">
            Featured
          </p>
          <h3 className="mt-4 text-h3 sm:text-display font-semibold tracking-[-0.02em] text-text leading-snug">
            {product.name}
          </h3>
          <p className="mt-4 text-2xl font-semibold text-navy">
            £{product.price.toFixed(2)}
          </p>
          <Link href={`/product/${product.sku}`} className="btn-primary mt-8 w-fit px-8 text-lg">
            Shop now
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous product"
          className="w-11 h-11 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150"
        >
          ←
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Choose product">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${p.name}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ease-out ${
                i === index ? "w-6 bg-navy" : "w-1.5 bg-grey-line hover:bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next product"
          className="w-11 h-11 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150"
        >
          →
        </button>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause showcase" : "Play showcase"}
          className="w-11 h-11 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150 ml-2"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
    </section>
  );
}
