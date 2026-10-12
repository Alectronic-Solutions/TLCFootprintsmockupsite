import { CostMark } from "@/components/brand/ResourceIcon";
import { STROKE } from "@/components/brand/iconStroke";
import { cn } from "@/lib/cn";

/** The four marks in the "Good to know" bar, drawn in the shared stroke style. */
export type HighlightIconName = "hours" | "openings" | "meals" | "subsidy";

function Hours() {
  return (
    <>
      <circle cx="12" cy="12" r="8.4" className="stroke-leaf-dark" {...STROKE} />
      <path d="M12 7.6V12l2.9 1.8" className="stroke-pink" {...STROKE} />
    </>
  );
}

function Openings() {
  // A door standing ajar, so it doesn't repeat the house mark used elsewhere.
  return (
    <>
      <path d="M5.5 20.5V4.8c0-.7.5-1.3 1.3-1.3h10.4c.8 0 1.3.6 1.3 1.3v15.7" className="stroke-leaf-dark" {...STROKE} />
      <path d="M3.5 20.5h17" className="stroke-leaf-dark" {...STROKE} />
      <path d="M9.2 5.6v14.9l4.6-1.6V7.2Z" className="stroke-leaf-dark" {...STROKE} />
      <circle cx="12.2" cy="13.4" r="0.9" className="fill-amber-dark" />
    </>
  );
}

function Meals() {
  return (
    <>
      <path d="M9.4 7.6c.8-1-.6-1.9.2-3M14.2 7.6c.8-1-.6-1.9.2-3" className="stroke-amber-dark" {...STROKE} />
      <path d="M3.5 11h17" className="stroke-leaf-dark" {...STROKE} />
      <path d="M4.4 11c.6 4.6 3.6 7.6 7.6 7.6s7-3 7.6-7.6" className="stroke-leaf-dark" {...STROKE} />
      <path d="M9 20.5h6" className="stroke-leaf-dark" {...STROKE} />
    </>
  );
}

const ICONS: Record<HighlightIconName, () => React.JSX.Element> = {
  hours: Hours,
  openings: Openings,
  meals: Meals,
  subsidy: CostMark,
};

export function HighlightIcon({
  name,
  className,
}: {
  name: HighlightIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className={cn("block h-6 w-6", className)} aria-hidden="true">
      <Icon />
    </svg>
  );
}
