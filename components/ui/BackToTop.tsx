"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Back-to-top control, bottom right.
 *
 * The pages here are long and phone-first, so reaching the navigation again
 * otherwise means reversing a whole page of scrolling. It is deliberately the
 * quiet `secondary` pill rather than the pink one: a second saturated control
 * on screen would compete with the Tour CTA, which is the actual goal.
 *
 * Under 768px the Call / Text / Tour bar owns the bottom edge, so the button
 * is lifted clear of it (and of the home indicator) rather than hidden.
 */
export function BackToTop() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;

    // One viewport-ish of travel. Any less and it appears while the hero is
    // still on screen, where there is nothing to go back up to.
    const measure = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.75);
    };

    // Same rAF coalescing as the navbar: scroll fires far more often than a
    // frame renders.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

    // Without this a keyboard user is returned to the top visually but their
    // tab position is still parked at the foot of the document.
    const main = document.getElementById("main-content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      // `invisible` rather than unmounting: it keeps the fade, and visibility
      // hidden is what actually takes it out of the tab order.
      className={cn(
        // `!fixed`, not `fixed`: `.btn-shine` sets `position: relative`, and it
        // is authored below `@tailwind utilities` in globals.css, so at equal
        // specificity it wins and the button drops back into the flow at the
        // foot of the page. Every other user of `btn-shine` is an in-flow pill,
        // which is why this only bites here.
        "group no-print btn-shine btn-shine-soft !fixed right-4 z-40 sm:right-6",
        "bottom-[var(--btt-bottom)] md:bottom-6",
        "flex h-12 w-12 items-center justify-center rounded-full",
        "border-hair border-cocoa/20 bg-gradient-to-b from-white to-cream-deep",
        "shadow-[0_2px_0_0_rgba(62,42,33,0.10),0_6px_14px_-6px_rgba(62,42,33,0.18)]",
        "hover:border-cocoa/35 hover:-translate-y-0.5",
        "hover:shadow-[0_3px_0_0_rgba(62,42,33,0.12),0_12px_22px_-8px_rgba(62,42,33,0.22)]",
        "active:translate-y-px active:shadow-[0_1px_0_0_rgba(62,42,33,0.10)]",
        "transition-[opacity,transform,box-shadow,border-color,visibility] duration-200",
        "ease-[cubic-bezier(0.22,1,0.36,1)]",
        "motion-reduce:transform-none motion-reduce:transition-none",
        shown ? "visible opacity-100" : "invisible translate-y-2 opacity-0",
      )}
      style={
        {
          // Clears the 60px action bar plus whatever the home indicator needs.
          "--btt-bottom": "calc(4.75rem + env(safe-area-inset-bottom))",
        } as CSSProperties
      }
    >
      <ArrowUp
        className="relative z-[1] h-5 w-5 text-cocoa-mid transition-colors group-hover:text-pink-dark"
        aria-hidden="true"
      />
    </button>
  );
}
