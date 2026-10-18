"use client";

import { useRef } from "react";
import { MotionConfig, motion, useReducedMotion, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Hand } from "lucide-react";
import { Footprint } from "@/components/brand/Footprints";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EASE } from "@/components/ui/AnimatedSection";
import { FlipCorner, FlipOverlay, useBookFlip, type FlipTurn } from "@/components/ui/PageFlip";
import { BUSINESS, EXPECTATIONS, type ExpectGroup } from "@/lib/constants";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * The page's distinct care, learning, and safety promises, as a book instead
 * of three flat cards. Practical information lives in the sections around it,
 * so a family never has to read the same point twice.
 *
 * Each chapter is one of Care / Learning / Safety, laid out as a spread - a
 * chapter opener on the left page, the list on the right. Labelled chapter
 * tabs above the book double as its table of contents.
 *
 * Turning (md and up): a real half-page turn, by button, arrow key, or by
 * grabbing a page and dragging it (components/ui/PageFlip.tsx). Going
 * forward, the right page lifts at the spine and lands on the left. Under it, the next chapter's
 * right page is already showing and the current left page stays put until
 * the leaf covers it, so nothing ever snaps at the end. Each page is a
 * self-contained half (LeftPage / RightPage) so the turn can compose halves
 * from two different chapters. Below md the pages stack, a half-page turn
 * has no meaning, and the chapter slides in instead.
 *
 * Height stability: every spread stays mounted the whole time, stacked in the
 * same CSS grid cell (`[grid-area:1/1]`) and shown or hidden with
 * `visibility`, never `display`. A CSS grid track sized `auto` takes the
 * tallest contributor to that cell regardless of visibility, so the book's
 * height is simply the tallest of the three chapters and never jumps.
 *
 * All three chapters ship in the server-rendered HTML and stay in the DOM
 * always - this is the page's core content, not a widget it can afford to
 * lose. Inactive chapters are `aria-hidden` and `inert`.
 */

const GROUPS: ExpectGroup[] = ["Care", "Learning", "Safety"];

const BLURB: Record<ExpectGroup, string> = {
  Care: "Personal care in a familiar home setting.",
  Learning: "Play, curiosity, and room to grow.",
  Safety: "The standards and practices families can count on.",
};

const CHAPTER_TONES: Record<
  ExpectGroup,
  { pageClass: string; fillClass: string; labelClass: string; markerClass: string; tabRing: string }
> = {
  Care: {
    pageClass: "book-page-care",
    fillClass: "fill-pink",
    labelClass: "!text-pink-dark",
    markerClass: "bg-pink-light ring-pink/25",
    tabRing: "ring-pink/35",
  },
  Learning: {
    pageClass: "book-page-learning",
    fillClass: "fill-amber",
    labelClass: "!text-amber-dark",
    markerClass: "bg-amber-light ring-amber/30",
    tabRing: "ring-amber/40",
  },
  Safety: {
    pageClass: "book-page-safety",
    fillClass: "fill-leaf",
    labelClass: "!text-leaf-dark",
    markerClass: "bg-leaf-light ring-leaf/30",
    tabRing: "ring-leaf/40",
  },
};

function itemsFor(group: ExpectGroup) {
  return EXPECTATIONS.filter((e) => e.group === group);
}

const LAST = GROUPS.length - 1;

