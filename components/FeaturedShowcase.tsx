"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";

const AUTOPLAY_MS = 5000;

export default function FeaturedShowcase({
  products,
  images = [],
}: {
  products: Product[];
  // Must be the same length/order as `products` — index i is the custom
  // graphic for products[i], derived by the caller via product.sku so it
  // can never be paired with the wrong item.
  images?: (string | null)[];
}) {
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
  const imageSrc = images[index] ?? (product.image_url as string);

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

      {/* Every slide is the exact same box regardless of the source image's
          own proportions — object-cover crops to fill instead of shrinking
          to fit, so nothing ever looks a different size or leaves gaps. */}
      <div className="mx-auto max-w-[1280px] relative aspect-[4/3] sm:aspect-[16/7] rounded-[var(--radius)] overflow-hidden bg-blue-tint">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-white/70">Featured</p>
            <p className="mt-1 text-xl sm:text-2xl font-display font-bold text-white">
              £{product.price.toFixed(2)}
            </p>
          </div>
          <Link
            href={`/product/${product.sku}`}
            className="btn-primary bg-white text-navy hover:bg-blue-tint shrink-0 px-8"
          >
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
