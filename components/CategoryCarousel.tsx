"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 5000;

export type CategorySlide = {
  value: string;
  label: string;
  image: string;
};

export default function CategoryCarousel({ slides }: { slides: CategorySlide[] }) {
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

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  useEffect(() => {
    if (!isPlaying || isHovered || reducedMotion || slides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, reducedMotion, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Shop by category"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsHovered(false);
      }}
    >
      {/* aspect-[3/2] matches the actual source graphics (1536×1024) so
          object-contain shows each one in full, with no cropping — a fixed
          pixel height here would force a mismatched ratio and crop them. */}
      <div className="relative aspect-[3/2] bg-navy">
        {slides.map((s, i) => (
          <div
            key={s.value}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ))}

        {/* Uniform tint (not a directional gradient) — the text is now
            centred, so it needs even contrast regardless of which part of
            the busy source graphic sits behind it. */}
        <div className="absolute inset-0 bg-navy/55 pointer-events-none" />

        <div className="relative z-10 h-full mx-auto max-w-[1280px] px-6 flex flex-col justify-center items-center text-center">
          <p className="text-small uppercase tracking-wide text-white/70">
            Shop by category
          </p>
          <h2 className="mt-3 text-h1 font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            {slide.label}
          </h2>
          <Link
            href={`/shop?category=${slide.value}`}
            className="btn-primary bg-white text-navy hover:bg-blue-tint mt-8 px-8"
          >
            Shop {slide.label}
          </Link>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3 z-10">
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose category">
              {slides.map((s, i) => (
                <button
                  key={s.value}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${s.label}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 ease-out motion-reduce:transition-none ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
              className="w-7 h-7 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10 transition-colors duration-150 text-xs"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
