"use client";

import { useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD_RATIO = 0.15;
// Pointer movement (px) past which a press counts as a drag, not a tap —
// so a drag that ends over a link doesn't also follow it.
const CLICK_SLOP_PX = 6;
// Horizontal trackpad swipes arrive as a burst of wheel events; take one
// slide per gesture, then ignore the tail of the burst.
const WHEEL_THRESHOLD_PX = 40;
const WHEEL_COOLDOWN_MS = 550;

// Horizontal slide track shared by the homepage carousels. Every slide is
// exactly the container's measured width and the track moves by whole
// container widths in pixels — percentage translates on a fractional-width
// container can leave a sliver of the neighbouring slide visible.
//
// Navigation: touch swipe, mouse drag and horizontal trackpad swipe, each
// snapping cleanly to the nearest slide.
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
  const movedPastSlop = useRef(false);

  // Latest values for the native wheel listener, which is bound once.
  const navRef = useRef({ index, count, onIndexChange });
  useEffect(() => {
    navRef.current = { index, count, onIndexChange };
  });

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

  // Native, non-passive listener so a horizontal trackpad swipe can be
  // claimed (preventDefault) instead of triggering browser back/forward.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let accumulated = 0;
    let lockedUntil = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const { index, count, onIndexChange } = navRef.current;
      if (count <= 1) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      accumulated += e.deltaX;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD_PX) return;
      onIndexChange((index + (accumulated > 0 ? 1 : -1) + count) % count);
      accumulated = 0;
      lockedUntil = now + WHEEL_COOLDOWN_MS;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const setDragging = (dragging: boolean) => {
    setIsDragging(dragging);
    onDraggingChange?.(dragging);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (count <= 1 || (e.pointerType === "mouse" && e.button !== 0)) return;
    setDragging(true);
    movedPastSlop.current = false;
    dragStartX.current = e.clientX;
    if (e.pointerType === "mouse") e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - dragStartX.current;
    if (Math.abs(offset) > CLICK_SLOP_PX) movedPastSlop.current = true;
    setDragOffset(offset);
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
      className={`overflow-hidden select-none ${className} ${count > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={{ touchAction: "pan-y", overscrollBehaviorX: "contain" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        if (movedPastSlop.current) {
          e.preventDefault();
          e.stopPropagation();
          movedPastSlop.current = false;
        }
      }}
    >
      <div
        className={`flex h-full ${
          isDragging || reducedMotion ? "" : "transition-transform duration-[450ms] ease-in-out"
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
