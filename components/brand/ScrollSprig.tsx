"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { BotanicalSprig } from "./BotanicalSprig";
import { cn } from "@/lib/cn";

/**
 * A sprig that grows in from the edge of the page as you scroll past it, and
 * withdraws again as the section leaves.
 *
 * The effect is scroll-*linked*, not scroll-triggered: the branch position is a
 * continuous function of where the section sits in the viewport, so scrolling
 * back up reverses it exactly. A triggered animation that fires once and stays
 * put reads as a page that finished loading; a linked one reads as a page that
 * is responding to you.
 *
 * Four things move together, which is what sells it as a branch entering a
 * frame rather than a picture sliding around:
 *
 *   travel   in from its own edge, along the axis it is anchored to
 *   rotate   a small counter-rotation, as though the stem is hinged off-screen
 *   opacity  fading up over the first part of the entry only
 *   drift    optional, off by default: a continuous vertical parallax that,
 *            unlike the other three, never holds - see the prop
 *
 * The wind sway from BotanicalSprig keeps running underneath all of it, on the
 * inner <g> elements, so the two never fight for the same transform.
 */

type Side = "left" | "right";

export function ScrollSprig({
  side,
  className,
  flip,
  flipY,
  leavesOnly,
  windScale = 1,
  /** Pixels of travel. Larger reads as a longer branch swinging in. */
  distance = 90,
  /** Degrees of counter-rotation across the entry. */
  turn = 14,
  /**
   * Resting tilt, in degrees. Use this instead of a Tailwind `rotate-*` class:
   * the scroll transform writes an inline `transform`, which would silently
   * beat the utility and leave the sprig sitting flat.
   */
  tilt = 0,
  /**
   * Pixels of continuous vertical parallax across the whole section.
   *
   * `x` deliberately holds across the middle so the entrance does not read as
   * a drift; `y` is the layer that never stops, which is what makes the branch
   * keep tracking the wheel in both directions once it has arrived. Both live
   * on the same element - framer composes x and y into one transform - so this
   * cannot fight the entrance. Default 0 leaves every other placement on the
   * site exactly as it was.
   */
  drift = 0,
}: {
  side: Side;
  className?: string;
  flip?: boolean;
  /**
   * Mirrors vertically so the sprig hangs down from a top edge. Use this
   * rather than a `scale-y-[-1]` class: the scroll animation below writes an
   * inline `transform`, which silently beats any Tailwind transform utility.
   */
  flipY?: boolean;
  leavesOnly?: boolean;
  windScale?: number;
  distance?: number;
  turn?: number;
  tilt?: number;
  drift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 when the section's top first touches the bottom of the viewport, 1 when
  // its bottom clears the top. The sprig is fully in around the middle.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Raw scroll progress is jittery on a trackpad and stepped on a mouse wheel.
  // The spring costs one rAF and is the difference between "alive" and "janky".
  const eased = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const sign = side === "left" ? -1 : 1;

  // Out, in, hold, out again. The hold across the middle is what stops the
  // branch from drifting the entire time the section is on screen, which would
  // read as a parallax bug rather than as an entrance.
  const x = useTransform(
    eased,
    [0, 0.35, 0.7, 1],
    [sign * distance, 0, 0, sign * distance * 0.6],
  );
  const rotate = useTransform(
    eased,
    [0, 0.35, 0.7, 1],
    [tilt + sign * turn, tilt, tilt, tilt + sign * turn * 0.6],
  );
  const opacity = useTransform(eased, [0, 0.2, 0.8, 1], [0, 1, 1, 0.25]);

  // The one channel with no hold in it. Positive drift starts the branch low
  // and lifts it as the section passes, against the page's own travel, which is
  // what reads as depth rather than as a sticker on the scroll layer.
  const y = useTransform(eased, [0, 1], [drift, -drift]);

  // Under reduced motion the sprig is simply present, at its resting position.
  if (reduce) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={tilt ? { rotate: `${tilt}deg` } : undefined}
        className={cn("pointer-events-none", className)}
      >
        <BotanicalSprig
          flip={flip}
          flipY={flipY}
          leavesOnly={leavesOnly}
          still
          className="h-full w-auto"
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ x, y, rotate, opacity }}
      className={cn("pointer-events-none will-change-transform", className)}
    >
      <BotanicalSprig
        flip={flip}
        flipY={flipY}
        leavesOnly={leavesOnly}
        windScale={windScale}
        className="h-full w-auto"
      />
    </motion.div>
  );
}
