"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/media/Photo";
import { HoursClock } from "@/components/sections/HoursClock";
import { ScrollSprig } from "@/components/brand/ScrollSprig";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/cn";
import type { PhotoKey } from "@/lib/photos";

/**
 * The full-bleed photo-plus-clock band, in one place.
 *
 * This used to be three near-identical copies - "Inside the day" on the home
 * page, "The day" on What to Expect, and "Hours and availability" on About -
 * that had already drifted apart in gap, measure and source order. Every
 * caller now renders this component, so the recipe can only drift on
 * purpose, through a prop.
 *
 * HARD CONSTRAINT, from lib/constants.ts (the removed DAILY_RHYTHM note): no
 * daily schedule is published. This band shows the open window -
 * BUSINESS.hours - and nothing else.
 */
export function DayBand({
  photo,
  label,
  title,
  lead,
  body,
  link,
  side = "clock-left",
  sprig = false,
  copyAlign = "text-center lg:text-left",
  clockClassName,
}: {
  photo: PhotoKey;
  label: string;
  title: ReactNode;
  lead: ReactNode;
  body?: ReactNode;
  link?: { href: string; label: string };
  /** Which column the clock takes at lg. Mobile always reads copy first. */
  side?: "clock-left" | "clock-right";
  /** A branch swinging in over the top-right corner. Off by default: only
   *  What to Expect's copy had room for one. */
  sprig?: boolean;
  copyAlign?: string;
  clockClassName?: string;
}) {
  const clockLeft = side === "clock-left";
  const copyMeasureAlign = copyAlign.includes("lg:text-left") ? "lg:mx-0" : "lg:mx-auto";

  return (
    <section className="section-y relative isolate overflow-hidden bg-cream">
      {/* The scene, full-bleed behind the whole section, scrimmed back to
          cream the way the hero is. `isolate` is what lets -z-10 sit above
          the section's own cream but under the content. */}
      <div className="absolute inset-0 -z-10">
        <Photo name={photo} fill fillLabel="none" sizes="100vw" />

        <div aria-hidden="true" className="absolute inset-0 bg-cream/75 lg:bg-cream/45" />
        {/* Reading scrim, mirrored to whichever side the copy lands on: opaque
            behind the words, transparent over the photo's quiet third. */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-cream via-cream/85 to-cream/30",
            clockLeft
              ? "lg:bg-gradient-to-l lg:from-cream lg:via-cream/80 lg:to-transparent"
              : "lg:bg-gradient-to-r lg:from-cream lg:via-cream/80 lg:to-transparent",
          )}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent"
        />
      </div>

      {sprig ? (
        <ScrollSprig
          side="right"
          flip
          tilt={-8}
          windScale={1.2}
          className="absolute -right-10 top-16 hidden h-32 opacity-70 lg:block"
        />
      ) : null}

      <div className="container-page relative">
        <div
          className={cn(
            "dayband-grid grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10",
          )}
        >
          {/* Source order puts the clock first when it takes the left column
              at lg. On a phone the heading has to lead regardless, or the
              section opens on a dial with nothing to say what it is. */}
          <AnimatedSection
            className={cn("order-2", clockLeft ? "lg:order-1" : "lg:order-2")}
          >
            <HoursClock className={clockClassName} />
          </AnimatedSection>

          <AnimatedSection
            className={cn("order-1", clockLeft ? "lg:order-2" : "lg:order-1", copyAlign)}
            delay={0.08}
          >
            <SectionLabel className={copyAlign}>{label}</SectionLabel>
            <h2 className="text-3d mt-4 text-balance text-h2">{title}</h2>
            <div className={cn("mx-auto mt-5 max-w-[42ch] text-lead text-ink", copyMeasureAlign)}>{lead}</div>
            {body ? (
              <div className={cn("mx-auto mt-6 max-w-[42ch] text-body", copyMeasureAlign)}>{body}</div>
            ) : null}
            {link ? (
              <div className="mt-8">
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark"
                >
                  {link.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            ) : null}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
