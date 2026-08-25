import type { ProgramIconName } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * Age-group marks for the two rate tiers.
 *
 * Art direction: one stroke weight (1.75 at a 24px canvas), round caps and
 * joins, and geometry built from circles and arcs. Marks stay to two brand
 * colors, with the block stack the deliberate exception - see below.
 *
 * The two marks read apart at a glance: the bottle is a single-color pink
 * object, the blocks a three-color stack, so a parent can tell the two cards
 * apart before reading either name. Every other mark on the site is leaf with
 * a pink accent; this pair is the one place that distinction does real work.
 */

const STROKE = {
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Infant() {
  // A bottle, with the graduations up its side.
  //
  // This was a crescent moon and two stars, and that was the prettier
  // drawing - but a crescent is the standing symbol for night and overnight
  // care, and this home closes at 6:00 PM on weekdays. The mark was quietly
  // advertising a service that does not exist. It was also the only mark in
  // the set whose meaning depended on a time of day.
  //
  // The three ticks are the whole mark. A tapered teat over a rounded body is
  // the Elmer's glue bottle almost exactly, and every version drawn without
  // the graduations read as glue - the ticks are the one detail a glue bottle
  // never has. They stay at three: two read as an equals sign at 36px.
  //
  // A pacifier and a rattle were drawn first. The pacifier's ring over a wide
  // shield read as a lollipop, and so did the rattle, which is the failure
  // mode of every circle sitting on a short handle at this size.
  return (
    <>
      <path
        d="M9.9 7C9.9 4.1 10.9 2.5 12 2.5s2.1 1.6 2.1 4.5"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <rect x="8.8" y="7" width="6.4" height="2.7" rx="0.8" className="stroke-pink" {...STROKE} />
      <rect x="6.3" y="9.7" width="11.4" height="11.6" rx="2.6" className="stroke-pink" {...STROKE} />
      <path d="M8.6 13.4h2.6M8.6 15.7h2.6M8.6 18h2.6" className="stroke-pink" {...STROKE} />
    </>
  );
}

function Toddler() {
  // Stacking blocks: the whole-body, hands-on way children this age learn.
  //
  // Pulled in from 20.2 to 16.6 across. Three outlined squares spread over the
  // full canvas outweigh any single object drawn beside them, and the bottle
  // cannot answer by getting wider without ceasing to look like a bottle. The
  // two marks are matched on ink, not on bounding box.
  //
  // Three blocks, three logo colors, stacked in the rainbow's own order: pink
  // over amber and leaf, the way the arcs run outside in. This is the one mark
  // in the set that carries all three, and it can afford to - a set of toy
  // blocks is the one object where being three different colors is the point.
  // Amber is the -dark step: plain amber is a 1.75 stroke disappearing into a
  // white card.
  return (
    <>
      <rect x="3.7" y="13.2" width="7.8" height="7.8" rx="1.8" className="stroke-leaf-dark" {...STROKE} />
      <rect x="12.5" y="13.2" width="7.8" height="7.8" rx="1.8" className="stroke-amber-dark" {...STROKE} />
      <rect x="8.1" y="3.2" width="7.8" height="7.8" rx="1.8" className="stroke-pink" {...STROKE} />
    </>
  );
}

const ICONS: Record<ProgramIconName, () => React.JSX.Element> = {
  infant: Infant,
  toddler: Toddler,
};

export function ProgramIcon({
  name,
  className,
}: {
  name: ProgramIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className={cn("block h-6 w-6", className)} aria-hidden="true">
      <Icon />
    </svg>
  );
}
