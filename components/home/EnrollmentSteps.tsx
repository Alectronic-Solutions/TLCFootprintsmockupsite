"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection, EASE } from "@/components/ui/AnimatedSection";
import { TravelingRailTrack, useTravelingRail } from "@/components/brand/TravelingRail";
import { ENROLLMENT_STEPS, type EnrollmentStep } from "@/lib/constants";

const STEPS = ENROLLMENT_STEPS.length;

/**
 * One brand colour per step, running pink → amber → leaf: the same three, in
 * the same order, as the `.rule-rainbow` gradient and the logo it was sampled
 * from. Each triple is a disc gradient plus the hard bottom edge under it,
 * built the way `Button`'s primary variant is - light at the top, the token's
 * `-dark` at the bottom, one step darker again for the edge.
 *
 * `ink` is the numeral. It is cocoa on amber and white on the other two, for
 * the ordinary reason: white on #F2A63B is unreadable. Consistency of contrast
 * matters more here than consistency of colour.
 *
 * `line` is the rail segment *arriving* at this step, so the line always wears
 * the colour of the step it is travelling towards.
 */
export const RAIL_TONES = [
  {
    from: "#EA4A6B",
    to: "#D22F51",
    edge: "#9E1F3B",
    ink: "#FFFFFF",
    line: "#E23A5E",
    ring: "rgba(226,58,94,0.40)",
    glow: "rgba(226,58,94,0.45)",
  },
  {
    from: "#F7B455",
    to: "#D98A20",
    edge: "#AC6C11",
    ink: "#3E2A21",
    line: "#D98A20",
    ring: "rgba(217,138,32,0.45)",
    glow: "rgba(217,138,32,0.45)",
  },
  {
    from: "#7FBA46",
    to: "#4E7A28",
    edge: "#3A5C1C",
    ink: "#FFFFFF",
    line: "#4E7A28",
    ring: "rgba(78,122,40,0.45)",
    glow: "rgba(78,122,40,0.40)",
  },
];

/** The numeral of a step the line has not reached yet. */
const DORMANT_INK = "rgba(62,42,33,0.6)";
/** Seconds a numeral, its ring and its card take to come up or go down. */
const FADE_S = 0.6;
/** Seconds the head takes to cross one segment - must match TravelingRail's. */
const TRAVEL_S = 1.4;

/**
 * Rail geometry at lg, where the numerals lift off the cards and sit on one
 * line above them. Column gap between cards, in px.
 */
const GRID_GAP = 24;

/**
 * `strong` is one substring of the detail set in cocoa semibold - the deposit
 * amount, and nothing else so far. A parent scanning this section is looking
 * for the number, and mid-sentence at body weight it may as well not be there.
 */
function Detail({ step }: { step: EnrollmentStep }) {
  const at = step.strong ? step.detail.indexOf(step.strong) : -1;
  if (!step.strong || at === -1) return <>{step.detail}</>;

  return (
    <>
      {step.detail.slice(0, at)}
      <strong className="tabular font-semibold text-cocoa">{step.strong}</strong>
      {step.detail.slice(at + step.strong.length)}
    </>
  );
}

/** Removes the fear of an opaque process, which is most of what stalls a parent. */
/**
 * `surface` exists because these sections are reused in different positions on
 * different pages, and the cream / cream-deep alternation has to keep working
 * wherever they land. Hardcoding a background here is what forces a caller to
 * bend its arc dividers around the component instead of the other way round.
 */
