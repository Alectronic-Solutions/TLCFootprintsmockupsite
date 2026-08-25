import { cn } from "@/lib/cn";

/**
 * The heart-cut baby footprint pair from the logo.
 *
 * Always a pink/leaf pair: never recolored outside the palette (see the
 * illustration rules in the plan). Each print is a sole plus five toes, with a
 * heart cut out of the sole, matching the mark.
 */

interface PrintProps {
  className?: string;
}

/**
 * A single print. Bounding box is roughly x 8.7-33.3, y 10.1-46.7, centre
 * (21, 28.5). Callers mirror about that centre so a pair stays identical.
 *
 * Drawn from an anatomical footprint, then rounded off. What carries the read
 * is the arch, and the arch is almost entirely a MEDIAL event: the lateral
 * (little-toe) edge is one long, softly convex sweep from ball to heel, barely
 * moving inward, while the medial edge bulges at the ball, scoops in at the
 * midfoot, and swings back out into a rounded heel. Narrowing both edges evenly
 * instead - which is the intuitive thing to do - produces a peanut, not a foot.
 *
 * How deep that scoop goes is the whole difference between a footprint and a
 * kidney bean. Ball ~21.7, midfoot ~16, heel ~15: gentle enough that the
 * silhouette stays plump and soft, which is what a baby's print looks like. The
 * curve through the points is fitted loosely (tension 0.25) for the same
 * reason - a tighter fit makes the outline read as faceted at hero size.
 *
 * Because the midfoot is pinched, the heart cannot sit there; it lives in the
 * ball, which is the one part of the sole with room for it.
 *
 * The toes descend gently from the big toe outward so the little toe is still a
 * toe, riding an arc that starts low on the big-toe side, peaks over the second
 * and third, and falls away to the little one. The big toe stands apart from
 * the other four; the four are spaced only enough to keep a visible gap at
 * favicon size.
 *
 * The outline was generated as a closed curve through twenty-seven boundary
 * points rather than drawn by hand, which is why the segments are uniform:
 * adjust the silhouette by moving a point and re-fitting, not by nudging a
 * control point.
 *
 * Exported as the bare <g> for callers composing the print into a canvas of
 * their own - see HighlightIcon, which places three prints at three scales.
 * The <Footprint> wrapper below cannot do that: it fixes its own viewBox.
 */
export function FootprintGlyph() {
  return (
    <g>
      {/* Sole, with the heart cut out via fill-rule */}
      <path
        d="M 9.6 26
           C 9.2 24.8, 9.6 24.4, 9.9 23.1
           C 10.3 21.8, 10.2 21.8, 11 20.9
           C 11.8 19.9, 11.9 19.9, 13.2 19.3
           C 14.5 18.7, 14.6 18.6, 16.2 18.3
           C 17.8 18, 17.9 18, 19.5 18.1
           C 21.1 18.2, 21.2 18.2, 22.8 18.7
           C 24.4 19.2, 24.5 19.2, 25.9 20
           C 27.3 20.8, 27.4 20.9, 28.5 22
           C 29.6 23.1, 29.7 23.2, 30.4 24.6
           C 31.1 26, 31.1 26.1, 31.3 27.6
           C 31.5 29.1, 31.4 29.1, 31.3 30.6
           C 31.2 32.1, 31.2 32.2, 31 33.6
           C 30.8 35, 30.9 35, 30.6 36.4
           C 30.4 37.8, 30.4 37.8, 30 39.2
           C 29.6 40.6, 29.6 40.6, 29 41.9
           C 28.4 43.2, 28.5 43.3, 27.4 44.4
           C 26.3 45.5, 26.3 45.6, 24.7 46.2
           C 23.1 46.8, 22.9 46.8, 21.2 46.8
           C 19.4 46.8, 19.2 46.8, 17.7 46.2
           C 16.2 45.6, 16.1 45.4, 15.1 44.3
           C 14.1 43.1, 14.2 43, 13.8 41.6
           C 13.4 40.2, 13.4 40.2, 13.6 38.8
           C 13.8 37.4, 14.2 37.3, 14.5 35.9
           C 14.8 34.5, 15.1 34.5, 14.8 33
           C 14.5 31.6, 14.3 31.4, 13.4 30.1
           C 12.6 28.8, 12.4 28.9, 11.4 27.9
           C 10.4 26.9, 10 27.2, 9.6 26 Z
           M 20.8 33.6
           C 23.4 30.6, 25.5 28.6, 25.5 26.3
           C 25.5 24.5, 24.4 23.2, 22.9 23.2
           C 22.1 23.2, 21.3 23.6, 20.8 24.3
           C 20.3 23.6, 19.5 23.2, 18.7 23.2
           C 17.2 23.2, 16.1 24.5, 16.1 26.3
           C 16.1 28.6, 18.2 30.6, 20.8 33.6 Z"
        fillRule="evenodd"
      />
      {/* Toes. The big toe sits apart from the other four, which cluster -
          that gap is the single strongest cue that this is a foot and not a
          row of dots, and closing it costs the read even when every other
          proportion is right. */}
      <ellipse
        cx="11.9"
        cy="15.0"
        rx="3.1"
        ry="3.8"
        transform="rotate(-26 11.9 15.0)"
      />
      <ellipse
        cx="18.8"
        cy="13.0"
        rx="2.4"
        ry="2.85"
        transform="rotate(-6 18.8 13.0)"
      />
      <ellipse
        cx="23.9"
        cy="12.8"
        rx="2.2"
        ry="2.6"
        transform="rotate(8 23.9 12.8)"
      />
      <ellipse
        cx="28.2"
        cy="14.7"
        rx="2.0"
        ry="2.35"
        transform="rotate(20 28.2 14.7)"
      />
      <ellipse
        cx="31.4"
        cy="18.0"
        rx="1.8"
        ry="2.1"
        transform="rotate(32 31.4 18.0)"
      />
    </g>
  );
}

