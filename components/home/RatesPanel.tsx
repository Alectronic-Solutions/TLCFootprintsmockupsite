"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgramIcon } from "@/components/brand/ProgramIcon";
import { PROGRAMS, TUITION, monthlyEquivalent } from "@/lib/constants";

/**
 * What it costs.
 *
 * The one section on the home page whose entire job is to hand over a number,
 * which is why the number is the largest thing in each card rather than a line
 * under a paragraph. The subtitle claims other sites make you call to find out;
 * a price set at the same size as the body copy above it does not read like a
 * site that means that.
 *
 * The schedule toggle is here because the brief prices both a full-time and a
 * part-time rate, and only the full-time pair was ever rendered on this page.
 *
 * It had a second job until August 2026: the availability panel above rendered
 * these same two programs as centred icon-and-name cards a few hundred pixels
 * up, and without something that belonged only to this section, two centred
 * grids of the same two programs read as the same component pasted twice. That
 * panel is gone - the duplication was the reason it went - so this is now the
 * only place on the home page the two tiers appear.
 *
 * Both prices stay on screen. Putting one program's rate behind a click would
 * reintroduce exactly the friction the subtitle is bragging about removing -
 * the toggle changes which pair of rates is shown, never how many.
 */

const SCHEDULES = [
  { id: "full", label: "Full-time" },
  { id: "part", label: "Part-time" },
] as const;

type ScheduleId = (typeof SCHEDULES)[number]["id"];

/** Shorter than CountUp's 900ms: this fires on a click, not on a scroll. */
const TWEEN_MS = 450;

/**
 * A number that tweens from where it is to where it is going.
 *
 * Deliberately not CountUp. That one is single-shot and always counts up from
 * zero, which is right for a figure revealed on scroll and wrong here: a toggle
 * would render $305 -> $0 -> $250 and read as a bug rather than as a change.
 *
 * `from` tracks the value actually on screen, rewritten every frame, so a second
 * toggle part-way through a tween continues from what the eye can see instead of
 * snapping back to the last settled figure.
 */
function TweenNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;

    // The global reduced-motion kill switch in globals.css only reaches CSS.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setDisplay(value);
      return;
    }

    const t0 = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / TWEEN_MS);
      // Ease-out cubic, the same shape CountUp uses.
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(start + (value - start) * eased);
      from.current = next;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  // The settled value is what renders on the server, so a crawler, a printer,
  // and a visitor with JavaScript off all still get a real rate.
  return <span className={className}>{display.toLocaleString()}</span>;
}