export function EnrollmentSteps({
  surface = "bg-cream",
}: {
  surface?: "bg-cream" | "bg-cream-deep";
} = {}) {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  /**
   * Starts at "all lit", which is the state the markup is served in. With no
   * JS, and in print, the CSS in globals.css forces every animated opacity back
   * to 1 - so the fallback is the finished sequence rather than a row of
   * greyed-out numerals.
   */
  const phase = useTravelingRail(STEPS, railRef);

  /* Opacity-only, deliberately: the usual 20px rise would slide the numerals
     out from under the rail, which does not move, for the length of the
     reveal. Nothing here moves, so nothing can come unstuck. */
  const reveal = {
    initial: reduce ? false : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-80px" },
  } as const;

  return (
    <section className={cn("section-y", surface)}>
      <div className="container-page">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <SectionLabel className="text-center">Getting started</SectionLabel>
          <h2 className="text-3d mt-3 text-h2 sm:mt-4">How enrollment works</h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-lead text-ink sm:mt-5">
            Three steps, and you can stop at any of them.
          </p>
        </AnimatedSection>

        <div ref={railRef} className="relative mt-6 sm:mt-9 lg:mt-20">
          {/* The rail only exists at lg, where the steps sit in a row. Below
              that each numeral rides at the top of its own card and the
              sequence reads off the numerals alone. */}
          <TravelingRailTrack
            phase={phase}
            count={STEPS}
            gapPx={GRID_GAP}
            lineColors={RAIL_TONES.slice(1, STEPS).map((tone) => tone.line)}
          />

          {/* The row gap is 40px wherever the cards stack, because below lg each
              numeral rides at the top of its own card and the pair needs air. */}
          <ol className="grid gap-x-5 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 lg:grid-cols-3 lg:gap-y-8">
            {ENROLLMENT_STEPS.map((step, i) => {
              const tone = RAIL_TONES[i % RAIL_TONES.length];
              const isLit = i >= phase.done && i < phase.lit;

              /* A step lights when the line *reaches* it, not when the line
                 sets off towards it, so the highlight waits out one step of
                 travel. The first step is already under the line's start point
                 and has nothing to wait for.

                 Letting go is never delayed. The tail leaves from the step it
                 is releasing, so the light has to go out as the segment starts
                 to empty, not after. */
              const litDelay = isLit && i > 0 ? TRAVEL_S : 0;
              const fade = { duration: FADE_S, ease: EASE, delay: litDelay };

              return (
                <motion.li
                  key={step.n}
                  {...reveal}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  /* An odd count leaves the last card alone on the second row
                     of the two-column layout. Let it take the full width there
                     rather than sit in a half-empty row. */
                  className={cn(
                    STEPS % 2 === 1 && i === STEPS - 1 && "sm:col-span-2 lg:col-span-1",
                  )}
                >
                  {/* No `overflow-hidden`: at lg the numeral sits clear above
                      the card, and the lit ring throws a glow past the edge. */}
                  <div className="card-lift card-rule relative flex h-full flex-col items-center rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-4 text-center shadow-soft sm:p-5 lg:p-6">
                    {/* The lit state rides on its own overlay rather than on the
                        card's own border and shadow, which `.card-lift` already
                        owns a transition for. Two rules animating one property
                        is how a hover ends up fighting a loop. */}
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${tone.ring}, 0 10px 30px -12px ${tone.glow}`,
                      }}
                      animate={{ opacity: isLit ? 1 : 0 }}
                      transition={fade}
                    />

                    <span
                      aria-hidden="true"
                      className="relative mb-3 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cocoa/10 sm:mb-4 sm:h-10 sm:w-10 lg:absolute lg:-top-14 lg:left-1/2 lg:mb-0 lg:h-11 lg:w-11 lg:-translate-x-1/2"
                    >
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundImage: `linear-gradient(to bottom, ${tone.from}, ${tone.to})`,
                          boxShadow: `0 2px 0 0 ${tone.edge}, 0 6px 14px -4px ${tone.glow}`,
                        }}
                        animate={{ opacity: isLit ? 1 : 0 }}
                        transition={fade}
                      />
                      {/* Defaults to the lit ink, so the no-JS state - where the
                          disc behind it is forced back to full opacity - still
                          reads. */}
                      <motion.span
                        className="tabular relative font-display text-base font-semibold sm:text-lg"
                        style={{ color: tone.ink }}
                        animate={{ color: isLit ? tone.ink : DORMANT_INK }}
                        transition={fade}
                      >
                        {step.n}
                      </motion.span>
                    </span>

                    <h3 className="text-h3">{step.title}</h3>
                    <p className="mt-1.5 text-pretty text-base sm:mt-2">
                      <Detail step={step} />
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Step one is a tour, so the section has to offer one. Quiet on
            purpose: the CTA band is two sections down and should stay the loud
            one. */}
        <AnimatedSection className="mt-5 text-center sm:mt-8" delay={0.32}>
          <Link
            href="/tour"
            className="group inline-flex items-center gap-2 font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark"
          >
            Request a tour
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
