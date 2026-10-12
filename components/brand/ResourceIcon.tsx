import type { ArticleTopic } from "@/lib/mdx";
import { FootprintGlyph } from "@/components/brand/Footprints";
import { STROKE } from "@/components/brand/iconStroke";
import { cn } from "@/lib/cn";

/**
 * Topic marks for the resource cards. leaf-dark carries the structure and the
 * accent alternates amber / pink, matching the other brand icon sets.
 */

function Choosing() {
  // A magnifying glass over one of the logo's prints.
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

/** A coin stamped with a heart. Also used for the subsidy highlight. */
export function CostMark() {
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
  // The logo's print mid-step, with motion arcs either side.
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
  // A sun over the horizon: the rhythm of a day.
  return (
    <>
      <path d="M4.4 15.6a7.6 7.6 0 0 1 15.2 0" className="stroke-leaf-dark" {...STROKE} />
      <path d="M3.4 15.6h17.2" className="stroke-leaf-dark" {...STROKE} />
      <circle cx="12" cy="10.2" r="2.3" className="fill-amber" />
    </>
  );
}

function Health() {
  return (
    <>
      <path
        d="M12 20s-7-4.2-7-10.1A3.9 3.9 0 0 1 12 7.5 3.9 3.9 0 0 1 19 9.9C19 15.8 12 20 12 20Z"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <path d="M12 9v6M9 12h6" className="stroke-pink" {...STROKE} />
    </>
  );
}

function Family() {
  return (
    <>
      <rect x="5" y="4.5" width="14" height="15" rx="2" className="stroke-leaf-dark" {...STROKE} />
      <circle cx="9" cy="9" r="1.8" className="stroke-amber-dark" {...STROKE} />
      <path d="M6.8 14c.7-1.6 1.8-2.4 3.2-2.4s2.5.8 3.2 2.4M14.5 8h2M14.5 11h2M14.5 14h2" className="stroke-leaf-dark" {...STROKE} />
    </>
  );
}

const ICONS: Record<ArticleTopic, () => React.JSX.Element> = {
  choosing: Choosing,
  cost: CostMark,
  licensing: Licensing,
  starting: Starting,
  "day-to-day": DayToDay,
  health: Health,
  family: Family,
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
