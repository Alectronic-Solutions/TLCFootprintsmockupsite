import { FootprintGlyph } from "@/components/brand/Footprints";
import { cn } from "@/lib/cn";

/**
 * The four marks in the "good to know" bar under the hero.
 *
 * Same art direction as ProgramIcon, because they are the same system: one
 * stroke weight (1.75 at a 24px canvas), round caps and joins, geometry built
 * from circles and arcs, and never more than two brand colors in a mark.
 * leaf-dark carries the structure in all four and the accent alternates
 * amber / pink down the row, so the bar reads as a set rather than as four
 * icons that happen to be next to each other.
 *
 * None of these are the literal glyph a stock icon set would give (a clock, a
 * baby, an apple, a stack of coins). A clock face at 24px is four hairlines
 * and a circle, and it looks like every other website. These say the same
 * things in the logo's own vocabulary: the arc, the dot, the heart.
 */

export type HighlightIconName = "hours" | "openings" | "meals" | "subsidy";

const STROKE = {
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Hours() {
  // A clock, and deliberately the plainest mark in the set.
  //
  // Three concepts were drawn and rejected before this one: a sun over the
  // day's arc, the logo's arc with a bead riding it, and a rayed sun. Each was
  // prettier in isolation and none of them said "hours" - the disc-over-arc
  // versions read as the avatar glyph, and the arc read as a croquet hoop. The
  // bar exists to be scanned in about a second, so the mark that is instantly
  // a clock beats the mark that is interesting.
  //
  // The 10:10 pose every stock icon set uses was drawn too: inside a ring, two
  // hands in a V read as a check mark. These sit at a quarter past instead.
  return (
    <>
      <circle
        cx="12"
        cy="12"
        r="8.4"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <path d="M12 7.2V12l3.4 2" className="stroke-pink" {...STROKE} />
    </>
  );
}

function Openings() {
  // An open doorway with one of the logo's own prints standing inside it.
  //
  // This slot used to hold three climbing footprints for "Birth to 5 years".
  // The age range is now stated once in the hero and once in the FAQ, and the
  // bar carries the enrolling status instead, so the mark had to change with
  // the fact rather than be re-pointed at it.
  //
  // The floor line is load-bearing, the same way the table line is under the
  // bowl: an arch on its own is a window, or the top of the logo's own arc.
  // With a floor and something standing on it, it is a door you can walk in.
  //
  // The print is placed the way Ages placed its three, and the arithmetic is
  // the same: transforms read right to left, and the glyph's box is 24.6 x 36.6
  // about its own centre at (20.96, 28.46) - so it does not start at the
  // origin, and `translate` has to account for that. At .21 the print is
  // 5.2 x 7.7 here, centred in the opening and standing on the floor line.
  //
  // Amber, so the accent still alternates down the row: pink, amber, amber,
  // pink. One brand colour beside leaf-dark, which is the rule the three marks
  // around it keep and the old three-print mark was the sole exception to.
  return (
    <>
      <path
        d="M6.4 20.6V11.2a5.6 5.6 0 0 1 11.2 0v9.4"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <path d="M3.8 20.6h16.4" className="stroke-leaf-dark" {...STROKE} />
      <g className="fill-amber" transform="translate(7.6 10.48) scale(.21)">
        <FootprintGlyph />
      </g>
    </>
  );
}

function Meals() {
  // A bowl with the steam still coming off it, standing on a table line.
  //
  // The table line is load-bearing. Without it a rim over a shallow arc with
  // two short curls above is a smiley face, which is what the first draft was,
  // and this row already has a heart in it. The two curls also rise to
  // different heights for the same reason: matched pairs read as eyes.
  return (
    <>
      <path
        d="M3.6 12.4H20.4A8.6 8.6 0 0 1 3.6 12.4Z"
        className="stroke-leaf-dark"
        {...STROKE}
      />
      <path d="M9.2 20.8h5.6" className="stroke-leaf-dark" {...STROKE} />
      <path
        d="M9.4 10.8c1.2-1.5-1.2-3 0-4.5M14.2 10.8c1.2-1.3-1.2-2.6 0-3.9"
        className="stroke-amber-dark"
        {...STROKE}
      />
    </>
  );
}

function Subsidy() {
  // A heart held between two open hands: help offered, not charity dispensed.
  // The same gesture the hero's branches make around the headline.
  //
  // Two separate hands rather than one cradling arc. A single arc under a
  // heart is a mouth under a nose, and a cradle drawn as one curve was
  // indistinguishable from the bowl two items to its left.
  //
  // The heart is filled rather than stroked, breaking the set's own rule on
  // purpose. It is the one shape LaTrell's own flyers use, and it is filled
  // everywhere else on the site - HeartDots, the cut-out in the footprints -
  // so an outlined one here would read as a different heart.
  return (
    <>
      <path
        d="M12 15.2C8.6 12.5 6.9 11 6.9 9.1 6.9 7.7 8 6.6 9.4 6.6c1 0 2 .6 2.6 1.5C12.6 7.2 13.6 6.6 14.6 6.6 16 6.6 17.1 7.7 17.1 9.1c0 1.9-1.7 3.4-5.1 6.1Z"
        className="fill-pink"
      />
      <path
        d="M4.4 11.6c-.9 3.4 1.1 6.9 4.5 7.8M19.6 11.6c.9 3.4-1.1 6.9-4.5 7.8"
        className="stroke-leaf-dark"
        {...STROKE}
      />
    </>
  );
}

const ICONS: Record<HighlightIconName, () => React.JSX.Element> = {
  hours: Hours,
  openings: Openings,
  meals: Meals,
  subsidy: Subsidy,
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
    <svg
      viewBox="0 0 24 24"
      className={cn("block h-6 w-6", className)}
      aria-hidden="true"
    >
      <Icon />
    </svg>
  );
}
