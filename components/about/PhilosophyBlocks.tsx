"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useBlockPhysics } from "@/components/home/useBlockPhysics";
import { cn } from "@/lib/cn";

/**
 * A two-block version of the home page's physics pen (DifferentiatorBlocks,
 * useBlockPhysics), sized for one card rather than a full section.
 *
 * Lives inside the "Children learn by playing" philosophy card, whose own
 * sentence is "A child stacking blocks is working on balance, planning,
 * patience, and what happens when the tower falls." - this is the toy that
 * lets a parent try that instead of just reading it. useBlockPhysics is
 * generic over whatever is in blockRefs / floorRef, so this reuses the exact
 * same hook and cube skin (.toy-block, .toy-block--*), with a `.toy-pen--mini`
 * CSS variant (globals.css) sized for a card rather than a section.
 *
 * The pen is aria-hidden for the same reason DifferentiatorBlocks' is: it says
 * nothing the card's own heading and body do not already say in document
 * order, so a screen reader, a crawler, and JS-off all get the same sentence
 * without a stray toy in the middle of it. The tidy-up button below it is not
 * hidden - it is a real control, and hiding an interactive element is worse
 * than exposing one. It carries its own context in its accessible name,
 * because the blocks it refers to are the part that is hidden.
 */

/**
 * How long a block that has been flung out of the pen stays gone before it
 * fades back in. Long enough that the throw itself reads as the outcome -
 * snapping it back would undo the thing the visitor just did - and short
 * enough that a two-block pen is never left looking broken and empty.
 */
const RECOVER_MS = 10_000;

const BLOCKS = [
  { tone: "leaf" as const },
  { tone: "pink" as const },
];

export function PhilosophyBlocks({ className }: { className?: string }) {
  const penRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLUListElement>(null);
  const blockRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduce = useReducedMotion();

  const inView = useInView(penRef, { once: true, margin: "160px" });
  const { disturbed, reset } = useBlockPhysics({
    penRef,
    floorRef,
    blockRefs,
    enabled: inView,
    calm: !!reduce,
    /* This pen holds two blocks in a card. Lose one to a hard drag and half
       the toy is missing, so it also puts itself back on its own after a
       while - the button is the way to not wait. See `recoverAfterMs` in
       useBlockPhysics. */
    recoverAfterMs: RECOVER_MS,
  });

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div ref={penRef} className="toy-pen toy-pen--mini" aria-hidden="true">
        <ul ref={floorRef} className="toy-pen-floor">
          {BLOCKS.map((b, i) => (
            <li
              key={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              className={`toy-block toy-block--${b.tone}`}
            />
          ))}
        </ul>
      </div>

      {/* The slot is always in the layout, the button only sometimes. These
          cards sit in a grid row sized by its tallest member, so letting the
          button add its own height on first drag would shove the neighbouring
          card and everything below it down mid-play. Same reservation the
          sibling card makes for its status line (.tictac-status).

          The height is the button's own, measured rather than guessed:
          19.5px line box + 2 x 6px padding + 2 x 1px border = 33.5px. A round
          2rem was 1.5px short, which is small enough to look like a rendering
          artefact and still be a jump. */}
      <div className="mt-2 flex min-h-[33.5px] items-center">
        {disturbed && (
          <button
            type="button"
            onClick={reset}
            /* Deliberately the same control as the home pen's, one size down:
               a visitor who has met it there should recognise it here. */
            className="rounded-full border-hair border-cocoa/15 bg-cream px-3 py-1.5 text-xs font-semibold text-leaf-dark shadow-soft transition-colors hover:bg-leaf-light"
            /* The visible word stays the leading text of the accessible name,
               so speech input still matches what is on screen. */
            aria-label="Tidy up the blocks"
          >
            Tidy up
          </button>
        )}
      </div>
    </div>
  );
}
