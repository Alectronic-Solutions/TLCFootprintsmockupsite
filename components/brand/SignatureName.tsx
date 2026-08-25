"use client";

import { Fragment, type ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Seconds of pen travel per character. Word duration is derived from this
 * rather than fixed, so a six-letter word takes longer to write than a
 * four-letter one and the pen keeps one constant speed across the whole name.
 *
 * This is the signature's speed: unhurried, because the whole point of that
 * line is watching it be written. A longer line has to move faster or it is
 * still going when the reader has moved on - see `perChar`.
 */
const PER_CHAR = 0.1;
/** The pen lifting between words, at `PER_CHAR` speed. */
const WORD_GAP = 0.1;
/** A beat before the first stroke, so the reveal does not start mid-scroll. */
const LEAD_IN = 0.12;

/**
 * The nib rides the baseline, not the middle of the box. Great Vibes sits low
 * in its line box (tall ascenders, deep descenders), which puts the baseline at
 * roughly seven tenths of the way down.
 *
 * This is a property of the typeface, not of the effect, so it is the default
 * rather than a constant: a hand with a taller x-height and shallower
 * descenders puts its baseline lower in the box, and a nib left at 68% floats
 * above the ink it is supposed to be laying down. See `nibTop`.
 */
const NIB_TOP = "68%";

/**
 * `-10%` on the left and right: the box is only the advance width, and Great
 * Vibes throws swashes well outside it. Clipping to the box edge would shave
 * the entry stroke of every word and the tail of the last letter.
 */
const OVERHANG = 10;
const HIDDEN = `inset(-45% ${100 + OVERHANG}% -45% -${OVERHANG}%)`;
const WRITTEN = `inset(-45% -${OVERHANG}% -45% -${OVERHANG}%)`;

/**
 * The nib has to sit exactly on the clip edge, which travels the same overhung
 * span the clip does. Running it 0% to 100% instead leaves the glow up to a
 * tenth of a word adrift from the ink it is supposed to be laying down.
 */
/** A space with no break opportunity in it. See `joinNext`. */
const NBSP = "\u00A0";

const NIB_FROM = `-${OVERHANG}%`;
const NIB_TO = `${100 + OVERHANG}%`;

/**
 * A word in a handwritten line. The plain-string form is the common case; the
 * object form is for a word that also has to be a link - the licence line in
 * the hero writes "licensed" as a link to the state record, with the facility
 * number riding along behind it inside the same anchor.
 */
export type HandwrittenWord =
  | string
  | {
      text: string;
      href?: string;
      /** Rendered inside the anchor, immediately after the word. */
      after?: ReactNode;
      ariaLabel?: string;
      /**
       * Join this word to the next one with a non-breaking space, so the line
       * cannot break between them. The way to control where a wrapped line
       * breaks: glue a word to its neighbour and the pair moves down together.
       */
      joinNext?: boolean;
    };

type Stroke = {
  word: HandwrittenWord;
  dur: number;
  delay: number;
};
type Timing = { dur: number; delay: number; still: boolean };

const textOf = (w: HandwrittenWord) => (typeof w === "string" ? w : w.text);
const joinsNext = (w: HandwrittenWord) => typeof w !== "string" && !!w.joinNext;

/**
 * One word, uncovered by a clip edge travelling left to right, with the nib
 * glow riding that edge.
 */
function Stroke({
  word,
  dur,
  delay,
  still,
  state,
  nibTop,
}: Stroke & { still: boolean; state: "written" | "hidden"; nibTop: string }) {
  const content =
    typeof word === "string" ? (
      word
    ) : word.href ? (
      <a
        href={word.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={word.ariaLabel}
        className="underline decoration-transparent underline-offset-[0.15em] transition-colors hover:decoration-current"
      >
        {word.text}
        {word.after}
      </a>
    ) : (
      <>
        {word.text}
        {word.after}
      </>
    );

  return (
    /* Relative wrapper so the nib can sit outside the clipped span: inside it,
       the nib would be cut off by the very edge it marks. */
    <span className="relative inline-block">
      <motion.span
        className="inline-block"
        /* Rendered on the server too, so the line is never visible for a
           frame before the first stroke. */
        initial={{ clipPath: HIDDEN }}
        animate={state}
        custom={{ dur, delay, still }}
        variants={{
          /* Rearming happens off screen, so it is instant. */
          hidden: { clipPath: HIDDEN, transition: { duration: 0 } },
          written: (c: Timing) => ({
            clipPath: WRITTEN,
            /* Linear: a pen does not ease. */
            transition: c.still
              ? { duration: 0 }
              : { duration: c.dur, delay: c.delay, ease: "linear" },
          }),
        }}
      >
        {content}
      </motion.span>

      <motion.span
        aria-hidden="true"
        /* Drawn in the line's own ink, like `.status-pulse` was: the signature
           is pink and the hero's licence line is green, and a pen that lays
           down one colour while glowing another reads as a stray dot. */
        className="pointer-events-none absolute rounded-full"
        style={{
          top: nibTop,
          height: "0.1em",
          width: "0.1em",
          marginLeft: "-0.05em",
          marginTop: "-0.05em",
          backgroundColor: "color-mix(in srgb, currentColor 60%, transparent)",
          boxShadow: "0 0 0.5em 0.22em color-mix(in srgb, currentColor 25%, transparent)",
        }}
        initial={{ left: NIB_FROM, opacity: 0 }}
        animate={state}
        custom={{ dur, delay, still }}
        variants={{
          hidden: { left: NIB_FROM, opacity: 0, transition: { duration: 0 } },
          written: (c: Timing) =>
            c.still
              ? { left: NIB_TO, opacity: 0, transition: { duration: 0 } }
              : {
                  left: [NIB_FROM, NIB_TO],
                  opacity: [0, 0.9, 0.9, 0],
                  transition: {
                    duration: c.dur,
                    delay: c.delay,
                    ease: "linear",
                    /* Held lit for the stroke, snuffed as the pen lifts. */
                    opacity: {
                      duration: c.dur,
                      delay: c.delay,
                      ease: "linear",
                      times: [0, 0.06, 0.86, 1],
                    },
                  },
                },
        }}
      />
    </span>
  );
}

/**
 * A line of script that is written rather than faded in.
 *
 * Each word is uncovered by a clip edge travelling left to right, one word
 * after the next. Per word and not per letter is deliberate: Great Vibes joins
 * its glyphs, and a per-letter reveal pops the joins in one at a time instead
 * of drawing one continuous stroke.
 *
 * It replays. `once: false` is the whole point of the effect: scrolling back to
 * the line and watching it written again is the reason it is animated at all,
 * and neither of the two places it is used has anything a repeat would
 * interrupt.
 *
 * Reduced motion snaps straight to the finished line. It takes the same path
 * through the same markup rather than returning plain text: the server cannot
 * read the preference, so branching the DOM on it would hand the client a
 * different tree to hydrate than the one it was sent.
 */
export function HandwrittenLine({
  words,
  className,
  perChar = PER_CHAR,
  nibTop = NIB_TOP,
}: {
  words: readonly HandwrittenWord[];
  className?: string;
  /**
   * Seconds of pen travel per character. Lower is faster. The gap between
   * words scales with it, so the pen keeps one coherent hand at any speed.
   *
   * Worth setting on anything much longer than a name: at the default, a
   * forty-character line is still being written five seconds in.
   */
  perChar?: number;
  /**
   * Where the baseline sits in the line box, as a percentage from the top. Set
   * it per typeface: the default is Great Vibes' baseline, and a different hand
   * will need its own value or the nib will not sit on the ink.
   */
  nibTop?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  /* Half the line has to be on screen before the pen starts, and the animation
     arms again once it leaves. A short single line crosses that threshold
     decisively at any viewport height, so there is no flicker at the edges. */
  const inView = useInView(ref, { amount: 0.5 });
  const still = !!reduce;
  const state = still || inView ? "written" : "hidden";

  const strokes: Stroke[] = [];
  const gap = WORD_GAP * (perChar / PER_CHAR);
  let at = LEAD_IN;
  for (const word of words) {
    const dur = textOf(word).length * perChar;
    strokes.push({ word, dur, delay: at });
    at += dur + gap;
  }

  /**
   * Words joined by `joinNext` are gathered into runs, and each run is rendered
   * inside one `nowrap` box.
   *
   * The box is what actually holds them together. A non-breaking space between
   * the two is not enough: every word here is an atomic inline, and the
   * boundary between two atomic inlines is its own soft wrap opportunity that
   * glue characters sitting between them do not close.
   */
  const runs: Stroke[][] = [];
  for (const stroke of strokes) {
    const open = runs[runs.length - 1];
    if (open && joinsNext(open[open.length - 1].word)) open.push(stroke);
    else runs.push([stroke]);
  }

  return (
    <p ref={ref} className={className}>
      {runs.map((run, r) => (
        <Fragment key={`${textOf(run[0].word)}-${r}`}>
          {run.length === 1 ? (
            <Stroke {...run[0]} still={still} state={state} nibTop={nibTop} />
          ) : (
            <span className="whitespace-nowrap">
              {run.map((stroke, i) => (
                <Fragment key={`${textOf(stroke.word)}-${i}`}>
                  <Stroke {...stroke} still={still} state={state} nibTop={nibTop} />
                  {i < run.length - 1 ? NBSP : ""}
                </Fragment>
              ))}
            </span>
          )}
          {/* The break opportunity between runs has to live outside the
              inline-blocks, or a wrapped line has nowhere to wrap. */}
          {r < runs.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}

/**
 * The one line on the site that is a name rather than copy, so it is the one
 * line that gets written instead of faded in.
 */
export function SignatureName({
  name,
  className,
  perChar,
}: {
  name: string;
  className?: string;
  /** Seconds of pen travel per character. See HandwrittenLine's `perChar`. */
  perChar?: number;
}) {
  return (
    <HandwrittenLine
      words={name.split(" ")}
      className={className}
      {...(perChar !== undefined ? { perChar } : {})}
    />
  );
}
