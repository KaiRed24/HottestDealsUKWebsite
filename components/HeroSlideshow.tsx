"use client";

import Image from "next/image";
import { useState } from "react";
import SlideTrack from "@/components/SlideTrack";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";

const AUTOPLAY_MS = 3000;

export default function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const goTo = (i: number) => setIndex((i + count) % count);

  const { autoplaying, reducedMotion, handlers, setDragging } = useCarouselAutoplay({
    count,
    index,
    delayMs: AUTOPLAY_MS,
    onAdvance: () => setIndex((i) => (i + 1) % count),
  });

  if (count === 0) return null;

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-auto md:absolute md:inset-0 bg-navy"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured banners"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
      {...handlers}
    >
      {/* Mobile: a consistent 16:9 band, cover-cropped so every banner fills
          the full screen width edge to edge (the 3:2 sources lose a little
          top and bottom). md:+ the band fills the hero behind the copy.
          No on-screen controls: navigation is swipe / drag / trackpad, plus
          the arrow keys once focused. */}
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
            src={images[i]}
            alt=""
            fill
            sizes="100vw"
            draggable={false}
            // First banner is the LCP image; the current + next are fetched
            // eagerly so a slide never arrives as a blank frame.
            preload={i === 0}
            loading={i === 0 ? undefined : i === index || i === (index + 1) % count ? "eager" : "lazy"}
            className="object-cover pointer-events-none"
          />
        )}
      </SlideTrack>

      {/* The navy overlay gradient that makes the left-aligned text readable
          lives in app/page.tsx (it needs to sit above the slideshow but
          below the copy) — nothing more needed here. */}

      {/* Announces slide changes only when the user is driving it. */}
      <p className="sr-only" aria-live={autoplaying ? "off" : "polite"}>
        Banner {index + 1} of {count}
      </p>
    </div>
  );
}
