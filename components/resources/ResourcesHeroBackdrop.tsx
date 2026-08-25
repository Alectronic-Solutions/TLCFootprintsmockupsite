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
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";

/**
 * Full-bleed footprint pattern for the Resources hero. The pattern moves more
 * slowly than the section on scroll, which creates depth without affecting
 * the readable copy above it.
 */
export function ResourcesHeroBackdrop({ className }: { className?: string }) {
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

  // useReducedMotion has nothing to read during SSR, so the server always
  // renders the animated version. Switching to the static one on the very
  // first client render is a hydration mismatch - see EmbraceBranches for the
  // same guard.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduce && mounted) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      >
        <Pattern />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <ParallaxPattern progress={eased} />
    </div>
  );
}

function ParallaxPattern({ progress }: { progress: MotionValue<number> }) {
  // Move the artwork down as the hero leaves the viewport so it scrolls at a
  // slower speed than the document. The overscan avoids exposing an edge.
  const y = useTransform(progress, [0, 1], [-18, 44]);
  const scale = useTransform(progress, [0, 1], [1, 1.025]);

  return (
    <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
      <Pattern />
    </motion.div>
  );
}

function Pattern() {
  return (
    <div
      className="absolute -inset-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${asset("/resources-hero-footprints.webp")})`,
      }}
    />
  );
}