export function RatesPanel() {
  const [schedule, setSchedule] = useState<ScheduleId>("full");
  const scheduleLabel = schedule === "full" ? "full-time" : "part-time";

  return (
    <section id="rates" className="section-y bg-cream-deep max-sm:py-6">
      <div className="container-page">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <SectionLabel className="text-center">Programs and rates</SectionLabel>
          <h2 className="text-3d mt-3 text-h2 sm:mt-4">What it costs</h2>
          {/* The second line is the one to lose on a phone: the first rate is
              already a thumb's length below it, so "here are the rates" points
              at something the eye has arrived at anyway. The claim it is
              answering is the half worth keeping at every width. */}
          <p className="mx-auto mt-3 max-w-[46ch] text-lead text-ink sm:mt-5">
            Most daycare sites make you call to find out.
            <span className="hidden sm:inline">
              <br />
              Here are the rates.
            </span>
          </p>
        </AnimatedSection>

        {/* A recessed track with the selected option raised out of it, on the
            same physics as Button's secondary variant: a hard 2px edge beneath
            the pill, not a blur. Real radio inputs, so arrow keys move between
            the two and assistive tech is told what this is without a hand-rolled
            role. The inputs are clipped rather than hidden, so the focus ring has
            to be drawn on the label instead of on the control. */}
        <AnimatedSection delay={0.06} className="mt-4 flex justify-center print:hidden sm:mt-8">
          <fieldset>
            <legend className="sr-only">Schedule</legend>
            <div className="inline-flex gap-1 rounded-full border-hair border-cocoa/10 bg-cream p-1 shadow-[inset_0_1px_4px_rgba(62,42,33,0.10)]">
              {SCHEDULES.map((option) => (
                <div key={option.id}>
                  <input
                    type="radio"
                    name="rate-schedule"
                    id={`rate-${option.id}`}
                    value={option.id}
                    checked={schedule === option.id}
                    onChange={() => setSchedule(option.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`rate-${option.id}`}
                    /* The border is always present and only changes colour, so
                       selecting an option cannot nudge the other one sideways. */
                    className="block cursor-pointer select-none rounded-full border-hair border-transparent px-5 py-2.5 text-sm font-semibold text-cocoa-mid transition-[background-color,color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-cocoa peer-checked:border-cocoa/20 peer-checked:bg-gradient-to-b peer-checked:from-white peer-checked:to-cream-deep peer-checked:text-cocoa peer-checked:shadow-[0_2px_0_0_rgba(62,42,33,0.10),0_6px_14px_-6px_rgba(62,42,33,0.18)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-leaf-dark"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </AnimatedSection>

        <ul className="mx-auto mt-4 grid max-w-3xl gap-3 sm:mt-8 sm:gap-5 md:grid-cols-2 md:gap-6">
          {PROGRAMS.map((program, i) => {
            const weekly = schedule === "full" ? program.fullTime : program.partTime;
            const monthly = monthlyEquivalent(weekly);

            return (
              <AnimatedSection as="li" key={program.slug} delay={i * 0.08}>
                <Card
                  interactive
                  className="flex h-full flex-col text-left max-sm:p-4 sm:items-center sm:text-center"
                >
                  {/* A centred icon above a centred name costs two lines of card
                      before a parent has read anything. On a phone the icon sits
                      beside the name and the pair costs one; from sm up, where
                      the height is not being fought over, it is the centred stack
                      again. */}
                  <div className="flex items-center gap-3 sm:w-full sm:flex-col sm:gap-0">
                    <ProgramIcon
                      name={program.icon}
                      className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
                    />
                    {/*
                      One name wraps to two lines on its own and the other is
                      short enough to sit on one, so the two rate figures only
                      land on the same baseline if the short one also takes two
                      lines. 2.6em is two lines of `text-h3`, whose line-height is
                      1.30, and the break below fills that second line instead of
                      leaving it empty. The split is taken from the name itself so
                      renaming a tier in `PROGRAMS` never leaves stale copy here.

                      Both are md-only, because that is where the cards sit side
                      by side and there is a baseline to match. Stacked, nothing
                      needs padding out to meet anything, and the forced break
                      would spend a line of the screen this section is trying to
                      fit inside on the word "Care".
                    */}
                    <h3 className="text-balance text-h3 sm:mt-5 md:min-h-[2.6em]">
                      {program.slug === "infant" && program.name.includes(" ") ? (
                        <>
                          <span className="md:hidden">{program.name}</span>
                          <span className="hidden md:inline">
                            {program.name.slice(0, program.name.lastIndexOf(" "))}
                            <br />
                            {program.name.slice(program.name.lastIndexOf(" ") + 1)}
                          </span>
                        </>
                      ) : (
                        program.name
                      )}
                    </h3>
                  </div>
                  {/* Two lines per card, and the two cards are what has to fit
                      on one screen. The icon and the tier name already say which
                      child this rate is for, the rate is what a parent came to
                      this section for, and /programs describes both tiers
                      properly - so on a phone the description is the line that
                      goes. It returns at sm, where the height is there to spend. */}
                  <p className="mt-2 hidden flex-1 text-balance text-sm sm:mt-4 sm:block sm:text-base">
                    {program.summary}
                  </p>

                  <div className="mt-3 w-full border-t-hair border-cocoa/10 pt-3 sm:mt-4 sm:pt-4">
                    {/*
                      The figures are decoration to a screen reader: mid-tween
                      they are neither the old rate nor the new one. The polite
                      region below carries the settled value as a sentence.
                    */}
                    <div
                      aria-hidden="true"
                      /* The monthly figure sits beside the weekly one rather than
                         under it on a phone: a line back, and the two numbers a
                         parent is comparing end up on one baseline. `flex-wrap`
                         is the escape hatch for a 320px screen, where the pair
                         does not fit across. */
                      className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 print:hidden sm:block"
                    >
                      <p className="tabular font-display text-3xl font-semibold text-cocoa sm:text-5xl">
                        $<TweenNumber value={weekly} />
                        <span className="text-sm font-normal text-cocoa-mid sm:text-base">
                          {" "}
                          / week
                        </span>
                      </p>
                      <p className="tabular text-sm text-cocoa-mid sm:mt-1 sm:text-base">
                        about $<TweenNumber value={monthly} /> a month
                      </p>
                    </div>

                    <p className="sr-only" aria-live="polite">
                      {program.name}: ${weekly} per week {scheduleLabel}, about $
                      {monthly.toLocaleString()} a month.
                    </p>

                    {/*
                      Parents print this. A sheet showing only whichever schedule
                      happened to be selected would be a misleading rate sheet, so
                      print gets both figures and no toggle.
                    */}
                    <p className="tabular hidden text-base text-cocoa print:block">
                      ${program.fullTime} / week full-time
                      <br />${program.partTime} / week part-time
                    </p>
                    <p className="hidden text-xs text-cocoa-mid print:block">
                      {TUITION.partTimeNote}
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            );
          })}
        </ul>

        {/*
          The single biggest source of parent misunderstanding in home childcare,
          and it appeared nowhere on the home page. Only the first sentence of
          `basisDetail` runs here; /programs carries the full explanation in its
          amber callout, which is where a parent who wants the reasoning goes.
        */}
        <AnimatedSection className="mx-auto mt-4 max-w-prose text-center sm:mt-8">
          <p className="text-balance font-semibold text-cocoa max-sm:text-base">
            {TUITION.basisHeadline}
          </p>
          {/* The headline is the fact; this line is the reasoning behind it, and
              on a phone it is two more lines standing between the rates and the
              way to ask about them. /programs carries the full explanation for a
              parent who wants it. */}
          <p className="mt-1 hidden text-balance text-sm text-cocoa-mid sm:block">
            {TUITION.basisDetail.split(". ")[0]}.
          </p>
          {schedule === "part" ? (
            <p className="mt-1 text-balance text-sm text-cocoa-mid">
              {TUITION.partTimeNote}
            </p>
          ) : null}
          <p className="mt-1 text-balance text-sm text-cocoa-mid">
            {TUITION.availabilityNote}
          </p>
        </AnimatedSection>

        <AnimatedSection className="mt-4 text-center sm:mt-8">
          <Button href="/programs" variant="secondary" className="group">
            See full rates
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
