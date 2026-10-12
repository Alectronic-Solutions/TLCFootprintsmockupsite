import type { ProgramIconName } from "@/lib/constants";
import { STROKE } from "@/components/brand/iconStroke";
import { cn } from "@/lib/cn";

/**
 * Age-group marks for the two rate tiers. The bottle is single-color and the
 * blocks are three-color, so the two cards read apart at a glance.
 */

function Infant() {
  // A bottle. The graduation ticks keep it from reading as a glue bottle.
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
  // Stacking blocks in the rainbow's order: pink over amber and leaf.
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
