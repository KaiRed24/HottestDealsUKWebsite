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
      className="absolute inset-0 overflow-hidden select-none"
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
          <div key={src} className="relative w-full h-full shrink-0">
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              draggable={false}
              className="object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Light bottom scrim only, so overlaid text stays readable without dulling the photo */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/45 to-transparent pointer-events-none" />

      {images.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-3 z-10">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show banner ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all motion-reduce:transition-none ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause banner slideshow" : "Play banner slideshow"}
            className="w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/30 text-xs"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>
      )}
    </div>
  );
}
