"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import { WatercolorWash, SurfaceGrain } from "@/components/brand/Texture";
import { Footprint, FootprintGlyph } from "@/components/brand/Footprints";

/**
 * Full-bleed backdrop for the FAQ hero.
 *
 * Two things layered over the usual wash-and-grain primitives
 * (components/brand/Texture.tsx):
 *
 * 1. A field of the logo's footprint and a rounded question mark raining
 *    down at every width. Each glyph loops top-to-bottom on its own clock
 *    (see .footprint-fall in globals.css), and the whole field pauses on
 *    hover so a visitor can look at one instead of chasing it. Two tiers: a
 *    sparser, larger "edge" tier along the margins, kept clear of the copy
 *    column, and a denser, smaller, much fainter "fill" tier across the
 *    whole width.
 *
 * 2. From xl, where the margins have room, a small scene in each margin: a
 *    question mark walked out in footprints, and a stick figure under a
 *    speech bubble - a child asking on the left, a grown-up answering with a
 *    heart on the right. That is the page in one picture, and it leaves the
 *    card's own column clear.
 *
 * The rain's tints run wider than the brand's own palette on purpose, at the
 * requester's choice: a blue and a purple pulled to the same mid-saturation as
 * the brand three so they read as one wash. Scoped to this component rather
 * than promoted to globals.css: if this field goes, so do these two colors.
 * Amber holds two slots, which doubles its odds - a weighted die.
 *
 * Everything is seeded or fixed geometry, so server and client render the
 * same markup.
 */
const PRINT_TINTS = [
  "var(--color-pink)",
  "var(--color-leaf)",
  "var(--color-amber)",
  "var(--color-amber)",
  "#4C7FD1",
  "#8B5FC9",
] as const;

type GlyphKind = "foot" | "mark";

/**
 * The question mark's stroke, on a 44 x 64 canvas: thick, round-capped, no
 * sharp terminal, so it sits in the same soft family as FootprintGlyph. Kept
 * as data because the walked question mark below follows the same curve.
 */
const MARK_D =
  "M 9 17 C 9 8 15.5 2 22.5 2 C 30 2 36 7.5 36 15.5 C 36 22.5 31 26 26 30 C 22.5 32.8 20.5 35.8 20.5 41";

function QuestionGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 44 64" className={cn("block", className)} style={style} aria-hidden="true">
      <path d={MARK_D} fill="none" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round" />
      <circle cx="20.5" cy="57" r="5.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   The rain
   ------------------------------------------------------------------------- */

/** mulberry32, seeded so the scatter matches between server and client. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface FallingPrint {
  x: number;
  size: number;
  rotate: number;
  tint: (typeof PRINT_TINTS)[number];
  left: boolean;
  opacity: number;
  duration: number;
  delay: number;
  kind: GlyphKind;
}

/**
 * One print per evenly-spaced horizontal slot, jittered within it: a
 * stratified scatter, so twenty-odd samples spread out instead of clumping
 * the way pure random draws do.
 */
function scatterX(seed: number, count: number, xRange: [number, number]): number[] {
  const rand = rng(seed);
  const [x0, x1] = xRange;
  const slot = (x1 - x0) / count;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    out.push(x0 + i * slot + (rand() - 0.2) * slot * 1.4);
  }
  return out;
}

function buildField(
  seed: number,
  xs: number[],
  opts: {
    size: [number, number];
    opacity: [number, number];
    duration: [number, number];
    /** Share of prints drawn as a footprint rather than a question mark. */
    footShare?: number;
  },
): FallingPrint[] {
  const rand = rng(seed);
  const footShare = opts.footShare ?? 0.5;
  return xs.map((x) => {
    const duration = opts.duration[0] + rand() * (opts.duration[1] - opts.duration[0]);
    return {
      x,
      size: opts.size[0] + rand() * (opts.size[1] - opts.size[0]),
      rotate: Math.round((rand() - 0.5) * 70),
      tint: PRINT_TINTS[Math.floor(rand() * PRINT_TINTS.length)],
      left: rand() > 0.5,
      opacity: opts.opacity[0] + rand() * (opts.opacity[1] - opts.opacity[0]),
      duration,
      // Negative delay starts each print already partway through its fall
      // instead of every one beginning at the top together.
      delay: -rand() * duration,
      kind: rand() < footShare ? "foot" : "mark",
    };
  });
}

// The edge tier is drawn from two literal margin bands rather than scattered
// across the full width and rejection-sampled out of the middle, which still
// lets a jittered slot land behind the headline.
const EDGE_XS = [...scatterX(0xfa91, 24, [-5, 18]), ...scatterX(0x1c44, 24, [82, 105])];

