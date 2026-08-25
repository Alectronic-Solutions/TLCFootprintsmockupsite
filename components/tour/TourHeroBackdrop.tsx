"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { asset } from "@/lib/site";

/**
 * The hand-drawn map moves a little more slowly than the tour hero's copy,
 * giving the illustration depth without turning the heading into a moving
 * target. The PageHero scrim is deliberately kept outside this component so
 * the same artwork can remain readable at every viewport size.
 */
export function TourHeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });
  const y = useTransform(progress, [0, 1], [0, 52]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -inset-y-16 inset-x-0 bg-cover bg-center will-change-transform"
        style={
          reduce
            ? { backgroundImage: `url(${asset("/tour-hero-map.webp")})` }
            : { y, backgroundImage: `url(${asset("/tour-hero-map.webp")})` }
        }
      />
    </div>
  );
}
