"use client";

import { useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD_RATIO = 0.15;

// Horizontal slide track shared by the homepage carousels. Every slide is
// exactly the container's measured width and the track moves by whole
// container widths in pixels — percentage translates on a fractional-width
// container can leave a sliver of the neighbouring slide visible.
export default function SlideTrack({
  count,
  index,
  onIndexChange,
  onDraggingChange,
  reducedMotion = false,
  // Must include a position (relative/absolute) — it's not set here so
  // callers can pass "absolute inset-0" without a conflicting "relative".
  className = "relative",
  children,
}: {
  count: number;
  index: number;
  onIndexChange: (i: number) => void;
  onDraggingChange?: (dragging: boolean) => void;
  reducedMotion?: boolean;
  className?: string;
  children: (slideIndex: number) => React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // offsetWidth is the layout width — unlike getBoundingClientRect it
    // ignores scale transforms that scroll animations put on ancestors.
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const setDragging = (dragging: boolean) => {
    setIsDragging(dragging);
    onDraggingChange?.(dragging);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return;
    setDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const threshold = width * DRAG_THRESHOLD_RATIO;
    if (dragOffset < -threshold) onIndexChange((index + 1) % count);
    else if (dragOffset > threshold) onIndexChange((index - 1 + count) % count);
    setDragging(false);
    setDragOffset(0);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden select-none ${className}`}
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={`flex h-full ${
          isDragging || reducedMotion ? "" : "transition-transform duration-500 ease-out"
        }`}
        style={{
          // Before the first measure, fall back to % so SSR markup is right.
          width: width ? `${width * count}px` : `${count * 100}%`,
          transform: width
            ? `translate3d(${-index * width + dragOffset}px, 0, 0)`
            : `translate3d(${(-index * 100) / count}%, 0, 0)`,
        }}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="relative h-full shrink-0"
            style={{ width: width ? `${width}px` : `${100 / count}%` }}
            aria-hidden={i !== index}
          >
            {children(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
