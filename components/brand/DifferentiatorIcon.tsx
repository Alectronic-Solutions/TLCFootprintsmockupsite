import { cn } from "@/lib/cn";

/**
 * The three marks for the "A home, not a center" cards.
 *
 * Art direction is inherited from ProgramIcon: one stroke weight (1.75 at a
 * 24px canvas), round caps and joins, geometry built from circles and arcs.
 * Marks stay to two brand colors, with the rainbow the deliberate exception -
 * the same licence the block stack takes over there.
 *
 * The hearts are the flyer heart from HeartDots, reused verbatim and scaled,
 * rather than a second heart drawn for this set. They are *filled* where
 * everything else here is stroked: a heart outlined at 1.75 on a 9px canvas
 * fills in and reads as a blob, and the site's hearts are solid pink
 * everywhere else besides.
 *
 * One constraint, from the same rule that governs HighlightsBar: no mark may
 * depict a countable number of children. The brief gives no capacity and no
 * ratio, so "A small group" gets a house - three little figures would be a
 * capacity claim drawn in SVG.
 */

const STROKE = {
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** The flyer heart, on its own 24x22 box. Place it with <Heart> below. */
const HEART_PATH =
  "M12 21 C 4 14.5, 1 11, 1 7.2 C 1 3.8, 3.6 1, 7 1 C 9.1 1, 10.9 2.1, 12 3.8 C 13.1 2.1, 14.9 1, 17 1 C 20.4 1, 23 3.8, 23 7.2 C 23 11, 20 14.5, 12 21 Z";

/** Places the flyer heart by its center, at a given width in canvas units. */
function Heart({ cx, cy, width }: { cx: number; cy: number; width: number }) {
  // The path spans x 1..23 and y 1..21, so its own center sits at (12, 11) and
  // the scale factor is the target width over the path's 22-unit width.
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
  // One adult, with a heart where the chest is.
  //
  // The card's own first three words are "One provider, all day", so a single
  // figure is the literal claim and not an invented one. The heart is what
  // separates it from an account avatar.
  //
  // This was a heart cradled in two cupped hands, which was the better idea
  // and the worse drawing: at 32px a wide arc under a heart is a smile under a
  // nose, and every version of it read as a face before it read as hands.
  //
  // The heart sits inside the shoulders rather than beside the head, which
  // also rhymes with the house next to it - two containers, each with a heart
  // in it, then the rainbow. The set reads as a set.
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
  // A house with a heart inside it.
  //
  // The most literal mark in the set, and the section heading is "A home, not
  // a center" - this is the one place on the site where being obvious is the
  // point. It also carries the whole silhouette: a pitched roof is legible at
  // 20px in a way that nothing else in this set is, so it anchors the row.
  //
  // The roof overhangs the walls on both sides. Flush, the mark reads as an
  // arrow sitting on a box.
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
  // The logo's own rainbow: three arcs, pink outermost, in RainbowArc's order.
  //
  // This is the one mark in the set carrying all three brand colors, and it
  // can afford to - it *is* the logo mark, scaled down, and a rainbow is the
  // one object where being three different colors is the whole idea.
  //
  // No ground line under the arcs. Their flat feet already sit on a common
  // baseline, and a drawn rule under them pulled the mark toward a bar chart.
  //
  // Radii are spaced 3.1 apart rather than evenly filling the canvas: at 1.75
  // stroke that leaves 1.35 of clear cream between neighbours, which is what
  // keeps three arcs from merging into one thick band at 32px.
  //
  // Amber is the -dark step here for the same reason it is in ProgramIcon:
  // plain amber at a 1.75 stroke vanishes into the medallion's white top.
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
