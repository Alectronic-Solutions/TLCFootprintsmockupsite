"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import { WatercolorWash, SurfaceGrain } from "@/components/brand/Texture";
import { Footprint } from "@/components/brand/Footprints";

/**
 * Full-bleed watercolor backdrop for the FAQ hero.
 *
 * Built from the same wash-and-grain primitives every other section on the
 * site uses (components/brand/Texture.tsx) - radial-gradient blooms plus a
 * feTurbulence paper grain - just layered several blooms deep and at hero
 * scale instead of the usual one or two corner accents. That keeps it a
 * designed piece of the brand rather than a photograph standing in for a
 * space nobody has shot yet (see lib/photos.ts).
 *
 * The whole thing drifts slowly on scroll, hero-anchored the way
 * EmbraceBranches is: two depths, so the back blooms move less than the
 * front ones, which is what reads as parallax rather than as one flat sheet
 * sliding under the page.
 *
 * A field of the logo's own footprint rains down between the two wash
 * depths - this is the FAQ, the one page framed as "answers to what parents
 * ask," so prints falling like the dots that would trail a question reads
 * as on-theme rather than as decoration for its own sake. Each print loops
 * top-to-bottom on its own clock (see the .footprint-fall keyframe in
 * globals.css) rather than tracking scroll, and the whole field pauses on
 * hover so a visitor can actually look at one instead of chasing it.
 *
 * Two tiers, the same split FootprintField uses for its watermark: a sparser
 * "edge" tier along the left/right margins, sized and tinted to read at a
 * glance and kept clear of the headline column, plus a denser, smaller,
 * much fainter "fill" tier scattered across the whole width - including
 * behind the copy - so the field reads as full without ever competing with
 * the text sitting on top of it.
 *
 * Tints run wider than the brand's own palette on purpose. RainbowArc's arch
 * is a strict three colors - pink, amber, leaf, matching the logo - and nothing
 * else on the site adds to that set. This field does, at the requester's
 * choice, with a blue and a purple pulled to the same mid-saturation as the
 * brand three so they read as part of one wash rather than as a clashing
 * import. Scoped to this one component rather than promoted to globals.css:
 * if this field goes, so do these two colors.
 *
 * Amber appears twice in the list below rather than once: `PRINT_TINTS[
 * Math.floor(rand() * PRINT_TINTS.length)]` picks uniformly from the array,
 * so a color's odds are just how many slots it holds - this is a weighted
 * die, not a separate probability system.
 *
 * Question marks alongside the footprints, not just feet: this backdrop is
 * specifically the FAQ hero, and a field of only feet doesn't say "questions"
 * the way feet-plus-question-marks does. QuestionGlyph below is drawn to sit
 * in the same plump, rounded family as FootprintGlyph - thick rounded
 * strokes, no sharp serif hook - so the two read as one wallpaper instead of
 * a brand glyph next to a generic one.
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
 * A friendly, rounded question mark - thick strokes with round caps, no
 * sharp terminal, so it sits in the same soft family as FootprintGlyph
 * rather than reading as a plain typographic "?" dropped onto the page.
 * Bounding box roughly x 4-40, y 0-64, centre near (22, 32) - sized to
 * balance against a footprint of the same nominal width.
 */
function QuestionGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 44 64" className={cn("block", className)} style={style} aria-hidden="true">
      <path
        d="M 9 17 C 9 8 15.5 2 22.5 2 C 30 2 36 7.5 36 15.5 C 36 22.5 31 26 26 30 C 22.5 32.8 20.5 35.8 20.5 41"
        fill="none"
        stroke="currentColor"
        strokeWidth="8.5"
        strokeLinecap="round"
      />
      <circle cx="20.5" cy="57" r="5.5" />
    </svg>
  );
}

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
 * Places `count` prints in `count` evenly-spaced horizontal slots across
 * `xRange`, each jittered within its own slot - a stratified scatter rather
 * than pure `rand() * range`. Pure random draws over only twenty-odd samples
 * clump by chance and leave gaps; a slot per print guarantees the spread
 * itself, and the jitter is what keeps the slots from reading as a grid.
 * Same idea FootprintField's brick layout uses, one dimension simpler since
 * this field doesn't need vertical placement - the fall animation supplies
 * that.
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

function buildField(seed: number, xs: number[], opts: {
  size: [number, number];
  opacity: [number, number];
  duration: [number, number];
  /** Share of prints drawn as a footprint rather than a question mark. */
  footShare?: number;
}): FallingPrint[] {
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

// The headline column sits centered roughly between x 20-80; the edge tier
// is drawn from two literal margin bands rather than scattered across the
// full width and rejection-sampled out of the middle - a stratified slot's
// *position* can still land inside a rejected band, and jitter alone can't
// move it back out, which is what put full-strength prints behind the
// headline the first time this was tried.
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
      <FallingPrints prints={EDGE_PRINTS} />
    </div>
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
      {/* Back layer: the big, quiet blooms that set the palette. Kept at the
          same 0.05-0.12 range corner accents use elsewhere on the site -
          the footprint field is this hero's actual art now, so the wash
          only needs to tint the paper, not compete with it. Any stronger
          and overlapping blooms (the amber and leaf corners both sit near
          the top) read as glowing spotlights instead of a wash. */}
      <motion.div
        style={reduce ? undefined : { y: yBack }}
        className="absolute inset-x-0 -inset-y-[12%] will-change-transform"
      >
        <WatercolorWash tone="amber" strength={0.12} className="-left-32 -top-24 h-[34rem] w-[34rem]" />
        <WatercolorWash tone="leaf" strength={0.09} className="-right-28 -top-16 h-[30rem] w-[30rem]" />
        <WatercolorWash tone="pink" strength={0.08} className="-bottom-32 left-1/4 h-[36rem] w-[36rem]" />
      </motion.div>

      {/* Front layer: smaller, closer-reading accents with more travel. */}
      <motion.div
        style={reduce ? undefined : { y: yFront }}
        className="absolute inset-x-0 -inset-y-[12%] will-change-transform"
      >
        <WatercolorWash tone="pink" strength={0.1} className="-right-16 bottom-0 h-72 w-72" />
        <WatercolorWash tone="leaf" strength={0.07} className="left-[6%] top-[8%] h-56 w-56" />
        <WatercolorWash
          tone="amber"
          strength={0.07}
          className="right-[18%] top-[42%] hidden h-64 w-64 lg:block"
        />
        <FootprintScatter />
      </motion.div>

      <SurfaceGrain className="opacity-[0.05] mix-blend-soft-light" />
    </div>
  );
}
