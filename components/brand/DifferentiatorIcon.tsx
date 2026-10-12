import { STROKE } from "@/components/brand/iconStroke";
import { cn } from "@/lib/cn";

/**
 * Marks for the "A home, not a center" cards. Hearts are filled, matching
 * the solid pink hearts used across the site. No mark depicts a countable
 * number of children.
 */

/** The flyer heart, on its own 24x22 box. Place it with <Heart> below. */
const HEART_PATH =
  "M12 21 C 4 14.5, 1 11, 1 7.2 C 1 3.8, 3.6 1, 7 1 C 9.1 1, 10.9 2.1, 12 3.8 C 13.1 2.1, 14.9 1, 17 1 C 20.4 1, 23 3.8, 23 7.2 C 23 11, 20 14.5, 12 21 Z";

/** Places the flyer heart by its center, at a given width in canvas units. */
function Heart({ cx, cy, width }: { cx: number; cy: number; width: number }) {
  // The path's center is (12, 11) and it is 22 units wide.
  const s = width / 22;
  return (
    <g
      transform={`translate(${cx - 12 * s} ${cy - 11 * s}) scale(${s})`}
      className="fill-pink"
    >
      <path d={HEART_PATH} />
    </g>
  );
}

function Constant() {
  // One adult, with a heart at the chest.
  return (
    <>
      <circle cx="12" cy="6.3" r="3.1" className="stroke-leaf-dark" {...STROKE} />
      <path
        d="M4.9 20.6 C 4.9 16.4, 8.1 14.2, 12 14.2 C 15.9 14.2, 19.1 16.4, 19.1 20.6"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <Heart cx={12} cy={17.9} width={5} />
    </>
  );
}

function Home() {
  // A house with a heart inside. The roof overhangs so it doesn't read as an arrow.
  return (
    <>
      <path d="M3.2 10.8 L12 4 L20.8 10.8" className="stroke-leaf-dark" {...STROKE} />
      <path
        d="M5.7 9.2 V19.2 A1.8 1.8 0 0 0 7.5 21 H16.5 A1.8 1.8 0 0 0 18.3 19.2 V9.2"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <Heart cx={12} cy={14.6} width={6.6} />
    </>
  );
}

function Play() {
  // The logo's rainbow: three arcs, pink outermost.
  return (
    <>
      <path d="M2.8 18 A 9.2 9.2 0 0 1 21.2 18" className="stroke-pink" {...STROKE} />
      <path d="M5.9 18 A 6.1 6.1 0 0 1 18.1 18" className="stroke-amber-dark" {...STROKE} />
      <path d="M9 18 A 3 3 0 0 1 15 18" className="stroke-leaf-dark" {...STROKE} />
    </>
  );
}

export type DifferentiatorIconName = "constant" | "home" | "play";

const ICONS: Record<DifferentiatorIconName, () => React.JSX.Element> = {
  constant: Constant,
  home: Home,
  play: Play,
};

export function DifferentiatorIcon({
  name,
  className,
}: {
  name: DifferentiatorIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className={cn("block h-6 w-6", className)} aria-hidden="true">
      <Icon />
    </svg>
  );
}
