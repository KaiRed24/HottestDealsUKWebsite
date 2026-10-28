"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const ROTATE_MS = 4000;

const messages: React.ReactNode[] = [
  <>
    Use code <span className="font-semibold">10OFF</span> for 10% off your order
  </>,
  <>Fast UK delivery</>,
  <>60,000+ TikTok followers</>,
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // Reduced motion: no rotation — the discount code (the one that matters)
  // just stays put.
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const current = reducedMotion ? 0 : index;

  return (
    <div className="bg-blue-mid text-white text-center text-sm py-2.5 px-4" aria-live="off">
      {/* Every message is stacked in the same grid cell, so the bar is always
          as tall as the longest one and never jumps between messages. The
          outgoing one fades out before the incoming one fades in (delay on
          the incoming fade), so two lines of text never overlap. */}
      <div className="grid">
        {messages.map((message, i) => (
          <p
            key={i}
            aria-hidden={i !== current}
            className={`[grid-area:1/1] transition-opacity duration-200 ease-in-out ${
              i === current ? "opacity-100 delay-200" : "opacity-0"
            }`}
          >
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
