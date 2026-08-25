"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * The watercolor botanicals from LaTrell's flyer.
 *
 * The flyer's branches are not line art: they are painted. Three things make
 * that difference, and all three are reproduced here rather than shipped as a
 * raster asset, which would cost a download and could not be recolored or
 * animated:
 *
 *   1. Broad, round-tipped leaves - closer to eucalyptus than to the pointed
 *      slivers of a line-art sprig. Width is what reads as paint.
 *   2. Two-tone fills. Every leaf carries a diagonal gradient from a light
 *      edge to a deep core, plus a lighter pool inside it where the pigment
 *      settled. A flat green leaf reads as a vector icon whatever its shape.
 *   3. Hearts tucked in among the leaves, the way they are scattered across
 *      the flyer. They are the motif that ties the plants to the mark.
 *
 * Two variants:
 *
 *   sprig  the small branch that enters from a page edge. Replaces the older
 *          line-art sprig everywhere, so the whole site shares one hand.
 *   arch   a long C-curve arm, dense with leaves and ending in a cluster.
 *          Anchored in a corner it sweeps inward, which is what the hero uses
 *          for the pair of branches that reach around the copy.
 *
 * Motion is layered as before: the whole branch pivots at its own anchor
 * (`.sprig-sway`, with the pivot passed per variant since the two viewBoxes
 * anchor at opposite corners), and each leaf flutters on its own clock
 * (`.leaf-sway`). Layout transforms are SVG attributes on outer <g>s and
 * motion transforms are CSS on inner ones, because CSS silently beats the
 * presentation attribute and the two can never share an element.
 */

type Tone = "light" | "mid" | "deep" | "blush";

interface LeafSpec {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  tone?: Tone;
  delay?: number;
  duration?: number;
}

interface AccentSpec {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  delay?: number;
}

export type BranchVariant = "sprig" | "arch";

interface WatercolorBranchProps {
  className?: string;
  variant?: BranchVariant;
  /** Mirrors the branch so a facing pair reads as two different plants. */
  flip?: boolean;
  /**
   * Mirrors vertically, which moves the stem base from the bottom of the
   * viewBox to the top so the leafy tip hangs down instead of reaching up.
   * This has to be an SVG transform rather than a `scale-y-[-1]` utility at
   * the call site: ScrollSprig writes an inline `transform` for its scroll
   * animation, and that silently beats any Tailwind transform class.
   */
  flipY?: boolean;
  /** Drops the hearts and berries for a quieter placement. */
  leavesOnly?: boolean;
  /**
   * Multiplies every animation duration. Above 1 the branch is sleepier, which
   * is what you want when several are visible at once and matching rhythms
   * would give the trick away.
   */
  windScale?: number;
  /** Freezes the sway. For dense pages where a third moving thing is noise. */
  still?: boolean;
}

/**
 * Two leaf cuts, and every branch alternates between them.
 *
 * `pointed` is the eucalyptus oval, `round` is fatter and lifts at the tip.
 * One shape repeated thirty times across a page reads as a stamp however good
 * the shape is; two is enough for the eye to stop counting. Each carries its
 * own pool - the lighter patch where the pigment thinned - because a pool cut
 * for the narrow leaf leaves a visible halo inside the wide one.
 */
const LEAF_SHAPES = {
  pointed: {
    body: "M0 0 C 5 -8.5, 18 -10.5, 26 0 C 18 10.5, 5 8.5, 0 0 Z",
    pool: "M5.5 0 C 9 -5, 17 -6, 21.5 -0.6 C 17 5, 9 4.6, 5.5 0 Z",
  },
  round: {
    body: "M0 0 C 3.5 -11, 18 -13, 25 -2 C 21 10.5, 5 11, 0 0 Z",
    pool: "M5 -0.6 C 8 -6.5, 16 -7.6, 20.5 -2.4 C 17 4.6, 8 5, 5 -0.6 Z",
  },
} as const;

type LeafShape = keyof typeof LEAF_SHAPES;

/**
 * One leaf. The outer <g> places it and the inner <g> animates it, so the
 * flutter pivots at the leaf's own stem joint rather than at the SVG origin.
 */
