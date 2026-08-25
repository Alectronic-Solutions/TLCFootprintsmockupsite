"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, MoveHorizontal } from "lucide-react";
import { Footprint } from "@/components/brand/Footprints";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EASE } from "@/components/ui/AnimatedSection";
import { BUSINESS, EXPECTATIONS, type ExpectGroup } from "@/lib/constants";

/**
 * The page's distinct care, learning, and safety promises, as a book instead
 * of three flat cards. Practical information lives in the sections around it,
 * so a family never has to read the same point twice.
 *
 * Each chapter is one of Care / Learning / Safety, laid out as a spread - a
 * chapter opener on the left page, the list on the right. Turning the page
 * flips the *whole spread* as one leaf, hinged at the book's own outer edge,
 * rather than trying to keep two half-pages in sync. That is a simplification
 * of real book physics and a deliberate one: it never has to reconcile two
 * independently-flipping halves, and a spread is naturally one idea.
 *
 * Height stability: every spread stays mounted the whole time, stacked in the
 * same CSS grid cell (`[grid-area:1/1]`) and shown or hidden with
 * `visibility`, never `display`. A CSS grid track sized `auto` takes the
 * tallest contributor to that cell regardless of visibility, so the book's
 * height is simply the tallest of the three chapters and never jumps when a
 * shorter or longer one turns in.
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
  { pageClass: string; footprintClass: string; labelClass: string }
> = {
  Care: {
    pageClass: "book-page-care",
    footprintClass: "fill-pink",
    labelClass: "!text-pink-dark",
  },
  Learning: {
    pageClass: "book-page-learning",
    footprintClass: "fill-amber",
    labelClass: "!text-amber-dark",
  },
  Safety: {
    pageClass: "book-page-safety",
    footprintClass: "fill-leaf",
    labelClass: "!text-leaf-dark",
  },
};

const DETAIL_FOOTPRINT_COLORS = ["fill-pink", "fill-amber", "fill-leaf"] as const;

function itemsFor(group: ExpectGroup) {
  return EXPECTATIONS.filter((e) => e.group === group);
}

type Turn = { from: number; to: number; dir: 1 | -1 };

const DURATION = 0.72;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 300;

export function ExpectBook() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState<Turn | null>(null);
  const [announce, setAnnounce] = useState(`${GROUPS[0]}. Chapter 1 of ${GROUPS.length}.`);
  const bookRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (to: number) => {
      if (to === index || to < 0 || to > GROUPS.length - 1 || turning) return;

      if (reduce) {
        setIndex(to);
        setAnnounce(`${GROUPS[to]}. Chapter ${to + 1} of ${GROUPS.length}.`);
        return;
      }

      setTurning({ from: index, to, dir: to > index ? 1 : -1 });
    },
    [index, turning, reduce],
  );

  const commit = useCallback(() => {
    setTurning((t) => {
      if (!t) return t;
      setIndex(t.to);
      setAnnounce(`${GROUPS[t.to]}. Chapter ${t.to + 1} of ${GROUPS.length}.`);
      return null;
    });
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x <= -SWIPE_DISTANCE || info.velocity.x <= -SWIPE_VELOCITY) {
      goTo(index + 1);
    } else if (info.offset.x >= SWIPE_DISTANCE || info.velocity.x >= SWIPE_VELOCITY) {
      goTo(index - 1);
    }
  }

  return (
    <section className="book-section section-y bg-cream-deep">
      <div className="container-page">
        <div
          ref={bookRef}
          role="group"
          aria-roledescription="book"
          aria-label="What families can expect, three chapters"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="relative mx-auto max-w-5xl outline-none"
          style={{ perspective: reduce ? undefined : 2200 }}
        >
          {/* Page-edge slabs, so the book reads as having leaves left even
              when a spread is showing. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-3 -right-1.5 hidden w-3 rounded-r-xl border-hair border-cocoa/10 bg-cream sm:block"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-2 -right-1 hidden w-3 rounded-r-xl border-hair border-cocoa/10 bg-cream-deep sm:block"
          />

          <motion.div
            className="book-frame relative isolate grid overflow-hidden rounded-[1.5rem]"
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
          >
            {/* Base spreads, one per chapter, stacked in the same cell so the
                book's height is always the tallest of the three. */}
            {GROUPS.map((g, i) => (
              <div
                key={g}
                className="book-spread [grid-area:1/1]"
                style={{ visibility: i === index ? "visible" : "hidden" }}
                aria-hidden={i !== index}
                inert={i !== index}
              >
                <Spread group={g} chapter={i} total={GROUPS.length} />
              </div>
            ))}

            {turning && !reduce ? (
              <TurningLeaf turning={turning} duration={DURATION} onDone={commit} />
            ) : null}
          </motion.div>

          {/* Prev / next, raised discs at the outer edges. */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous chapter"
            className="book-nav-btn no-print absolute left-1 top-1/2 z-30 -translate-y-1/2 max-sm:!hidden sm:-left-5"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === GROUPS.length - 1}
            aria-label="Next chapter"
            className="book-nav-btn no-print absolute right-1 top-1/2 z-30 -translate-y-1/2 max-sm:!hidden sm:-right-5"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Chapter dots, in the dotted-heart language the rest of the site
            uses for a divider (components/brand/HeartDots.tsx): the active
            chapter is the heart, the others are plain dots. */}
        <div className="no-print mt-5 flex flex-col items-center">
          <div className="flex w-full max-w-md items-center justify-between gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="book-mobile-nav"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === GROUPS.length - 1}
              className="book-mobile-nav"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 sm:mt-0" role="tablist" aria-label="Chapters">
            {GROUPS.map((g, i) => (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to the ${g} chapter`}
                onClick={() => goTo(i)}
                className="grid h-8 w-8 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:scale-110"
              >
                {i === index ? (
                  <svg viewBox="0 0 24 22" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <path
                      d="M12 21 C 4 14.5, 1 11, 1 7.2 C 1 3.8, 3.6 1, 7 1 C 9.1 1, 10.9 2.1, 12 3.8 C 13.1 2.1, 14.9 1, 17 1 C 20.4 1, 23 3.8, 23 7.2 C 23 11, 20 14.5, 12 21 Z"
                      className={CHAPTER_TONES[g].footprintClass}
                    />
                  </svg>
                ) : (
                  <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-cocoa/25" />
                )}
              </button>
            ))}
          </div>

          <p className="mt-2 flex items-center gap-2 text-center text-sm font-semibold text-cocoa-mid">
            <MoveHorizontal className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
            <span className="sm:hidden">Tap an arrow, swipe the page, or choose a chapter.</span>
            <span className="hidden sm:inline">Click an arrow, drag the page, or choose a chapter.</span>
          </p>
        </div>

        <p aria-live="polite" className="sr-only">
          {announce}
        </p>
      </div>
    </section>
  );
}

/** One chapter's spread: opener on the left page, the list on the right. */
function Spread({
  group,
  chapter,
  total,
}: {
  group: ExpectGroup;
  chapter: number;
  total: number;
}) {
  const tone = CHAPTER_TONES[group];

  return (
    <div className={`book-page ${tone.pageClass} relative grid h-full md:min-h-[29rem] md:grid-cols-2`}>
      <div aria-hidden="true" className="book-page-corner book-page-corner-tl" />
      <div aria-hidden="true" className="book-page-corner book-page-corner-br" />
      {/* The spine: a soft gutter shadow down the center, from md up. */}
      <div
        aria-hidden="true"
        className="book-spine pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-8 -translate-x-1/2 md:block"
      />

      <div className="relative flex flex-col items-center justify-center px-7 py-10 text-center sm:px-10 sm:py-12 md:px-10 md:py-8">
        <span aria-hidden="true" className="book-title-rule" />
        <SectionLabel className={`mt-5 text-center ${tone.labelClass}`}>Chapter {chapter + 1}</SectionLabel>
        <Footprint className={`mt-3 h-8 w-auto ${tone.footprintClass}`} />
        <h2 className="text-3d mt-4 text-h2">{group}</h2>
        <p className="mt-3 max-w-[27ch] text-lead text-ink">{BLURB[group]}</p>
        <div className="mt-7 flex items-center gap-3 text-eyebrow font-semibold uppercase text-cocoa-mid/65 md:mt-5" aria-hidden="true">
          <span className="h-px w-8 bg-cocoa/20" />
          <span>Once upon a day</span>
          <span className="h-px w-8 bg-cocoa/20" />
        </div>
        <span className="tabular mt-7 block text-eyebrow font-semibold text-cocoa-mid/50 md:mt-5">
          {chapter + 1} of {total}
        </span>
      </div>

      <div className="relative flex flex-col justify-center border-t-hair border-cocoa/10 px-7 py-10 sm:px-10 sm:py-12 md:border-l-hair md:border-t-0 md:px-10 md:py-8">
        <div className="mb-6 text-center md:mb-3">
          <p className={`text-eyebrow font-bold uppercase tracking-[0.16em] ${tone.labelClass}`}>The little details</p>
          <div aria-hidden="true" className="mx-auto mt-3 h-px w-16 bg-cocoa/15" />
        </div>
        <ul className="space-y-5 text-center md:space-y-3">
          {itemsFor(group).map((item, itemIndex) => (
            <li key={item.title}>
              <h3 className="flex items-center justify-center gap-2 font-semibold text-cocoa md:text-[1rem]">
                <Footprint
                  className={`h-4 w-auto shrink-0 ${DETAIL_FOOTPRINT_COLORS[(chapter + itemIndex) % DETAIL_FOOTPRINT_COLORS.length]}`}
                  left={false}
                />
                {item.title}
              </h3>
              <p className="mx-auto mt-1 max-w-[37ch] text-base md:text-sm md:leading-[1.5]">{item.detail}</p>
            </li>
          ))}
        </ul>
        {group === "Safety" ? (
          <a
            href={BUSINESS.licenseRecordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark"
          >
            Verify license #{BUSINESS.license}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        <span className="tabular mt-7 block text-center text-eyebrow font-semibold text-cocoa-mid/50 md:mt-4">
          {chapter + 2}
        </span>
      </div>
    </div>
  );
}

/**
 * The animated leaf. It carries the *entire* spread as one rigid card and
 * pivots at the book's outer edge - the book's own left edge going forward,
 * its right edge going back - so the flip never has to keep two independent
 * half-page turns in sync.
 *
 * Front face is the chapter being left; back face is the one being turned
 * to. `backfaceVisibility: hidden` on both is what keeps the reversed face
 * from showing through mid-turn.
 */
function TurningLeaf({
  turning,
  duration,
  onDone,
}: {
  turning: Turn;
  duration: number;
  onDone: () => void;
}) {
  const { from, to, dir } = turning;
  const origin = dir === 1 ? "left center" : "right center";
  const rotateFrom = 0;
  const rotateTo = dir === 1 ? -180 : 180;

  return (
    <motion.div
      className="book-leaf no-print absolute inset-0 z-20"
      style={{ transformStyle: "preserve-3d", transformOrigin: origin }}
      initial={{ rotateY: rotateFrom }}
      animate={{
        rotateY: rotateTo,
        rotateZ: [0, dir * 0.55, 0],
        scaleX: [1, 0.982, 1],
        x: [0, dir * -7, 0],
        boxShadow: [
          "0 0 0 rgba(62,42,33,0)",
          "0 30px 78px -18px rgba(62,42,33,0.48)",
          "0 0 0 rgba(62,42,33,0)",
        ],
      }}
      transition={{ duration, ease: EASE, times: [0, 0.5, 1] }}
      onAnimationComplete={onDone}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[1.25rem]"
        style={{ backfaceVisibility: "hidden" }}
      >
        <Spread group={GROUPS[from]} chapter={from} total={GROUPS.length} />
        <motion.div
          aria-hidden="true"
          className={`book-turn-shade ${dir === 1 ? "book-turn-shade-forward" : "book-turn-shade-backward"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.58, 0] }}
          transition={{ duration, ease: EASE, times: [0, 0.48, 1] }}
        />
      </div>
      <div
        className="absolute inset-0 overflow-hidden rounded-[1.25rem]"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <Spread group={GROUPS[to]} chapter={to} total={GROUPS.length} />
        <motion.div
          aria-hidden="true"
          className={`book-turn-shade ${dir === 1 ? "book-turn-shade-backward" : "book-turn-shade-forward"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.42, 0] }}
          transition={{ duration, ease: EASE, times: [0, 0.52, 1] }}
        />
      </div>
    </motion.div>
  );
}
