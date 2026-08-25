"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/cn";

/**
 * The traveling-light rail: a line that lights step by step, holds with every
 * step lit, then drains the same way it filled, and loops.
 *
 * Extracted from EnrollmentSteps (components/home/EnrollmentSteps.tsx), which
 * built this first for "How enrollment works". AboutCredentials is the second
 * caller, for the three trust marks - same choreography, a different row of
 * things to light. Both consume this hook and component rather than each
 * keeping their own copy, so the phase machine and the `scaleX` /
 * `transformOrigin` trick that makes it glide instead of grind exist once.
 *
 * Two counters describe every frame: `lit` is how far the head of the line has
 * travelled, `done` is how far the tail has followed it. A step is lit while it
 * sits between the two, and a rail segment is drawn while both ends of it do.
 * The light builds left to right, rests with the whole sequence on screen, then
 * leaves left to right the same way it arrived - there is no frame where the
 * section undoes itself.
 */

export type RailPhase = { lit: number; done: number; ms: number };

/** Seconds the head takes to cross one segment, and the tail to follow. */
const TRAVEL_S = 1.4;
const DRAIN_S = 0.9;
/** The beat with every step on screen at once, in ms. */
const HOLD_MS = 2000;

function buildSequence(count: number): RailPhase[] {
  return [
    ...Array.from({ length: count }, (_, i) => ({
      lit: i + 1,
      done: 0,
      ms: i === 0 ? 900 : i === count - 1 ? TRAVEL_S * 1000 + HOLD_MS : TRAVEL_S * 1000,
    })),
    ...Array.from({ length: count }, (_, i) => ({
      lit: count,
      done: i + 1,
      ms: i === count - 1 ? 700 : DRAIN_S * 1000,
    })),
  ];
}

/**
 * Runs the phase machine for a rail of `count` steps, once its host element is
 * in view. Starts, and falls back under reduced motion, at "all lit" - the
 * state markup is served in, so no-JS and print land on the finished sequence
 * rather than a row of dark numerals.
 */
export function useTravelingRail(count: number, railRef: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const inView = useInView(railRef, { margin: "-15%" });
  const allLit: RailPhase = { lit: count, done: 0, ms: 0 };
  const dark: RailPhase = { lit: 0, done: 0, ms: 0 };
  const [phase, setPhase] = useState<RailPhase>(allLit);

  useEffect(() => {
    if (reduce) {
      setPhase(allLit);
      return;
    }

    setPhase(dark);
    if (!inView) return;

    const sequence = buildSequence(count);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      setPhase(sequence[i]);
      timer = setTimeout(() => {
        i = (i + 1) % sequence.length;
        tick();
      }, sequence[i].ms);
    };

    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, count]);

  return phase;
}

/**
 * Column-centre geometry for an n-column grid of width W and gap g: column k's
 * centre lands at W(2k+1)/2n + g(2k-n+1)/2n. Everything else about the rail
 * falls out of that - it runs centre-to-centre, so it is inset by column 0's
 * offset at both ends, and consecutive centres are always (W+g)/n apart, one
 * segment.
 */
export function columnCentre(k: number, count: number, gapPx: number) {
  const pct = ((2 * k + 1) * 100) / (2 * count);
  const px = ((2 * k - count + 1) * gapPx) / (2 * count);
  const sign = px < 0 ? "-" : "+";
  return `calc(${+pct.toFixed(4)}% ${sign} ${Math.abs(+px.toFixed(4))}px)`;
}

/**
 * The rail itself: the hairline track plus the coloured segments that light in
 * turn between `count` columns. Rendered at `top-[-34px]`, `lg`-only, matching
 * where the numeral discs it sits behind lift clear of their cards.
 *
 * `lineColors` is one hex per segment (count − 1 of them), the colour the
 * segment arriving at that step wears.
 */
export function TravelingRailTrack({
  phase,
  count,
  gapPx,
  lineColors,
  className,
}: {
  phase: RailPhase;
  count: number;
  gapPx: number;
  lineColors: readonly string[];
  className?: string;
}) {
  const inset = columnCentre(0, count, gapPx);
  const segmentWidth = `calc(${+(100 / count).toFixed(4)}% + ${+(gapPx / count).toFixed(4)}px)`;

  const reveal = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-80px" },
  } as const;

  return (
    <motion.div
      aria-hidden="true"
      {...reveal}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "absolute left-0 right-0 top-[-34px] hidden h-0.5 -translate-y-1/2 lg:block",
        className,
      )}
    >
      <span
        className="absolute inset-y-0 rounded-full bg-cocoa/15"
        style={{ left: inset, right: inset }}
      />

      {lineColors.map((color, j) => {
        const draining = phase.done > j;
        const drawn = j >= phase.done && phase.lit >= j + 2;

        return (
          <motion.span
            key={j}
            className="absolute inset-y-0 rounded-full"
            style={{
              left: columnCentre(j, count, gapPx),
              width: segmentWidth,
              backgroundColor: color,
              transformOrigin: draining ? "right center" : "left center",
            }}
            animate={{ scaleX: drawn ? 1 : 0 }}
            transition={{
              duration: draining ? DRAIN_S : TRAVEL_S,
              ease: "linear",
            }}
          />
        );
      })}
    </motion.div>
  );
}

export { TRAVEL_S as RAIL_TRAVEL_S };
