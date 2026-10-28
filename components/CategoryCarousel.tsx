"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SlideTrack from "@/components/SlideTrack";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";

const AUTOPLAY_MS = 3500;

export type CategorySlide = {
  value: string;
  label: string;
  image: string;
};

export default function CategoryCarousel({ slides }: { slides: CategorySlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const goTo = (i: number) => setIndex((i + count) % count);

  const { autoplaying, reducedMotion, handlers, setDragging } = useCarouselAutoplay({
    count,
    index,
    delayMs: AUTOPLAY_MS,
    onAdvance: () => setIndex((i) => (i + 1) % count),
  });

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Shop by category"
      // No on-screen controls: navigation is swipe / drag / trackpad, plus
      // the arrow keys once focused.
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
      {...handlers}
    >
      {/* Fixed aspect ratio + object-cover: every slide fills the full width
          edge to edge regardless of each source graphic's own ratio. */}
      <div className="relative aspect-[4/3] sm:aspect-[21/9] bg-navy">
        <SlideTrack
          count={count}
          index={index}
          onIndexChange={goTo}
          onDraggingChange={setDragging}
          reducedMotion={reducedMotion}
          className="absolute inset-0"
        >
          {(i) => (
            <Image
              src={slides[i].image}
              alt=""
              fill
              sizes="100vw"
              draggable={false}
              // Current + next slide load eagerly so a transition never
              // lands on a blank frame.
              loading={i === index || i === (index + 1) % count ? "eager" : "lazy"}
              className="object-cover pointer-events-none"
            />
          )}
        </SlideTrack>

        {/* Strong, even navy wash with a darker core behind the centred copy,
            so white type stays readable over the busiest source graphics. */}
        <div className="absolute inset-0 bg-navy/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,22,52,0.55),transparent_70%)] pointer-events-none" />

        <div className="absolute inset-0 z-10 mx-auto max-w-[1280px] px-6 flex flex-col justify-center items-center text-center pointer-events-none [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          <p className="text-small font-medium uppercase tracking-wide text-white">
            Shop by category
          </p>
          <h2
            className="mt-2 sm:mt-3 text-h2 sm:text-h1 font-semibold leading-[1.05] tracking-[-0.03em] text-white"
            aria-live={autoplaying ? "off" : "polite"}
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
      </div>
    </section>
  );
}
