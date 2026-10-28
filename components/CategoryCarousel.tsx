"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SlideTrack from "@/components/SlideTrack";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const AUTOPLAY_MS = 5000;

export type CategorySlide = {
  value: string;
  label: string;
  image: string;
};

export default function CategoryCarousel({ slides }: { slides: CategorySlide[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  // Reduced-motion users still get autoplay (it's just content changing,
  // not a decorative animation) — this only strips the slide transition.
  const reducedMotion = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  useEffect(() => {
    // Deliberately NOT paused on hover — this carousel is full-width, so
    // "mouse anywhere over it" would mean it almost never actually plays.
    // The visible pause button is the control instead.
    if (!isPlaying || isDragging || slides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isDragging, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Shop by category"
    >
      {/* Fixed aspect ratio + object-cover: every slide fills the full width
          edge to edge regardless of each source graphic's own ratio. */}
      <div className="relative aspect-[4/3] sm:aspect-[21/9] bg-navy">
        <SlideTrack
          count={slides.length}
          index={index}
          onIndexChange={goTo}
          onDraggingChange={setIsDragging}
          reducedMotion={reducedMotion}
          className="absolute inset-0"
        >
          {(i) => (
            <Image
              src={slides[i].image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              draggable={false}
              className="object-cover pointer-events-none"
            />
          )}
        </SlideTrack>

        {/* Strong, even navy wash with a darker core behind the centred copy,
            so white type stays readable over the busiest source graphics. */}
        <div className="absolute inset-0 bg-navy/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,22,52,0.55),transparent_70%)] pointer-events-none" />

        <div className="absolute inset-0 z-10 mx-auto max-w-[1280px] px-6 pb-10 sm:pb-0 flex flex-col justify-center items-center text-center pointer-events-none [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          <p className="text-small font-medium uppercase tracking-wide text-white">
            Shop by category
          </p>
          <h2
            className="mt-2 sm:mt-3 text-h2 sm:text-h1 font-semibold leading-[1.05] tracking-[-0.03em] text-white"
            aria-live="polite"
          >
            {slide.label}
          </h2>
          <Link
            href={`/shop?category=${slide.value}`}
            className="btn-primary bg-white text-navy hover:bg-blue-tint mt-5 sm:mt-8 px-8 pointer-events-auto [text-shadow:none]"
          >
            Shop {slide.label}
          </Link>
        </div>

        {slides.length > 1 && (
          <>
            {/* Arrows: bottom-right on phones (clear of the centred copy),
                vertically centred at the sides from sm:. */}
            <div className="absolute z-10 bottom-2 right-3 flex gap-2 sm:contents">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous category"
                className="sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 sm:z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-navy shadow-[var(--shadow-card)] flex items-center justify-center hover:bg-blue-tint transition-colors duration-150 text-lg font-semibold"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next category"
                className="sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-navy shadow-[var(--shadow-card)] flex items-center justify-center hover:bg-blue-tint transition-colors duration-150 text-lg font-semibold"
              >
                →
              </button>
            </div>

            <div className="absolute bottom-2 left-3 sm:bottom-4 sm:left-6 flex items-center z-10">
              <div className="flex items-center" role="tablist" aria-label="Choose category">
                {slides.map((s, i) => (
                  <button
                    key={s.value}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${s.label}`}
                    onClick={() => goTo(i)}
                    className="group flex items-center justify-center h-11 min-w-11"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-200 ease-out motion-reduce:transition-none ${
                        i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 group-hover:bg-white/80"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
                className="flex items-center justify-center w-11 h-11"
              >
                <span className="w-7 h-7 rounded-full border border-white/70 text-white flex items-center justify-center text-xs">
                  {isPlaying ? "❚❚" : "▶"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
