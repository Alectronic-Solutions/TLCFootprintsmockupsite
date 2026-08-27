"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedGroup, AnimatedItem, EASE } from "@/components/ui/AnimatedSection";
import { TravelingRailTrack, useTravelingRail } from "@/components/brand/TravelingRail";
import { RAIL_TONES } from "@/components/home/EnrollmentSteps";
import { LicenseLookup } from "@/components/ui/LicenseLookup";
import { BUSINESS } from "@/lib/constants";

/**
 * The three things a parent is actually screening for. Originally built for
 * About's "Meet LaTrell" section, and now shared with What to Expect's
 * safety chapter as well - both were stating the same three facts in
 * different words, so this is the one rendering of them.
 *
 * Titles only, deliberately: "Licensed", "CPR certified", "Mandated
 * reporter" are facts from BUSINESS and EXPECTATIONS' Safety group in
 * lib/constants.ts. No supporting sentence is introduced here that the rest
 * of the site does not already make.
 *
 * Motion is the same traveling-rail choreography as EnrollmentSteps, via
 * components/brand/TravelingRail. Reusing it rather than building a second
 * loop keeps the phase machine, geometry, and reduced-motion fallback in one
 * place.
 */

const CREDENTIALS = [
  {
    key: "Licensed",
    title: (
      <>
        State
        <br />
        Licensed
      </>
    ) as ReactNode,
  },
  {
    key: "CPR certified",
    title: (
      <>
        CPR
        <br />
        Certified
      </>
    ) as ReactNode,
  },
  {
    key: "Mandated Reporter",
    title: (
      <>
        Mandated
        <br />
        Reporter
      </>
    ) as ReactNode,
  },
];

const COUNT = CREDENTIALS.length;
const GRID_GAP = 24;

export function Credentials({
  surface = "bg-cream-deep",
  label = "Before you take my word for it",
  title = "Licensed, Certified & Prepared",
  lead,
  licenseButtonLabel,
}: {
  surface?: "bg-cream" | "bg-cream-deep";
  label?: string;
  title?: ReactNode;
  /** Optional sentence under the heading, before the cards. */
  lead?: ReactNode;
  /** Optional page-specific wording for the official license-record link. */
  licenseButtonLabel?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const phase = useTravelingRail(COUNT, railRef);

  return (
    <section className={cn("section-y", surface)}>
      <div className="container-page">
        <AnimatedGroup className="mx-auto max-w-2xl text-center">
          <AnimatedItem>
            <SectionLabel className="text-center">{label}</SectionLabel>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="text-3d mt-3 text-h2">{title}</h2>
          </AnimatedItem>
          {lead ? (
            <AnimatedItem>
              <p className="mx-auto mt-5 max-w-[52ch] text-lead text-ink">{lead}</p>
            </AnimatedItem>
          ) : null}
        </AnimatedGroup>

        <div ref={railRef} className="relative mx-auto mt-6 max-w-3xl sm:mt-8 lg:mt-[4.5rem]">
          <TravelingRailTrack
            phase={phase}
            count={COUNT}
            gapPx={GRID_GAP}
            lineColors={RAIL_TONES.slice(1, COUNT).map((tone) => tone.line)}
          />

          <ol className="grid items-stretch gap-x-5 gap-y-5 sm:grid-cols-3 sm:gap-6">
            {CREDENTIALS.map((item, i) => {
              const tone = RAIL_TONES[i % RAIL_TONES.length];
              const isLit = i >= phase.done && i < phase.lit;
              const fade = { duration: 0.6, ease: EASE };

              return (
                <motion.li
                  key={item.key}
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                >
                  <div className="card-lift card-rule relative flex h-full flex-col items-center rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-5 text-center shadow-soft sm:p-6">
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
                      className="relative mb-4 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cocoa/10 lg:absolute lg:-top-16 lg:left-1/2 lg:mb-0 lg:h-14 lg:w-14 lg:-translate-x-1/2"
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
                      <ShieldGlyph className="relative h-6 w-6" style={{ color: tone.ink }} />
                    </span>

                    <h3 className="text-h3">{item.title}</h3>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <LicenseLookup
            license={BUSINESS.license}
            recordUrl={BUSINESS.licenseRecordUrl}
            searchUrl={BUSINESS.licenseSearchUrl}
            buttonLabel={licenseButtonLabel}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * A plain rounded shield outline, in the same one-stroke-weight, round-cap
 * vocabulary as ProgramIcon and DifferentiatorIcon. Not a checkmark badge or a
 * medical cross: nothing here should read as a seal this site awarded itself.
 */
function ShieldGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 3 L19 6 V11 C19 16 16 19.5 12 21 C8 19.5 5 16 5 11 V6 Z" />
      <path d="M8.5 12 L11 14.5 L15.5 9.5" />
    </svg>
  );
}
