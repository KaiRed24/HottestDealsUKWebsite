"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export type StageVariant = "hero" | "morph" | "push" | "fade-scale" | "slide-stagger";

// Per-variant "personality" — kept subtle and close together on purpose, so
// the whole page still reads as one animation language rather than a demo
// reel of different effects. Only the entrance distance/ease really change;
// the exit treatment stays consistent everywhere it's used.
const PRESETS: Record<StageVariant, { y: number; scaleFrom: number; ease: string }> = {
  hero: { y: 28, scaleFrom: 0.97, ease: "power2.out" },
  morph: { y: 46, scaleFrom: 0.95, ease: "power2.out" },
  push: { y: 60, scaleFrom: 0.98, ease: "power3.out" },
  "fade-scale": { y: 22, scaleFrom: 0.94, ease: "power1.out" },
  "slide-stagger": { y: 40, scaleFrom: 0.96, ease: "power2.out" },
};

type ScrollStageProps = {
  children: React.ReactNode;
  variant?: StageVariant;
  className?: string;
  /** Animate this stage into place as it scrolls into view. */
  entrance?: boolean;
  /** Animate this stage back/fade as the next stage arrives. Turn off for
   * the last stage on a page (e.g. the footer) — nothing follows it, so it
   * should just stay put once revealed. */
  exit?: boolean;
  /** Apply the scale/opacity/translate to the root element itself. Turn
   * off for full-bleed sections (like the Hero) where the root must stay
   * edge-to-edge and only its data-anim children should move. */
  animateContainer?: boolean;
  /** Stagger data-anim children in immediately on mount instead of waiting
   * for scroll — for above-the-fold content that's visible on first paint. */
  playOnMount?: boolean;
};

export default function ScrollStage({
  children,
  variant = "morph",
  className = "",
  entrance = true,
  exit = true,
  animateContainer = true,
  playOnMount = false,
}: ScrollStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 641px) and (max-width: 1023px)",
          mobile: "(max-width: 640px)",
        },
        (context) => {
          const conditions = context.conditions as {
            reduced: boolean;
            desktop: boolean;
            tablet: boolean;
            mobile: boolean;
          };

          const headings = el.querySelectorAll<HTMLElement>(
            '[data-anim="heading"], [data-anim="subtitle"], [data-anim="cta"], [data-anim="meta"]'
          );
          const cards = el.querySelectorAll<HTMLElement>('[data-anim="card"]');
          const bgParallax = el.querySelectorAll<HTMLElement>('[data-anim="bg-parallax"]');

          // Reduced motion: guarantee everything is at its resting state,
          // no scroll-linked movement at all — the page just works.
          if (conditions.reduced) {
            gsap.set([el, ...headings, ...cards, ...bgParallax], {
              clearProps: "all",
            });
            return;
          }

          const factor = conditions.mobile ? 0.35 : conditions.tablet ? 0.65 : 1;
          const preset = PRESETS[variant];
          const y = preset.y * factor;
          const scaleFrom = 1 - (1 - preset.scaleFrom) * factor;

          if (animateContainer && (entrance || exit)) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "bottom 8%",
                scrub: 0.6,
              },
            });

            if (entrance) {
              tl.fromTo(
                el,
                { opacity: 0, y, scale: scaleFrom },
                { opacity: 1, y: 0, scale: 1, ease: preset.ease, duration: 0.34 },
                0
              );
            }
            tl.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.32 }, entrance ? 0.34 : 0);
            if (exit) {
              tl.to(
                el,
                {
                  opacity: conditions.mobile ? 0.55 : 0.3,
                  y: -y * 0.6,
                  scale: 1 - (1 - scaleFrom) * 0.6,
                  ease: "power1.in",
                  duration: 0.34,
                },
                0.66
              );
            }
          }

          if (headings.length) {
            const headingTween: gsap.TweenVars = {
              opacity: 1,
              y: 0,
              stagger: 0.09,
              ease: "power2.out",
              duration: 0.5,
            };
            if (playOnMount) {
              // playOnMount content is above the fold, so it never runs
              // through the container's own scroll-entrance timeline — it
              // still needs its own exit as the user scrolls away. The exit
              // ScrollTrigger is only attached once the mount tween finishes
              // (onComplete): both animate the same opacity/y/scale on the
              // same elements, and creating them at the same time causes
              // GSAP's tween overwrite to cut the entrance short.
              //
              // The "from" opacity floor is 0.55, not 0: this is the one
              // animation on the page that isn't scroll-driven, so on a
              // slow-hydrating device it could sit at its "from" state for
              // longer than the intended ~150ms. Never fully invisible means
              // that delay is never worse than a soft dim, not a blank hero.
              gsap.fromTo(
                headings,
                { opacity: 0.55, y: 14 },
                {
                  ...headingTween,
                  delay: 0.15,
                  onComplete: () => {
                    if (!exit || animateContainer) return;
                    gsap.to(headings, {
                      opacity: conditions.mobile ? 0.6 : 0.28,
                      y: -y * 1.2,
                      scale: conditions.mobile ? 1 : 0.97,
                      ease: "power1.in",
                      scrollTrigger: {
                        trigger: el,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                      },
                    });
                  },
                }
              );
            } else {
              gsap.fromTo(
                headings,
                { opacity: 0, y: 18 },
                {
                  ...headingTween,
                  scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 0.5,
                  },
                }
              );
            }
          }

          if (cards.length) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 20 * factor, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: { each: conditions.mobile ? 0.05 : 0.07, from: "start" },
                ease: "power2.out",
                duration: 0.5,
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  end: "top 42%",
                  scrub: 0.5,
                },
              }
            );
          }

          if (bgParallax.length && !conditions.mobile) {
            gsap.fromTo(
              bgParallax,
              { scale: 1 },
              {
                scale: 1.07,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top top",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        }
      );
    }, rootRef);

    // Layout can settle slightly after images finish loading; one refresh
    // once everything's in is enough to keep trigger positions accurate.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, [variant, entrance, exit, animateContainer, playOnMount]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
