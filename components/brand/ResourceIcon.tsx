import type { ArticleTopic } from "@/lib/mdx";
import { FootprintGlyph } from "@/components/brand/Footprints";
import { cn } from "@/lib/cn";

/**
 * The five marks on the resource card icon badges.
 *
 * Same system as HighlightIcon and ProgramIcon: one stroke weight (1.75 at a
 * 24px canvas), round caps and joins, geometry built from circles and arcs,
 * never more than two brand colors in a mark. leaf-dark carries the structure
 * in all five and the accent alternates amber / pink down the set, the same
 * rotation HighlightIcon uses, so the five read as one family rather than as
 * icons picked from different sets.
 */

const STROKE = {
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Choosing() {
  // A magnifying glass over one of the logo's own prints: looking closely at
  // a place, not a generic search icon.
  return (
    <>
      <circle cx="10.4" cy="10.4" r="6.8" className="stroke-leaf-dark" {...STROKE} />
      <path d="M15.3 15.3 20.4 20.4" className="stroke-pink" {...STROKE} />
      <g className="fill-amber" transform="translate(7.1 6.9) scale(.135)">
        <FootprintGlyph />
      </g>
    </>
  );
}

function Cost() {
  // A coin stamped with a heart, the way HighlightIcon's Subsidy mark keeps
  // the heart as the site's one filled shape.
  return (
    <>
      <circle cx="12" cy="12" r="8.4" className="stroke-leaf-dark" {...STROKE} />
      <path
        d="M12 15C10 13.3 8.8 12.2 8.8 10.8c0-1 .8-1.8 1.8-1.8.7 0 1.3.4 1.4.9.1-.5.7-.9 1.4-.9 1 0 1.8.8 1.8 1.8 0 1.4-1.2 2.5-3.2 4.2Z"
        className="fill-pink"
      />
    </>
  );
}

function Licensing() {
  // A shield with a checkmark, the plainest read for "verified".
  return (
    <>
      <path
        d="M12 4 5.5 6.4v5c0 4.4 2.8 7.2 6.5 8.6 3.7-1.4 6.5-4.2 6.5-8.6v-5Z"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <path d="M8.8 12.2 11 14.4l4.2-4.8" className="stroke-amber-dark" {...STROKE} />
    </>
  );
}

function Starting() {
  // The logo's print mid-step, a small motion arc trailing behind it: a
  // first day, not an abstract compass or flag.
  return (
    <>
      <path
        d="M4.4 17.4c2.4-1.4 3.6-3.2 3.6-5.4"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <g className="fill-pink" transform="translate(9.4 4.6) scale(.3)">
        <FootprintGlyph />
      </g>
      <path d="M15.6 8.8c1.8 1 2.8 2.6 2.8 4.6 0 2.6-1.8 4.6-4.4 5.4" className="stroke-amber-dark" {...STROKE} />
    </>
  );
}

function DayToDay() {
  // The sun-over-arc HighlightIcon's own comment rejected for Hours, reused
  // here on purpose: it reads as a day's rhythm, which is exactly what this
  // topic covers, and the two marks never sit in the same list.
  return (
    <>
      <path d="M4.4 15.6a7.6 7.6 0 0 1 15.2 0" className="stroke-leaf-dark" {...STROKE} />
      <path d="M3.4 15.6h17.2" className="stroke-leaf-dark" {...STROKE} />
      <circle cx="12" cy="10.2" r="2.3" className="fill-amber" />
    </>
  );
}

const ICONS: Record<ArticleTopic, () => React.JSX.Element> = {
  choosing: Choosing,
  cost: Cost,
  licensing: Licensing,
  starting: Starting,
  "day-to-day": DayToDay,
};

export function ResourceIcon({
  topic,
  className,
}: {
  topic: ArticleTopic;
  className?: string;
}) {
  const Icon = ICONS[topic];
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("block h-6 w-6", className)}
      aria-hidden="true"
    >
      <Icon />
    </svg>
  );
}
