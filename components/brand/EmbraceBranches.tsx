"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { WatercolorBranch } from "./WatercolorBranch";
import { cn } from "@/lib/cn";

/**
 * The hero's embrace: four watercolor arms anchored in the four corners,
 * reaching inward around the copy.
 *
 * The flyer frames its message with branches in the corners. This takes that
 * one step further and gives the frame an intention: the arms *reach out* when
 * the page loads, and *close* as you scroll - a hug tightening around the
 * content rather than a static border.
 *
 * Three separate transforms per arm, and all three are needed for it to read
 * as an arm rather than as a picture sliding around:
 *
 *   rotate   about the corner the arm is anchored to, so the branch is hinged
 *            off-screen like a limb rather than spinning about its own middle
 *   drift    a few px further into the frame, following the rotation
 *   scale    a touch larger as it closes, which is what an arm coming toward
 *            you does
 *
 * Each arm is three nested elements, one transform apiece, and they have to
 * stay separate:
 *
 *   outer   the entrance, played once on mount. A mount `animate` and a
 *           scroll-driven `style` cannot share an element without one
 *           clobbering the other.
 *   middle  the scroll-linked close, hinged at the anchor corner.
 *   inner   the resting angle, hinged at the arm's own center. Folded into the
 *           middle element it would drag that hinge to the center with it, and
 *           the arm would swing like a propeller instead of like a limb.
 *
 * Nested transforms multiply, so the three read as one motion.
 *
 * The close is scroll-*linked*, not scroll-triggered: it is a continuous
 * function of hero position, so scrolling back up opens the arms again. A
 * triggered animation that fires once and stays put reads as a page that
 * finished loading; a linked one reads as a page responding to you.
 */

type Corner = "tl" | "tr" | "bl" | "br";

interface ArmSpec {
  corner: Corner;
  /**
   * Positioning and size, every value in `vw`.
   *
   * The unit matters. An arm's height is a fixed ratio of its width, so a top
   * offset in `%` - which resolves against the *hero's* height - slides the
   * whole branch off the top of a tall phone hero while sitting correctly on a
   * short desktop one. In `vw` the offset scales with the art it is offsetting.
   */
  className: string;
  /**
   * Resting rotation, as Tailwind classes so it can change per breakpoint,
   * applied about the arm's own center.
   *
   * It has to vary by breakpoint. A phone hero is tall and narrow, so the two
   * top arms fall almost vertically and meet over the copy on their own. A
   * desktop hero is wide and short: the same angle buries four fifths of each
   * branch above the fold and leaves a stray twig on the page. There the arms
   * are laid over near-horizontal instead, draping across the top the way the
   * flyer's corner branches do.
   *
   * The pivot is the center and not the anchor corner: a half turn about a
   * corner throws the whole branch out of the frame, whereas about the center
   * it lands back on its own box, reversed.
   */
  baseClass: string;
  /**
   * Degrees added across the scroll, signed so the four tips converge on the
   * middle of the hero: the top pair dips inward, the bottom pair lifts.
   */
  close: number;
  /** Horizontal drift into the frame, in px, across the scroll. */
  drift: number;
  /** Vertical drift, in px. Negative lifts the arm toward the hero's middle. */
  lift: number;
  flip?: boolean;
  windScale: number;
  opacity: number;
  /** Entrance order. The top arms arrive first: they frame the headline. */
  delay: number;
}

const ORIGIN: Record<Corner, string> = {
  tl: "top left",
  tr: "top right",
  bl: "bottom left",
  br: "bottom right",
};

const ARMS: ArmSpec[] = [
  {
    corner: "tl",
    className:
      "-left-[16vw] -top-[4vw] w-[72vw] sm:-left-[12vw] sm:-top-[8vw] sm:w-[54vw] lg:-left-[6vw] lg:w-[46vw]",
    baseClass: "-rotate-[6deg] lg:-rotate-[28deg]",
    close: 8,
    drift: 20,
    lift: 12,
    windScale: 1.35,
    opacity: 0.5,
    delay: 0.25,
  },
  {
    corner: "tr",
    className:
      "-right-[16vw] -top-[2vw] w-[66vw] sm:-right-[12vw] sm:-top-[6vw] sm:w-[50vw] lg:-right-[6vw] lg:-top-[8vw] lg:w-[42vw]",
    baseClass: "rotate-[5deg] lg:rotate-[28deg]",
    close: -7,
    drift: -18,
    lift: 12,
    flip: true,
    windScale: 1.6,
    opacity: 0.44,
    delay: 0.35,
  },
  {
    corner: "bl",
    // The lower pair only appears where there is height for them to reach into.
    // On a phone the hero is barely taller than the copy, and four arms there
    // would be a thicket.
    className: "-bottom-[12vw] -left-[8vw] hidden w-[38vw] lg:block",
    baseClass: "rotate-180",
    close: -11,
    drift: 18,
    lift: -18,
    flip: true,
    windScale: 1.9,
    opacity: 0.34,
    delay: 0.5,
  },
  {
    corner: "br",
    className: "-bottom-[12vw] -right-[3vw] hidden w-[32vw] lg:block",
    baseClass: "rotate-180",
    close: 10,
    drift: -16,
    lift: -16,
    windScale: 1.7,
    opacity: 0.3,
    delay: 0.6,
  },
];

