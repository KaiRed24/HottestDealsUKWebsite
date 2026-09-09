"use client";

// Single place where GSAP + ScrollTrigger get registered, so every
// ScrollStage instance shares one plugin registration instead of
// re-registering per component. Safe to import from server code too —
// registration itself is guarded, and nothing here touches the DOM.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