const EDGE_PRINTS = buildField(0xfa91, EDGE_XS, {
  size: [32, 60],
  opacity: [0.38, 0.64],
  duration: [16, 29],
});

const FILL_PRINTS = buildField(0x5e17, scatterX(0x5e17, 72, [-4, 104]), {
  size: [14, 26],
  opacity: [0.13, 0.22],
  duration: [14, 26],
});

function FallingPrints({ prints }: { prints: FallingPrint[] }) {
  return (
    <>
      {prints.map((p, i) => {
        const glyphStyle: React.CSSProperties = {
          width: `${p.size}px`,
          transform: `rotate(${p.rotate}deg)`,
          color: p.tint,
          opacity: p.opacity,
          fill: "currentColor",
        };
        return (
          <span
            key={i}
            className="footprint-fall"
            style={
              {
                left: `${p.x}%`,
                // React's CSSProperties type doesn't declare custom
                // properties; the browser reads them fine regardless.
                "--fall-duration": `${p.duration.toFixed(2)}s`,
                "--fall-delay": `${p.delay.toFixed(2)}s`,
              } as React.CSSProperties
            }
          >
            {p.kind === "foot" ? (
              <Footprint left={p.left} style={glyphStyle} />
            ) : (
              <QuestionGlyph style={glyphStyle} />
            )}
          </span>
        );
      })}
    </>
  );
}