function Leaf({
  x,
  y,
  rotate,
  scale = 1,
  tone = "mid",
  delay = 0,
  duration = 4.5,
  shape = "pointed",
  still = false,
  uid,
}: LeafSpec & { shape?: LeafShape; still?: boolean; uid: string }) {
  const cut = LEAF_SHAPES[shape];

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g
        className={still ? undefined : "leaf-sway"}
        style={
          still
            ? undefined
            : { animationDelay: `${delay}s`, animationDuration: `${duration}s` }
        }
      >
        <path d={cut.body} fill={`url(#${uid}-${tone})`} />
        <path d={cut.pool} fill="#FFFFFF" opacity="0.22" />
        <path
          d="M2.5 0 C 10 -1.2, 17 -1, 22.5 0"
          fill="none"
          stroke={tone === "blush" ? "#C22B4B" : "#4E7A28"}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </g>
  );
}

/** The flyer's heart, scaled about its own center so it is placed by center. */
export function BrandHeart({
  x,
  y,
  scale = 1,
  rotate = 0,
  delay = 0,
  still = false,
  className = "fill-pink",
}: AccentSpec & { still?: boolean; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g
        className={still ? undefined : "berry-bob"}
        style={still ? undefined : { animationDelay: `${delay}s` }}
      >
        <path
          d="M0 10 C -8 3.5, -11 0, -11 -3.8 C -11 -7.2, -8.4 -10, -5 -10 C -2.9 -10, -1.1 -8.9, 0 -7.2 C 1.1 -8.9, 2.9 -10, 5 -10 C 8.4 -10, 11 -7.2, 11 -3.8 C 11 0, 8 3.5, 0 10 Z"
          className={className}
        />
      </g>
    </g>
  );
}

/* --------------------------------------------------------------------------
   Geometry

   Hand-placed, not generated. Every node on a stem carries two leaves, one on
   each side, angled off the stem's local tangent. Scales taper toward the tip
   and the tones alternate, so no two neighbours match.

   Flutter durations are deliberately non-multiples of each other so the set
   never resynchronises into a single visible beat.
   -------------------------------------------------------------------------- */

interface VariantSpec {
  viewBox: string;
  /** Pivot for the whole-branch sway: the point the stem is anchored by. */
  pivot: string;
  /**
   * Only every Nth leaf gets its own flutter clock; the rest ride the branch
   * sway alone.
   *
   * SVG transforms are not composited, so every fluttering leaf is main-thread
   * paint work each frame. The hero puts four arches on screen at once - 72
   * leaves - which is enough to be felt on a cheap phone. At every other leaf
   * the branch still reads as alive, because the sway underneath moves all of
   * them anyway, and the cost halves. The small sprig keeps every leaf: it is
   * placed one at a time, and at that size a still leaf is visible.
   */
  flutterEvery: number;
  stems: string[];
  leaves: LeafSpec[];
  hearts: AccentSpec[];
  berries: (AccentSpec & { r: number })[];
}

