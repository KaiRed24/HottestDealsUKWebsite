"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts life invisible on the server; only flips true once React has
  // hydrated and confirmed an observer is watching, so there's never a
  // moment where content is invisible without something guaranteeing it
  // will become visible again.
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    setArmed(true);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${armed ? "reveal-pending" : ""} ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
