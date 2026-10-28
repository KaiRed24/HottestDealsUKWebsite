"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SlideTrack from "@/components/SlideTrack";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const AUTOPLAY_MS = 6000;

export default function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  useEffect(() => {
    if (!isPlaying || isHovered || isDragging || reducedMotion || images.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, isDragging, reducedMotion, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-auto md:absolute md:inset-0 bg-navy"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mobile: a consistent 16:9 band, cover-cropped so every banner fills
          the full screen width edge to edge (the 3:2 sources lose a little
          top and bottom). md:+ the band fills the hero behind the copy. */}
      <SlideTrack
        count={images.length}
        index={index}
        onIndexChange={goTo}
        onDraggingChange={setIsDragging}
        reducedMotion={reducedMotion}
        className="absolute inset-0"
      >
        {(i) => (
          <Image
            src={images[i]}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            draggable={false}
            className="object-cover pointer-events-none"
          />
        )}
      </SlideTrack>

      {/* The navy overlay gradient that makes the left-aligned text readable
          lives in app/page.tsx (it needs to sit above the slideshow but
          below the copy) — nothing more needed here. */}

      {images.length > 1 && (
        <div className="absolute bottom-1 left-3 md:bottom-6 md:left-6 flex items-center z-10">
          <div className="flex items-center" role="tablist" aria-label="Choose banner">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show banner ${i + 1}`}
                onClick={() => goTo(i)}
                className="group flex items-center justify-center h-11 min-w-11"
              >
                <span
                  className={`block h-1.5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out motion-reduce:transition-none ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 group-hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause banner slideshow" : "Play banner slideshow"}
            className="flex items-center justify-center w-11 h-11"
          >
            <span className="w-7 h-7 rounded-full bg-black/30 border border-white/60 text-white flex items-center justify-center text-xs">
              {isPlaying ? "❚❚" : "▶"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