function FootprintScatter() {
  return (
    <div className="footprint-rain absolute inset-0 overflow-hidden">
      <FallingPrints prints={FILL_PRINTS} />
      {/* Eased back from xl, where the margin scenes sit in the same bands
          and need to read in front of it. */}
      <div className="absolute inset-0 xl:opacity-[0.45]">
        <FallingPrints prints={EDGE_PRINTS} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The margin scenes
   ------------------------------------------------------------------------- */

type Pt = [number, number];
type Cubic = [Pt, Pt, Pt, Pt];

function bez([p0, p1, p2, p3]: Cubic, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

interface Step {
  x: number;
  y: number;
  angle: number;
  left: boolean;
}

/**
 * Walks a chain of cubics and drops a print every `stride` units of arc
 * length, alternating feet either side of the line. Measured rather than
 * stepped in t, because equal steps in t bunch up where a curve is slow.
 */
function walk(curves: Cubic[], stride: number, gait: number): Step[] {
  const pts: Pt[] = [];
  for (const c of curves) {
    for (let i = pts.length ? 1 : 0; i <= 120; i++) pts.push(bez(c, i / 120));
  }
  const dist = [0];
  for (let i = 1; i < pts.length; i++) {
    dist.push(dist[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }

  const total = dist[dist.length - 1];
  const steps: Step[] = [];
  let j = 1;
  for (let d = stride / 2, n = 0; d < total; d += stride, n++) {
    while (dist[j] < d) j++;
    const [x0, y0] = pts[j - 1];
    const [x1, y1] = pts[j];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const left = n % 2 === 0;
    // Left of the direction of travel, in y-down screen space.
    const side = left ? 1 : -1;
    steps.push({
      x: x0 + (dy / len) * gait * side,
      y: y0 + (-dx / len) * gait * side,
      // The glyph's toes point up (-y), so turn it a quarter past the heading.
      angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90,
      left,
    });
  }
  return steps;
}

/**
 * The question mark's own curve (MARK_D), scaled up and walked: the hook as
 * a trail, and the dot as the walker's two feet planted side by side, facing
 * the way they arrived.
 */
function walkedQuestionMark(ox: number, oy: number, k: number): Step[] {
  const p = (x: number, y: number): Pt => [ox + x * k, oy + y * k];
  const hook = walk(
    [
      [p(9, 17), p(9, 8), p(15.5, 2), p(22.5, 2)],
      [p(22.5, 2), p(30, 2), p(36, 7.5), p(36, 15.5)],
      [p(36, 15.5), p(36, 22.5), p(31, 26), p(26, 30)],
      [p(26, 30), p(22.5, 32.8), p(20.5, 35.8), p(20.5, 41)],
    ],
    21,
    5,
  );
  const [dx, dy] = p(20.5, 57);
  return [
    ...hook,
    // Facing down the page, so the left foot is the one on screen right.
    { x: dx + 6, y: dy, angle: 180, left: true },
    { x: dx - 6, y: dy, angle: 180, left: false },
  ];
}

const PRINT_SCALE = 0.5;
const STEP_SECONDS = 0.3;

// Both scenes are drawn on a 320 x 440 canvas, standing on a shared ground
// line at y = 320. The left one has the card on its right edge, the right one
// on its left edge, so each figure stands on the card side and its walked
// question mark sits out toward the viewport edge.
const GROUND = 320;
const LEFT_MARK = walkedQuestionMark(10, 95, 3.8);
const RIGHT_MARK = walkedQuestionMark(160, 95, 3.8);

/**
 * The walked question marks rotate through all three logo colours, amber
 * included, rather than the strict leaf-left / pink-right pairing, so they
 * read as part of the colourful rain around them.
 */
const TRAIL_FILLS = ["fill-leaf", "fill-pink", "fill-amber"] as const;

function Trail({ steps }: { steps: Step[] }) {
  return (
    <g opacity={0.8}>
      {steps.map((s, i) => (
        <g
          key={i}
          transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.angle.toFixed(1)}) scale(${PRINT_SCALE})`}
        >
          <g className="trail-step" style={{ animationDelay: `${(i * STEP_SECONDS).toFixed(2)}s` }}>
            <g
              className={TRAIL_FILLS[i % TRAIL_FILLS.length]}
              transform={s.left ? "translate(21 -28.5) scale(-1 1)" : "translate(-21 -28.5)"}
            >
              <FootprintGlyph />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

function BubbleMark({ cx, cy, height }: { cx: number; cy: number; height: number }) {
  const s = height / 64;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-22 -32)`} className="text-pink">
      <path d={MARK_D} fill="none" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round" />
      <circle cx="20.5" cy="57" r="5.5" fill="currentColor" />
    </g>
  );
}

/** The heart cut out of the footprint's sole, centred near (20.8, 28.4). */
function Heart({ cx, cy, height }: { cx: number; cy: number; height: number }) {
  const s = height / 10.4;
  return (
    <path
      transform={`translate(${cx} ${cy}) scale(${s}) translate(-20.8 -28.4)`}
      className="fill-pink"
      d="M 20.8 33.6 C 23.4 30.6, 25.5 28.6, 25.5 26.3 C 25.5 24.5, 24.4 23.2, 22.9 23.2 C 22.1 23.2, 21.3 23.6, 20.8 24.3 C 20.3 23.6, 19.5 23.2, 18.7 23.2 C 17.2 23.2, 16.1 24.5, 16.1 26.3 C 16.1 28.6, 18.2 30.6, 20.8 33.6 Z"
    />
  );
}

/**
 * A speech bubble with its tail on the bottom edge, pointing down at the
 * figure saying it. Drawn on the site's depth model: a hard offset shadow in
 * a darker shade of the bubble's own colour, like the buttons and cards.
 */
function Bubble({
  cx,
  cy,
  w,
  h,
  tail,
  fill,
  shadow,
  children,
  delay = 0,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** x offset of the tail's tip from the bubble's centre. */
  tail: number;
  fill: string;
  shadow: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const base = cx + tail * 0.55;
  const tipX = cx + tail;
  const tipY = bottom + 18;
  const shape = (
    <>
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={h / 2.6} />
      <path
        d={`M ${base - 11} ${bottom - 4} Q ${base - 4} ${bottom + 6} ${tipX} ${tipY} Q ${base + 4} ${bottom + 8} ${base + 13} ${bottom - 4} Z`}
      />
    </>
  );
  return (
    <g className="bubble-bob" style={{ animationDelay: `${delay}s` }}>
      <g transform="translate(3 4)" className={shadow}>
        {shape}
      </g>
      <g className={fill}>{shape}</g>
      {children}
    </g>
  );
}

/**
 * A stick figure standing on GROUND. `child` is shorter, with one hand up the
 * way a kid asks a question, drawn in amber; the grown-up stands taller with
 * both arms open, in leaf. Faces stay in cocoa so they still read against the
 * light head fill.
 */
function StickFigure({ x, child = false }: { x: number; child?: boolean }) {
  const stroke = child ? "stroke-amber" : "stroke-leaf";
  const headFill = child ? "fill-amber-light" : "fill-leaf-light";
  const r = child ? 12 : 13;
  const leg = child ? 30 : 36;
  const body = child ? 34 : 45;
  const hip = GROUND - leg;
  const neck = hip - body;
  const head = neck - r;
  const shoulder = neck + (child ? 9 : 11);
  return (
    <g>
      <ellipse cx={x} cy={GROUND + 3} rx={child ? 20 : 24} ry={3.5} className="fill-cocoa/10" />
      <g
        fill="none"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={stroke}
      >
        <line x1={x} y1={neck} x2={x} y2={hip} />
        <path d={`M ${x - 11} ${GROUND} L ${x} ${hip} L ${x + 11} ${GROUND}`} />
        {child ? (
          <>
            {/* Hand up, elbow bent: "I have a question." */}
            <path d={`M ${x} ${shoulder} L ${x + 15} ${shoulder - 12} L ${x + 18} ${shoulder - 30}`} />
            <path d={`M ${x} ${shoulder} L ${x - 14} ${shoulder + 16}`} />
          </>
        ) : (
          <>
            <path d={`M ${x} ${shoulder} L ${x - 17} ${shoulder - 6} L ${x - 27} ${shoulder - 18}`} />
            <path d={`M ${x} ${shoulder} L ${x + 17} ${shoulder - 6} L ${x + 27} ${shoulder - 18}`} />
          </>
        )}
        <circle cx={x} cy={head} r={r} className={headFill} />
      </g>
      <path
        d={`M ${x - 4} ${head + 3} Q ${x} ${head + 7} ${x + 4} ${head + 3}`}
        fill="none"
        strokeWidth={2.2}
        strokeLinecap="round"
        className="stroke-cocoa-mid"
      />
      <circle cx={x - 4} cy={head - 2} r={1.6} className="fill-cocoa-mid" />
      <circle cx={x + 4} cy={head - 2} r={1.6} className="fill-cocoa-mid" />
    </g>
  );
}

function LeftScene() {
  // Child: head top at GROUND - 76 - 12 = 232, so the tail tip sits just
  // above it at ~222.
  return (
    <svg viewBox="0 0 320 440" preserveAspectRatio="xMidYMax meet" className="h-full w-full">
      <Trail steps={LEFT_MARK} />
      <StickFigure x={222} child />
      <Bubble cx={228} cy={171} w={86} h={66} tail={-6} fill="fill-pink-light" shadow="fill-pink/25">
        <BubbleMark cx={228} cy={171} height={38} />
      </Bubble>
    </svg>
  );
}

function RightScene() {
  // Grown-up: head top at GROUND - 94 - 13 = 213, tail tip at ~204.
  return (
    <svg viewBox="0 0 320 440" preserveAspectRatio="xMidYMax meet" className="h-full w-full">
      <Trail steps={RIGHT_MARK} />
      <StickFigure x={100} />
      <Bubble
        cx={96}
        cy={155}
        w={80}
        h={62}
        tail={4}
        fill="fill-amber-light"
        shadow="fill-amber/30"
        delay={-3.5}
      >
        <Heart cx={96} cy={156} height={30} />
      </Bubble>
    </svg>
  );
}

export function FaqHeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const eased = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });

  const yBack = useTransform(eased, [0, 1], [0, 40]);
  const yFront = useTransform(eased, [0, 1], [0, 75]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {/* Back layer: the big, quiet blooms that tint the paper. */}
      <motion.div
        style={reduce ? undefined : { y: yBack }}
        className="absolute inset-x-0 -inset-y-[12%] will-change-transform"
      >
        <WatercolorWash tone="amber" strength={0.12} className="-left-32 -top-24 h-[34rem] w-[34rem]" />
      </motion.div>

      {/* Front layer: the rain, with more travel. */}
      <motion.div
        style={reduce ? undefined : { y: yFront }}
        className="absolute inset-x-0 -inset-y-[12%] will-change-transform"
      >
        <WatercolorWash tone="pink" strength={0.1} className="-right-16 bottom-0 h-72 w-72" />
        <FootprintScatter />
      </motion.div>

      {/* The scenes stay put rather than drifting with the rain, so the
          figures stand still under their bubbles. Each sits in its own
          margin, sized to the gap between the card (max-w-3xl, 24rem either
          side of centre) and the viewport edge less a 1rem gutter, and capped
          so an ultra-wide screen does not blow them up. */}
      <div className="absolute inset-0 hidden xl:block">
        <div className="absolute inset-y-0 right-[calc(50%_+_25rem)] w-[min(calc(50%_-_25rem),24rem)]">
          <LeftScene />
        </div>
        <div className="absolute inset-y-0 left-[calc(50%_+_25rem)] w-[min(calc(50%_-_25rem),24rem)]">
          <RightScene />
        </div>
      </div>

      <SurfaceGrain className="opacity-[0.05] mix-blend-soft-light" />
    </div>
  );
}
