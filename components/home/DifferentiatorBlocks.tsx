"use client";

import { Fragment, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { DifferentiatorIcon } from "@/components/brand/DifferentiatorIcon";
import { ToyBlock, EDGE_CLASS, type Differentiator } from "@/components/home/ToyBlock";
import { useBlockPhysics } from "@/components/home/useBlockPhysics";
import { cn } from "@/lib/cn";

export type { Differentiator };

/**
 * A pen of wooden blocks, with the three reasons written underneath it.
 *
 * The section is two halves that say the same thing in different registers.
 * The pen is a toy: real gravity, real stacking, and blocks that topple if you
 * pile them badly. The legend is the content: mark, title and sentence at full
 * reading size, in document order, never rotated.
 *
 * That split is what makes the toy affordable. The pen is aria-hidden and holds
 * no information the legend does not, so a screen reader, a crawler, a printed
 * page and a visitor with JavaScript off all get the same three reasons in the
 * same order however the blocks happen to be lying. Nothing about the section's
 * job depends on the simulation loading.
 */

/**
 * The two lines a legend title is set on, or one line if it was not given a
 * break. `titleBreakAfter` is a prefix of the title rather than a rewrite of
 * it, so a typo degrades to the natural wrap instead of quietly changing the
 * words on the page.
 */
function legendTitleLines(item: Differentiator): string[] {
  const head = item.titleBreakAfter;
  if (!head || !item.title.startsWith(head)) return [item.title];
  return [head, item.title.slice(head.length).trimStart()];
}

export function DifferentiatorBlocks({ items }: { items: Differentiator[] }) {
  const penRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLUListElement>(null);
  const blockRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduce = useReducedMotion();

  /* Reduced motion gets the toy, not a photograph of it. Grabbing a block is
     direct manipulation and stays; what goes is the motion nobody asked for -
     gravity and tumbling. See useBlockPhysics. Turning the whole thing off
     instead, which is what this did first, just leaves someone poking at blocks
     that never respond. */
  const inView = useInView(penRef, { once: true, margin: "200px" });
  const { disturbed, reset } = useBlockPhysics({
    penRef,
    floorRef,
    blockRefs,
    enabled: inView,
    calm: !!reduce,
  });

  return (
    <AnimatedSection className="mx-auto mt-8 max-w-5xl">
      {/* The pen is narrower than the legend under it. A playpen wants to look
          like a container you could reach into, and at the full 5xl the blocks
          were three small objects adrift in a lot of empty rug. */}
      {/* The pen is scenery. Everything it says is said again below, so it is
          hidden from assistive tech rather than read out as three stray
          headings in whatever order the blocks ended up in. */}
      <div ref={penRef} className="toy-pen mx-auto max-w-3xl" aria-hidden="true">
        <ul ref={floorRef} className="toy-pen-floor">
          {items.map((item, i) => (
            <ToyBlock
              key={item.title}
              item={item}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
            />
          ))}
        </ul>
      </div>

      {/* Rendered unconditionally, and true in both modes: without gravity the
          blocks stack more easily, not less. Making this depend on `reduce`
          meant the server and the client disagreed about the markup, which is a
          hydration mismatch for exactly the visitors it was meant to help. */}
      <div className="mx-auto mt-3 flex min-h-[2.5rem] max-w-3xl items-center gap-4">
        <p className="text-sm text-cocoa-mid">Pick up a block. Stack them if you can.</p>
        {disturbed && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto shrink-0 rounded-full border-hair border-cocoa/15 bg-cream px-4 py-2 text-sm font-semibold text-leaf-dark shadow-soft transition-colors hover:bg-leaf-light"
          >
            Tidy up
          </button>
        )}
      </div>

      {/* The content. Colour-keyed to the blocks so the pen still reads as
          being about these three things once they are in a heap.

          Centred at every width: the eyebrow, the heading, the lead and the
          pen above all sit on the same axis, and left-aligned entries
          underneath them broke that line. The phone used to keep the mark
          beside a left-aligned block; the mark now sits above centred text the
          way it does from sm up, so the column reads as one axis top to
          bottom. */}
      <ul className="mt-8 grid gap-7 sm:grid-cols-3 sm:gap-6">
        {items.map((item) => (
          <li key={item.title} className="text-center">
            <span
              aria-hidden="true"
              className={cn("toy-legend-mark mx-auto", EDGE_CLASS[item.edge])}
            >
              <DifferentiatorIcon name={item.icon} className="h-6 w-6" />
            </span>
            {/* The three entries sit side by side from sm up, so their titles
                and sentences have to start and finish on the same lines even
                though the copy is not the same length. Each title reserves two
                lines (1.30 line-height) and each sentence three (1.7), which
                is what the longest of each already takes, so the marks, the
                titles, the sentences and the bottom edge all agree across the
                row. Stacked on a phone the reservation is dropped: there is no
                neighbour to line up with, and it would only open gaps. */}
            <div className="mt-4">
              {/* The break is carried in the data, not left to the measure:
                  each of these titles wants a different split, and a width
                  narrow enough to break "A small group" puts "Play-based and
                  child-led" on three lines. It is dropped below sm, where the
                  entries are stacked and a title has no neighbour to match. */}
              <h3 className="text-h3 sm:min-h-[2.6em]">
                {legendTitleLines(item).map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br className="hidden sm:inline" />}
                    {i > 0 ? " " : null}
                    {line}
                  </Fragment>
                ))}
              </h3>
              <p className="mt-2 text-pretty text-cocoa-mid sm:min-h-[5.1em]">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </AnimatedSection>
  );
}