const SPRIG: VariantSpec = {
  viewBox: "0 0 160 110",
  pivot: "8px 98px",
  flutterEvery: 1,
  stems: [
    "M8 98 C 40 92, 68 78, 92 56 C 110 40, 130 26, 152 16",
    "M26 93 C 40 95, 54 93, 68 85",
  ],
  leaves: [
    { x: 33, y: 90, rotate: -66, scale: 1.0, tone: "mid", delay: 0, duration: 4.7 },
    { x: 33, y: 90, rotate: 28, scale: 0.9, tone: "light", delay: -1.3, duration: 5.3 },
    { x: 56, y: 80, rotate: -76, scale: 0.95, tone: "deep", delay: -0.6, duration: 4.1 },
    { x: 56, y: 80, rotate: 18, scale: 0.86, tone: "mid", delay: -2.1, duration: 5.9 },
    { x: 78, y: 66, rotate: -87, scale: 0.9, tone: "light", delay: -1.7, duration: 4.4 },
    { x: 78, y: 66, rotate: 7, scale: 0.8, tone: "deep", delay: -0.9, duration: 5.1 },
    { x: 99, y: 49, rotate: -94, scale: 0.82, tone: "mid", delay: -2.8, duration: 4.9 },
    { x: 99, y: 49, rotate: 0, scale: 0.72, tone: "light", delay: -1.1, duration: 5.5 },
    { x: 120, y: 34, rotate: -90, scale: 0.72, tone: "deep", delay: -3.3, duration: 4.2 },
    { x: 120, y: 34, rotate: 6, scale: 0.62, tone: "mid", delay: -0.3, duration: 5.7 },
    // The tip leaves are smallest, so they get the fastest clocks: light
    // things move faster in the same breeze.
    { x: 140, y: 22, rotate: -82, scale: 0.6, tone: "light", delay: -2.6, duration: 3.6 },
    { x: 140, y: 22, rotate: 12, scale: 0.5, tone: "deep", delay: -1.9, duration: 3.9 },
    // Offshoot
    { x: 42, y: 94, rotate: 30, scale: 0.66, tone: "mid", delay: -2.4, duration: 5.2 },
    { x: 54, y: 93, rotate: -26, scale: 0.58, tone: "light", delay: -0.7, duration: 4.6 },
    { x: 66, y: 86, rotate: 10, scale: 0.54, tone: "deep", delay: -3.1, duration: 5.6 },
  ],
  hearts: [
    { x: 49, y: 72, scale: 0.5, rotate: -12, delay: -0.4 },
    { x: 93, y: 41, scale: 0.4, rotate: 10, delay: -2.2 },
    { x: 130, y: 17, scale: 0.32, rotate: -6, delay: -3.7 },
  ],
  berries: [
    { x: 36, y: 79, r: 3, delay: -1.4 },
    { x: 73, y: 57, r: 2.4, delay: -2.9 },
  ],
};

const ARCH: VariantSpec = {
  viewBox: "0 0 200 150",
  pivot: "2px 2px",
  flutterEvery: 2,
  stems: [
    "M2 2 C 54 6, 106 24, 140 62 C 160 84, 175 113, 183 144",
    "M64 18 C 78 30, 88 44, 92 60",
  ],
  leaves: [
    { x: 38, y: 10, rotate: -42, scale: 1.15, tone: "mid", delay: 0, duration: 5.1 },
    { x: 38, y: 10, rotate: 64, scale: 1.0, tone: "light", delay: -1.6, duration: 4.4 },
    { x: 72, y: 21, rotate: -32, scale: 1.1, tone: "deep", delay: -0.8, duration: 5.8 },
    { x: 72, y: 21, rotate: 74, scale: 0.98, tone: "mid", delay: -2.4, duration: 4.7 },
    { x: 102, y: 37, rotate: -22, scale: 1.0, tone: "light", delay: -3.1, duration: 5.4 },
    { x: 102, y: 37, rotate: 84, scale: 0.9, tone: "deep", delay: -1.2, duration: 4.1 },
    { x: 127, y: 57, rotate: -11, scale: 0.92, tone: "mid", delay: -2.7, duration: 5.6 },
    { x: 127, y: 57, rotate: 95, scale: 0.82, tone: "light", delay: -0.5, duration: 4.9 },
    { x: 148, y: 84, rotate: 1, scale: 0.82, tone: "deep", delay: -3.6, duration: 4.3 },
    { x: 148, y: 84, rotate: 107, scale: 0.72, tone: "mid", delay: -1.9, duration: 5.9 },
    { x: 165, y: 113, rotate: 8, scale: 0.7, tone: "light", delay: -2.2, duration: 4.6 },
    { x: 165, y: 113, rotate: 114, scale: 0.62, tone: "deep", delay: -0.9, duration: 5.2 },
    // Tip cluster: the hand at the end of the arm, fanned so the branch closes
    // on something rather than simply running out of leaves.
    { x: 180, y: 138, rotate: 46, scale: 0.62, tone: "mid", delay: -1.4, duration: 3.8 },
    { x: 180, y: 138, rotate: 82, scale: 0.7, tone: "light", delay: -2.9, duration: 4.0 },
    { x: 180, y: 138, rotate: 118, scale: 0.56, tone: "deep", delay: -0.2, duration: 3.6 },
    // Inner offshoot, which fills the hollow of the curve.
    { x: 78, y: 32, rotate: 40, scale: 0.66, tone: "light", delay: -3.4, duration: 5.0 },
    { x: 87, y: 47, rotate: 96, scale: 0.6, tone: "mid", delay: -1.7, duration: 4.5 },
    { x: 92, y: 60, rotate: 62, scale: 0.54, tone: "deep", delay: -2.6, duration: 5.5 },
  ],
  hearts: [
    { x: 58, y: 6, scale: 0.6, rotate: -14, delay: -0.6 },
    { x: 116, y: 46, scale: 0.46, rotate: 12, delay: -2.5 },
    { x: 160, y: 100, scale: 0.52, rotate: -8, delay: -3.9 },
  ],
  berries: [
    { x: 90, y: 26, r: 3.2, delay: -1.1 },
    { x: 138, y: 70, r: 2.6, delay: -3.2 },
    { x: 174, y: 124, r: 2.2, delay: -2.0 },
  ],
};

