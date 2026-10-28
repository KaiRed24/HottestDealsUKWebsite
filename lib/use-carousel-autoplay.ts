"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Autoplay for the homepage carousels. It loops forever and is never
// switched off by interaction: it only pauses while the carousel is
// hovered with a mouse, holds keyboard focus, or is mid-drag, and resumes
// as soon as that ends. Any slide change (auto or manual) restarts the
// countdown, so a swipe always gets a full interval before the next move.
// Off entirely under prefers-reduced-motion.
export function useCarouselAutoplay({
  count,
  index,
  delayMs,
  onAdvance,
}: {
  count: number;
  index: number;
  delayMs: number;
  onAdvance: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const advanceRef = useRef(onAdvance);
  useEffect(() => {
    advanceRef.current = onAdvance;
  });

  const autoplaying = !reducedMotion && count > 1 && !hovered && !focused && !dragging;

  useEffect(() => {
    if (!autoplaying) return;
    const timer = setTimeout(() => advanceRef.current(), delayMs);
    return () => clearTimeout(timer);
  }, [autoplaying, index, delayMs]);

  // Spread onto the carousel's outermost element.
  const handlers = {
    // Mouse only: a touch "enter" would otherwise pause autoplay on phones
    // until the next tap somewhere else.
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setHovered(true);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setHovered(false);
    },
    // Keyboard focus only — a mouse click on a dot leaves focus behind,
    // which must not pause autoplay indefinitely.
    onFocus: (e: React.FocusEvent) => {
      if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(true);
    },
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
    },
  };

  return { autoplaying, reducedMotion, handlers, setDragging };
}