/**
 * The pair as a bare <g>, on the same canvas as a single print: leaf on the
 * left, pink on the right, each turned 8deg out from centre. Bounding box is
 * roughly x 7.7-72.3, y 10-46.8, so its centre is (40, 28.4).
 *
 * This is the group that sits inside the rainbow. It is exported so the mark
 * (Logo) and the arch (RainbowArc) place *the same* prints rather than two
 * copies that can drift apart - the pair reads as the logo everywhere it
 * appears, so there is only ever one of it.
 */
export function FootprintPairGlyph() {
  return (
    <g>
      <g
        className="fill-leaf"
        transform="rotate(-8 21 26) translate(42,0) scale(-1,1)"
      >
        <FootprintGlyph />
      </g>
      <g className="fill-pink" transform="translate(38,0) rotate(8 21 26)">
        <FootprintGlyph />
      </g>
    </g>
  );
}

/**
 * Where the pair sits inside a rainbow whose feet stand on y = 0: centred, and
 * filling the opening under the green arc.
 *
 * The prints are as large as the opening will take. What sets the ceiling is
 * not the soles but the two outer pinky toes, which are the widest *and* the
 * highest points of the pair, so they run into the green band long before
 * anything else does - at this scale they clear its inner edge by about a
 * fifth of a unit. Growing the pair therefore means dropping it as well, which
 * is why the heels finish level with the arcs' own feet rather than floating
 * above the baseline.
 *
 * Shared by the mark and the arch so both nest the prints identically. The
 * caller supplies its own baseline, since the two svgs differ by a unit in
 * where they stand their arcs.
 */
export const PAIR_IN_ARCH = { x: 34.37, dy: -19.65, scale: 0.516 } as const;

/**
 * The pair, as it appears inside the logo's rainbow.
 *
 * The viewBox is fitted to the glyph's own box with about a unit of air. It is
 * not a round number and should not be rounded to one: slack here shrinks the
 * print inside every caller that sizes by height, which is all of them.
 */
export function Footprints({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="6.7 9 66.7 38.8"
      className={cn("block", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <FootprintPairGlyph />
    </svg>
  );
}

/** A single print, used as a list bullet and in the hero trail. */
export function Footprint({
  className,
  left = false,
  style,
}: PrintProps & { left?: boolean; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="7.7 9.1 26.6 38.6"
      className={cn("block", className)}
      style={style}
      aria-hidden="true"
    >
      <g transform={left ? "translate(42,0) scale(-1,1)" : undefined}>
        <FootprintGlyph />
      </g>
    </svg>
  );
}
