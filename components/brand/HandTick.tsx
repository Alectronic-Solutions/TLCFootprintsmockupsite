import { cn } from "@/lib/cn";

/**
 * The two marks on the clipboard sheet (components/programs/IncludedClipboard.tsx):
 * a hand-drawn tick for what the rate covers, an empty box for what it does not.
 *
 * Same house spec as ProgramIcon and HighlightIcon: 24x24 viewBox, 1.75 stroke,
 * round caps and joins, fill: none.
 *
 * Controlled rather than self-triggering: which lines are checked is driven by
 * the foot puzzle (components/programs/FootprintChecklist.tsx), not by scroll
 * position, so there is nothing here watching an IntersectionObserver - a tick
 * draws in the moment its piece is placed.
 *
 * Never `Math.random()` for the tilt - that would render one angle on the
 * server and a different one on the client hydration pass. `TILTS` is a fixed
 * sequence instead, indexed by list position, so the two always agree.
 */
const TILTS = [-4, 3, -2, 5, -3, 4] as const;

/** One tick's path length, hand-measured for the stroke-dasharray draw-on in globals.css. */
export const TICK_PATH_LENGTH = 26;

export function HandTick({
  index,
  checked,
  className,
}: {
  /** Position in the list, used to pick a stable hand-tilt. */
  index: number;
  /** Draws the tick in when true; erased otherwise. Starts false. */
  checked: boolean;
  className?: string;
}) {
  const tilt = TILTS[index % TILTS.length];
  return (
    <svg
      viewBox="0 0 24 24"
      data-checked={checked || undefined}
      className={cn("tick-draw block h-5 w-5 shrink-0 stroke-leaf-dark", className)}
      style={{ "--i": index, transform: `rotate(${tilt}deg)` } as React.CSSProperties}
      fill="none"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* A single stroke, not a checkmark built from two separate lines: a
          real hand ticking a box draws it in one motion, short leg then long
          leg, without lifting the pen. */}
      <path d="M4.5 12.5 L9.5 17.5 L20 5" pathLength={TICK_PATH_LENGTH} />
    </svg>
  );
}

/**
 * The "not included" mark: a plain box, never ticked - Lunch is never part of
 * the rate, so it never earns a checkmark. `placed` still gives it a visual
 * response to the matching puzzle piece: the border darkens from a dashed,
 * waiting-to-be-reviewed hairline to a solid one, which reads as "acknowledged"
 * without reading as "included."
 */
export function EmptyBox({ placed = false, className }: { placed?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "block h-5 w-5 shrink-0 transition-colors duration-300",
        placed ? "stroke-cocoa" : "stroke-cocoa-mid/60",
        className,
      )}
      fill="none"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={placed ? undefined : "2.5 2"}
      aria-hidden="true"
    >
      <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
    </svg>
  );
}
