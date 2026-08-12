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
  images?: string[];
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
      className="w-full px-4 sm:px-6 py-14"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsHovered(false);
      }}
    >
      <div className="mx-auto max-w-6xl flex items-end justify-between mb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Featured picks
        </h2>
        <Link href="/shop" className="font-semibold text-red hover:underline">
          Shop all
        </Link>
      </div>

      <div className="rounded-brand border border-ink/10 overflow-hidden grid sm:grid-cols-2 bg-paper">
        <div className="relative aspect-[4/3] sm:aspect-auto bg-cream p-10 sm:p-14 lg:p-20">
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
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-ink bg-gold inline-block w-fit rounded-full px-3 py-1">
            Featured
          </p>
          <h3 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-snug">
            {product.name}
          </h3>
          <p className="mt-4 font-display text-3xl sm:text-4xl font-bold text-red">
            £{product.price.toFixed(2)}
          </p>
          <Link
            href={`/product/${product.sku}`}
            className="mt-8 inline-flex w-fit rounded-full bg-red text-white font-semibold px-8 py-4 min-h-11 text-lg items-center hover:bg-red-deep transition-colors"
          >
            Shop now
          </Link>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous product"
          className="w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink/5"
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
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-6 bg-red" : "w-2.5 bg-ink/15 hover:bg-ink/30"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next product"
          className="w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink/5"
        >
          →
        </button>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause showcase" : "Play showcase"}
          className="w-11 h-11 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink/5 ml-2"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>
    </section>
  );
}