export function ExpectBook() {
  const reduce = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 768px)");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistRef = useRef<HTMLDivElement>(null);

  const { active, shown, turning, progress, enter, goTo, step, dragHandlers } = useBookFlip({
    count: GROUPS.length,
    wide,
    reduce,
    // Stacked, the book runs well past one screen. Tapping Next at the
    // bottom should land on the top of the new chapter, not its end.
    onStackedTurn: () => {
      const tabs = tablistRef.current;
      if (tabs && tabs.getBoundingClientRect().top < parseFloat(getComputedStyle(tabs).scrollMarginTop)) {
        tabs.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      }
    },
  });

  function onBookKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  }

  function onTabKeyDown(e: React.KeyboardEvent, i: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % GROUPS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + GROUPS.length) % GROUPS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = LAST;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    goTo(next);
  }

  const slideIn = !reduce && !wide && enter.n > 0;

  return (
    <MotionConfig reducedMotion="user">
      <section className="book-section section-y bg-cream-deep">
        <div className="container-page">
          {/* Chapter tabs: the book's table of contents. */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Chapters"
            className="no-print mx-auto mb-5 flex scroll-mt-[calc(var(--header-h)+0.75rem)] w-fit max-w-full items-center gap-1 rounded-full border-hair border-cocoa/15 bg-cream/80 p-1 shadow-[0_2px_0_rgba(62,42,33,0.08)] sm:mb-6"
          >
            {GROUPS.map((g, i) => {
              const selected = i === active;
              const tone = CHAPTER_TONES[g];
              return (
                <button
                  key={g}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`book-tab-${g}`}
                  aria-selected={selected}
                  aria-controls={`book-panel-${g}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`relative flex min-h-[2.75rem] items-center gap-2 rounded-full px-3.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cocoa/40 sm:px-5 sm:text-base ${
                    selected ? "text-cocoa" : "text-cocoa-mid hover:text-cocoa"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="book-tab-pill"
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full bg-white shadow-[0_2px_0_rgba(62,42,33,0.12),0_6px_14px_-8px_rgba(62,42,33,0.35)] ring-1 ${tone.tabRing}`}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  ) : null}
                  <Footprint
                    className={`relative h-4 w-auto shrink-0 transition-opacity ${tone.fillClass} ${selected ? "opacity-100" : "opacity-45"}`}
                  />
                  <span className="relative">{g}</span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-roledescription="book"
            aria-label="What families can expect, three chapters"
            tabIndex={0}
            onKeyDown={onBookKeyDown}
            className="relative mx-auto max-w-5xl rounded-[1.6rem] outline-none focus-visible:ring-2 focus-visible:ring-cocoa/40 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-deep"
          >
            {/* Page-edge slabs, so the book reads as having leaves left. */}
            <div
              aria-hidden="true"
              className="absolute inset-y-3 -right-1.5 hidden w-3 rounded-r-xl border-hair border-cocoa/10 bg-cream sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-2 -right-1 hidden w-3 rounded-r-xl border-hair border-cocoa/10 bg-cream-deep sm:block"
            />

            <div className="book-frame flip-frame relative isolate grid select-none overflow-hidden rounded-[1.5rem]" {...dragHandlers}>
              {GROUPS.map((g, i) => {
                const isShown = i === shown;
                return (
                  <div
                    key={g}
                    id={`book-panel-${g}`}
                    role="tabpanel"
                    aria-labelledby={`book-tab-${g}`}
                    className="book-spread [grid-area:1/1]"
                    style={{ visibility: isShown ? "visible" : "hidden" }}
                    aria-hidden={!isShown}
                    inert={!isShown}
                  >
                    <motion.div
                      key={isShown ? `in-${enter.n}` : "idle"}
                      className="h-full"
                      initial={isShown && slideIn ? { opacity: 0, x: enter.dir * 36 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <Spread group={g} chapter={i} />
                    </motion.div>
                  </div>
                );
              })}

              {/* Dog-ears that lift on hover: the pages can be grabbed. */}
              {!turning && active > 0 ? <FlipCorner side="left" className="hidden md:block" /> : null}
              {!turning && active < LAST ? <FlipCorner side="right" className="hidden md:block" /> : null}
            </div>

            {turning && wide && !reduce ? (
              <ExpectTurn key={turning.seq} turning={turning} progress={progress} />
            ) : null}

            {/* Prev / next, raised discs at the outer edges. */}
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={active === 0}
              aria-label="Previous chapter"
              className="book-nav-btn no-print absolute -left-5 top-1/2 z-30 hidden -translate-y-1/2 sm:grid"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={active === LAST}
              aria-label="Next chapter"
              className="book-nav-btn no-print absolute -right-5 top-1/2 z-30 hidden -translate-y-1/2 sm:grid"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Phones: prev / next under the book, with where you are. */}
          <div className="no-print mx-auto mt-5 flex w-full max-w-md items-center justify-between gap-3 sm:hidden">
            <button type="button" onClick={() => step(-1)} disabled={active === 0} className="book-mobile-nav">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <span className="tabular text-sm font-semibold text-cocoa-mid" aria-hidden="true">
              {active + 1} / {GROUPS.length}
            </span>
            <button type="button" onClick={() => step(1)} disabled={active === LAST} className="book-mobile-nav">
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="no-print mt-4 hidden items-center justify-center gap-2 text-center text-sm font-semibold text-cocoa-mid md:flex">
            <Hand className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
            Grab a page and drag it to turn, or use the arrows.
          </p>

          <p aria-live="polite" className="sr-only">
            {GROUPS[active]}. Chapter {active + 1} of {GROUPS.length}.
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}

/** One chapter's spread: opener on the left page, the list on the right. */
function Spread({ group, chapter }: { group: ExpectGroup; chapter: number }) {
  return (
    <div className="grid h-full md:min-h-[28rem] md:grid-cols-2">
      <LeftPage group={group} chapter={chapter} />
      <RightPage group={group} chapter={chapter} />
    </div>
  );
}

function LeftPage({ group, chapter, className = "" }: { group: ExpectGroup; chapter: number; className?: string }) {
  const tone = CHAPTER_TONES[group];
  return (
    <div className={`book-page book-page-left ${tone.pageClass} h-full ${className}`}>
      <div aria-hidden="true" className="book-page-corner book-page-corner-tl" />
      <div className="book-page-body flex h-full flex-col items-center justify-center px-7 py-10 text-center sm:px-10 sm:py-12 md:py-9">
        <span aria-hidden="true" className="book-title-rule" />
        <SectionLabel className={`mt-5 text-center ${tone.labelClass}`}>
          Chapter {chapter + 1} of {GROUPS.length}
        </SectionLabel>
        <Footprint className={`mt-4 h-9 w-auto ${tone.fillClass}`} />
        <h2 className="mt-4 text-h2">{group}</h2>
        <p className="mt-3 max-w-[24ch] text-balance text-lead text-ink">{BLURB[group]}</p>
        <div className="mt-7 flex items-center gap-3 text-eyebrow font-semibold uppercase text-cocoa-mid/65" aria-hidden="true">
          <span className="h-px w-8 bg-cocoa/20" />
          <span>Once upon a day</span>
          <span className="h-px w-8 bg-cocoa/20" />
        </div>
        <span className="book-folio" aria-hidden="true">
          {chapter * 2 + 1}
        </span>
      </div>
    </div>
  );
}

function RightPage({ group, chapter, className = "" }: { group: ExpectGroup; chapter: number; className?: string }) {
  const tone = CHAPTER_TONES[group];
  return (
    <div className={`book-page book-page-right ${tone.pageClass} h-full ${className}`}>
      <div aria-hidden="true" className="book-page-corner book-page-corner-br" />
      <div className="book-page-body flex h-full flex-col justify-center px-7 py-10 sm:px-10 sm:py-12 md:py-9">
        <div className="mb-6 text-center">
          <p className={`text-eyebrow font-bold uppercase tracking-[0.16em] ${tone.labelClass}`}>The little details</p>
          <div aria-hidden="true" className="mx-auto mt-3 h-px w-16 bg-cocoa/15" />
        </div>
        <ul className="mx-auto w-full max-w-[25rem] space-y-4">
          {itemsFor(group).map((item) => (
            <li key={item.title} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${tone.markerClass}`}
              >
                <Footprint className={`h-4 w-auto ${tone.fillClass}`} />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug text-cocoa">{item.title}</h3>
                <p className="mt-0.5 text-base leading-relaxed text-ink">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        {group === "Safety" ? (
          <a
            href={BUSINESS.licenseRecordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-6 inline-flex items-center justify-center gap-1.5 rounded-full border-hair border-cocoa/15 bg-white/70 px-4 py-2 text-sm font-semibold text-cocoa transition-colors hover:border-leaf/40 hover:text-leaf-dark"
          >
            Verify license #{BUSINESS.license}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        <span className="book-folio" aria-hidden="true">
          {chapter * 2 + 2}
        </span>
      </div>
    </div>
  );
}

/** A chapter turn: the shared leaf, dressed in this book's pages. */
function ExpectTurn({ turning, progress }: { turning: FlipTurn; progress: MotionValue<number> }) {
  const { from, to, dir } = turning;
  const A = GROUPS[from];
  const B = GROUPS[to];
  const forward = dir === 1;

  return (
    <FlipOverlay
      turn={turning}
      progress={progress}
      className="book-turn"
      radius="1.1rem"
      staticLeft={<LeftPage group={forward ? A : B} chapter={forward ? from : to} />}
      staticRight={<RightPage group={forward ? B : A} chapter={forward ? to : from} />}
      front={
        forward ? (
          <RightPage group={A} chapter={from} className="rounded-r-[1.1rem]" />
        ) : (
          <LeftPage group={A} chapter={from} className="rounded-l-[1.1rem]" />
        )
      }
      back={
        forward ? (
          <LeftPage group={B} chapter={to} className="rounded-l-[1.1rem]" />
        ) : (
          <RightPage group={B} chapter={to} className="rounded-r-[1.1rem]" />
        )
      }
    />
  );
}