const VARIANTS: Record<BranchVariant, VariantSpec> = { sprig: SPRIG, arch: ARCH };

export function WatercolorBranch({
  className,
  variant = "sprig",
  flip = false,
  flipY = false,
  leavesOnly = false,
  windScale = 1,
  still = false,
}: WatercolorBranchProps) {
  // Gradient ids have to be per-instance: several branches share a page, and
  // duplicate ids would make every leaf resolve against whichever branch
  // happened to mount first.
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const spec = VARIANTS[variant];
  const [, , width, height] = spec.viewBox.split(" ");

  // Each mirror translates by the axis extent first so the branch lands back
  // on top of its own box instead of flipping out of frame.
  const mirror =
    flip || flipY
      ? `translate(${flip ? width : 0} ${flipY ? height : 0}) scale(${
          flip ? -1 : 1
        } ${flipY ? -1 : 1})`
      : undefined;

  return (
    <svg
      viewBox={spec.viewBox}
      className={cn("block", className)}
      aria-hidden="true"
      // overflow must stay visible: the sway swings leaf tips a few units past
      // the viewBox at the extremes of the arc.
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* objectBoundingBox units, so each wash follows its own leaf's
            rotation instead of pointing one way across the whole SVG. */}
        <linearGradient id={`${uid}-light`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#C3DC9B" />
          <stop offset="100%" stopColor="#8CBB55" />
        </linearGradient>
        <linearGradient id={`${uid}-mid`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#8FC155" />
          <stop offset="100%" stopColor="#5C9130" />
        </linearGradient>
        <linearGradient id={`${uid}-deep`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#6FA83C" />
          <stop offset="100%" stopColor="#3F651F" />
        </linearGradient>
        <linearGradient id={`${uid}-blush`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#F7B9C4" />
          <stop offset="100%" stopColor="#E23A5E" />
        </linearGradient>
      </defs>

      {/* Mirror lives on a <g>, so the <svg> root keeps its transform free for
          the caller's own rotate/translate utilities. */}
      <g transform={mirror}>
        <g
          className={still ? undefined : "sprig-sway"}
          style={
            still
              ? undefined
              : {
                  transformOrigin: spec.pivot,
                  animationDuration: `${7 * windScale}s`,
                }
          }
        >
          {spec.stems.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#4E7A28"
              strokeWidth={i === 0 ? 2.2 : 1.5}
              strokeLinecap="round"
              opacity={i === 0 ? 0.9 : 0.7}
            />
          ))}

          {spec.leaves.map((leaf, i) => (
            <Leaf
              key={i}
              {...leaf}
              uid={uid}
              // Alternated on position rather than stored per leaf: the cut is
              // texture, not layout, and threading it through the data would
              // only invite someone to tune it leaf by leaf.
              shape={i % 3 === 1 ? "round" : "pointed"}
              still={still || i % spec.flutterEvery !== 0}
              duration={(leaf.duration ?? 4.5) * windScale}
            />
          ))}

          {!leavesOnly && (
            <>
              {spec.hearts.map((heart, i) => (
                <BrandHeart
                  key={i}
                  {...heart}
                  still={still}
                  className={i % 2 ? "fill-pink-dark" : "fill-pink"}
                />
              ))}
              <g className="fill-pink">
                {spec.berries.map((berry, i) => (
                  <circle
                    key={i}
                    cx={berry.x}
                    cy={berry.y}
                    r={berry.r}
                    className={still ? undefined : "berry-bob"}
                    style={still ? undefined : { animationDelay: `${berry.delay}s` }}
                  />
                ))}
              </g>
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
