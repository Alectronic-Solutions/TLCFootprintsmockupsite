"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * Native details/summary would be simpler, but this gives us the animated
 * chevron and consistent focus styling without fighting browser defaults.
 *
 * The panel opens by animating a grid track from 0fr to 1fr rather than by
 * toggling `hidden`, so the card grows into place instead of snapping. The
 * inner wrapper keeps `min-h-0`, without which the track refuses to collapse.
 */
export function Accordion({
  items,
  headingLevel: Heading = "h2",
  align = "start",
}: {
  items: AccordionItem[];
  /** Set to h3 when the accordion already sits under a section h2. */
  headingLevel?: "h2" | "h3";
  /**
   * "center" is for the home preview, where the whole run of the section is
   * centred. Long-form FAQ pages stay on "start": a dozen centred answers is
   * harder to read down than it is pretty.
   */
  align?: "start" | "center";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const centered = align === "center";

  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li
            key={item.q}
            className={cn(
              "overflow-hidden rounded-2xl border-hair transition-colors duration-200",
              isOpen
                ? "border-cocoa/15 bg-white shadow-soft"
                : "border-cocoa/10 bg-transparent hover:bg-white/60",
            )}
          >
            <Heading>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                // px-5 rather than px-6 on phones: at 360px the question needs
                // every pixel it can get before it wraps to three lines.
                //
                // Centred mode is a three-column grid with a spacer the width
                // of the chevron on the left, so the question is centred
                // against the card and not against the space left over beside
                // the chevron.
                className={cn(
                  "w-full px-5 py-4 sm:px-6 sm:py-5",
                  centered
                    ? "grid grid-cols-[2rem_1fr_2rem] items-center gap-3 text-center"
                    : "flex items-center justify-between gap-4 text-left",
                )}
              >
                {centered ? <span aria-hidden="true" /> : null}
                <span
                  className={cn(
                    "font-display text-[1.15rem] font-semibold leading-snug text-cocoa sm:text-h3",
                    centered && "text-balance",
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                    isOpen
                      ? "rotate-180 bg-leaf-dark text-cream"
                      : "bg-cream-deep text-leaf-dark",
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </Heading>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-button-${i}`}
              // Answers are plain prose with nothing focusable in them, so
              // aria-hidden is enough to keep a collapsed panel out of the
              // accessibility tree; no focus can be stranded inside it.
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300",
                "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-5 pb-5 sm:px-6">
                  {/* The rule ties the answer to its question without a full
                      divider, which at this radius would read as a seam. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mb-4 block h-px w-10 rounded-full bg-leaf-dark/30",
                      centered && "mx-auto",
                    )}
                  />
                  <p
                    className={cn(
                      "max-w-measure",
                      centered && "mx-auto text-pretty text-center",
                    )}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