/**
 * Hearts drifting in the gaps between the arms, the way they are scattered
 * across the flyer. Each one parallaxes at its own rate, so the hero gains
 * depth on scroll instead of moving as one flat plane.
 *
 * `depth` is both the parallax multiplier and the size: the ones that travel
 * furthest are the ones nearest the viewer, which is the only arrangement that
 * does not read as a bug.
 */
const HEARTS = [
  { className: "left-[6%] top-[24%]", size: 19, depth: 1.15, tint: "text-pink", delay: -1.2 },
  { className: "left-[15%] top-[72%] hidden sm:block", size: 14, depth: 0.7, tint: "text-pink/70", delay: -3.4 },
  { className: "right-[10%] top-[14%]", size: 16, depth: 0.95, tint: "text-pink/80", delay: -0.5 },
  { className: "right-[24%] top-[80%] hidden lg:block", size: 21, depth: 1.3, tint: "text-pink/60", delay: -2.6 },
  { className: "left-[46%] top-[10%] hidden md:block", size: 13, depth: 0.55, tint: "text-pink/50", delay: -4.1 },
  { className: "right-[40%] bottom-[10%] hidden lg:block", size: 15, depth: 0.85, tint: "text-amber/70", delay: -1.9 },
];

type HeartSpec = (typeof HEARTS)[number];

function Heart({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 22"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 21 C 4 14.5, 1 11, 1 7.2 C 1 3.8, 3.6 1, 7 1 C 9.1 1, 10.9 2.1, 12 3.8 C 13.1 2.1, 14.9 1, 17 1 C 20.4 1, 23 3.8, 23 7.2 C 23 11, 20 14.5, 12 21 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * One drifting heart. Same two-element split as the arms: the outer element
 * carries the scroll parallax, the inner one the pop-in and the idle drift.
 */
function DriftHeart({
  spec,
  progress,
  index,
}: {
  spec: HeartSpec;
  progress: MotionValue<number>;
  index: number;
}) {
  const y = useTransform(progress, [0, 1], [0, -120 * spec.depth]);
  const opacity = useTransform(progress, [0, 0.6, 1], [1, 0.9, 0]);

  return (
    <motion.div className={cn("absolute", spec.className)} style={{ y, opacity }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.7 + index * 0.12,
          type: "spring",
          stiffness: 180,
          damping: 16,
        }}
      >
        <div className="heart-drift" style={{ animationDelay: `${spec.delay}s` }}>
          <Heart size={spec.size} className={spec.tint} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Arm({ spec, progress }: { spec: ArmSpec; progress: MotionValue<number> }) {
  const rotate = useTransform(progress, [0, 0.9], [0, spec.close]);
  const x = useTransform(progress, [0, 0.9], [0, spec.drift]);
  const y = useTransform(progress, [0, 0.9], [0, spec.lift]);
  const scale = useTransform(progress, [0, 0.9], [1, 1.07]);
  // Holds full strength through the first half of the hero, then clears out
  // before the next section's own botanicals arrive.
  const opacity = useTransform(progress, [0, 0.55, 1], [spec.opacity, spec.opacity, 0]);

  const entryX = spec.corner === "tl" || spec.corner === "bl" ? -70 : 70;

  return (
    <motion.div
      className={cn("absolute", spec.className)}
      style={{ transformOrigin: ORIGIN[spec.corner] }}
      initial={{ opacity: 0, x: entryX, rotate: spec.close * -0.9, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
      transition={{
        duration: 1.5,
        delay: spec.delay,
        // A branch has weight: it settles rather than snapping into place.
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        style={{
          rotate,
          x,
          y,
          scale,
          opacity,
          transformOrigin: ORIGIN[spec.corner],
        }}
        className="will-change-transform"
      >
        {/* The resting turn is a third, static element. Composed onto the
            same node as the scroll rotation it would drag the hinge to the
            center with it, and the arm would swing like a propeller instead
            of like a limb. */}
        <div className={spec.baseClass}>
          <WatercolorBranch
            variant="arch"
            flip={spec.flip}
            windScale={spec.windScale}
            className="w-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EmbraceBranches({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 with the hero at rest under the navbar, 1 once the hero has scrolled
  // clear of the top of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Raw scroll progress is jittery on a trackpad and stepped on a mouse wheel.
  // The spring costs one rAF and is the difference between "alive" and "janky".
  const eased = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });

  /**
   * `useReducedMotion` has nothing to read during SSR, so the server always
   * renders the animated arms. Switching to the static ones on the very first
   * client render is a hydration mismatch, and React answers it by throwing
   * the whole page tree away and re-rendering it. Waiting for mount costs one
   * extra render and keeps the two in agreement.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Under reduced motion the arms are simply present, at their resting angles.
  if (reduce && mounted) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
      >
        {ARMS.map((spec) => (
          <div
            key={spec.corner}
            className={cn("absolute", spec.className)}
            style={{ opacity: spec.opacity }}
          >
            <div className={spec.baseClass}>
              <WatercolorBranch variant="arch" flip={spec.flip} still className="w-full" />
            </div>
          </div>
        ))}
        {HEARTS.map((heart, i) => (
          <div key={i} className={cn("absolute", heart.className)}>
            <Heart size={heart.size} className={heart.tint} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      {ARMS.map((spec) => (
        <Arm key={spec.corner} spec={spec} progress={eased} />
      ))}

      {HEARTS.map((heart, i) => (
        <DriftHeart key={i} spec={heart} progress={eased} index={i} />
      ))}
    </div>
  );
}
