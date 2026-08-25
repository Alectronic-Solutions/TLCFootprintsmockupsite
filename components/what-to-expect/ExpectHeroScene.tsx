"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { RainbowArc } from "@/components/brand/RainbowArc";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { Footprint } from "@/components/brand/Footprints";
import { WatercolorWash } from "@/components/brand/Texture";
import { cn } from "@/lib/cn";

/**
 * The room the hero was missing: a low play-shelf wall, drawn rather than
 * photographed, on four depth layers that drift at their own rate as the
 * page scrolls past. Same subject as ExpectHeroSceneMobile below, recomposed
 * for a full-bleed frame instead of a compact strip.
 *
 * The scroll rig is copied from ScrollSprig (components/brand/ScrollSprig.tsx):
 * a spring over scrollYProgress, not the raw value, because raw progress is
 * visibly jittery on a trackpad. See that file for the fuller explanation.
 *
 * `mounted` guards the first client render against the server render, the
 * same fix EmbraceBranches uses (components/brand/EmbraceBranches.tsx) -
 * scroll progress cannot be computed during SSR, so the transforms have to
 * sit at their resting value until the client has measured the page once.
 */

const VB_W = 800;
const VB_H = 500;

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function ExpectHeroScene({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const active = mounted && !reduce;

  const skyY = useTransform(eased, [0, 1], active ? [0, -20] : [0, 0]);
  const skyOpacity = useTransform(eased, [0, 1], active ? [1, 0.6] : [1, 1]);
  const wallY = useTransform(eased, [0, 1], active ? [0, -55] : [0, 0]);
  const floorY = useTransform(eased, [0, 1], active ? [0, -100] : [0, 0]);
  const frontY = useTransform(eased, [0, 1], active ? [0, -150] : [0, 0]);
  const frontScale = useTransform(eased, [0, 1], active ? [1, 1.06] : [1, 1]);

  return (
    <div
      ref={sectionRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 hidden overflow-hidden sm:block", className)}
    >
      <WatercolorWash
        tone="pink"
        className="-left-16 -top-10 h-64 w-64"
        strength={0.09}
      />

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full" preserveAspectRatio="xMidYMax slice">
        {/* Sky / window layer */}
        <motion.g style={{ y: skyY, opacity: skyOpacity }}>
          <rect x={520} y={30} width={220} height={280} rx={10} className="fill-amber-light" />
          <rect
            x={520}
            y={30}
            width={220}
            height={280}
            rx={10}
            fill="none"
            className="stroke-cocoa/15"
            strokeWidth={3}
          />
          <rect x={526} y={168} width={208} height={4} className="fill-cocoa/10" />
          <rect x={628} y={36} width={4} height={268} className="fill-cocoa/10" />
        </motion.g>

        {/* Wall layer: shelf run + rainbow hung above it */}
        <motion.g style={{ y: wallY }}>
          <foreignObject x={40} y={70} width={200} height={110}>
            <div className="h-full w-full opacity-90">
              <RainbowArc className="h-full w-full" />
            </div>
          </foreignObject>

          <rect x={30} y={220} width={420} height={14} rx={4} className="fill-cocoa/20" />
          <rect x={30} y={300} width={420} height={14} rx={4} className="fill-cocoa/20" />
          <rect x={30} y={220} width={10} height={94} className="fill-cocoa/25" />
          <rect x={440} y={220} width={10} height={94} className="fill-cocoa/25" />
        </motion.g>

        {/* Floor layer: baskets, blocks, a potted sprig */}
        <motion.g style={{ y: floorY }}>
          <ellipse cx={230} cy={430} rx={260} ry={26} className="fill-leaf-light/70" />

          <rect x={70} y={240} width={70} height={54} rx={8} className="fill-pink-light" />
          <rect x={160} y={240} width={70} height={54} rx={8} className="fill-amber-light" />
          <rect x={250} y={240} width={70} height={54} rx={8} className="fill-leaf-light" />

          <rect x={340} y={330} width={40} height={40} rx={6} className="fill-leaf" opacity={0.85} />
          <rect x={385} y={345} width={30} height={25} rx={5} className="fill-pink" opacity={0.8} />

          <foreignObject x={600} y={300} width={110} height={130}>
            <div className="h-full w-full opacity-90">
              <BotanicalSprig className="h-full w-full" windScale={1.1} />
            </div>
          </foreignObject>
        </motion.g>

        {/* Front layer: footprints walking the floor line */}
        <motion.g style={{ y: frontY, scale: frontScale }}>
          <foreignObject x={430} y={400} width={40} height={60}>
            <Footprint left className="h-full w-auto fill-pink" />
          </foreignObject>
          <foreignObject x={470} y={412} width={36} height={54}>
            <Footprint className="h-full w-auto fill-leaf" />
          </foreignObject>
          <foreignObject x={508} y={422} width={32} height={48}>
            <Footprint left className="h-full w-auto fill-amber" />
          </foreignObject>
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * The same scene, compacted into an in-flow strip for phones - the pattern
 * About's hero uses for HeroColoringSceneMobile. No parallax: a phone hero
 * has no scroll runway before the copy scrolls it off anyway.
 */
export function ExpectHeroSceneMobile({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("opacity-80", className)}>
      <svg viewBox="0 0 400 160" className="h-auto w-full">
        <rect x={16} y={20} width={110} height="70" rx={8} className="fill-cocoa/20" />
        <rect x={12} y={92} width={200} height={10} rx={3} className="fill-cocoa/20" />
        <ellipse cx={110} cy={140} rx={150} ry={16} className="fill-leaf-light/70" />
        <rect x={30} y={100} width={36} height={30} rx={5} className="fill-pink-light" />
        <rect x={74} y={100} width={36} height={30} rx={5} className="fill-amber-light" />
        <rect x={118} y={100} width={36} height={30} rx={5} className="fill-leaf-light" />
        <foreignObject x={230} y={10} width={150} height={80}>
          <div className="h-full w-full opacity-90">
            <RainbowArc className="h-full w-full" />
          </div>
        </foreignObject>
        <foreignObject x={330} y={90} width={40} height={60}>
          <Footprint left className="h-full w-auto fill-pink" />
        </foreignObject>
      </svg>
    </div>
  );
}
