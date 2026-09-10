"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 6000;
const DRAG_THRESHOLD_RATIO = 0.15;

export default function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const width = trackRef.current?.offsetWidth ?? 1;
    if (dragOffset < -width * DRAG_THRESHOLD_RATIO) goTo(index + 1);
    else if (dragOffset > width * DRAG_THRESHOLD_RATIO) goTo(index - 1);
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-auto md:absolute md:inset-0 overflow-hidden select-none"
      style={{ touchAction: "pan-y" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={trackRef}
        className={`flex h-full ${
          isDragging || reducedMotion
            ? ""
            : "transition-transform duration-500 ease-out"
        }`}
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
        }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative w-full h-full shrink-0 bg-navy">
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              draggable={false}
              className="object-contain md:object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* The navy overlay gradient that makes the left-aligned text readable
          lives in app/page.tsx (it needs to sit above the slideshow but
          below the copy) — nothing more needed here. */}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-6 flex items-center gap-3 z-10">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show banner ${i + 1}`}
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
            aria-label={isPlaying ? "Pause banner slideshow" : "Play banner slideshow"}
            className="w-7 h-7 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10 transition-colors duration-150 text-xs"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>
      )}
    </div>
  );
}
