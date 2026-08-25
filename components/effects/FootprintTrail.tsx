"use client";

import { useEffect, useRef, useState } from "react";
import { Footprint } from "@/components/brand/Footprints";

/**
 * Footprints that follow the cursor.
 *
 * The mark is a pair of baby footprints and the tagline is "Where Little Feet
 * Leave Everlasting Footprints", so the pointer leaving prints is the brand
 * saying itself out loud rather than a generic cursor effect.
 *
 * Rules it has to obey to stay tasteful rather than gimmicky:
 *
 *  - Prints are spaced by *distance travelled*, not by time. Time-based spawns
 *    pile up into a smear when the cursor is slow and skip when it is fast.
 *  - Each print is rotated to the direction of travel and offset to its own
 *    side of the path, so the trail reads as a walk instead of a line of
 *    stamps.
 *  - Low opacity, short life, capped count. It must never compete with a CTA.
 *  - Never on touch: there is no cursor, and the listener would cost battery
 *    for nothing.
 *  - Never under prefers-reduced-motion.
 *
 * Fading is CSS (`.foot-press` in globals.css). This component only decides
 * where a print goes and when to drop it.
 */

/** Pixels of cursor travel between prints. Roughly one stride. */
const STRIDE = 58;

/** How far each print sits to its own side of the path, in pixels. */
const SPREAD = 9;

/** Lifetime of a print, and the value handed to the CSS animation. */
const LIFE_MS = 1500;

/** Hard cap on prints in the DOM. Fast diagonal drags are the stress case. */
const MAX_PRINTS = 12;

/**
 * The three logo colors, cycled in order. Three tones against two feet means
 * the pattern only repeats every six prints, so a trail never looks striped.
 */
const TONES = ["pink", "amber", "leaf"] as const;

type Tone = (typeof TONES)[number];

/** Tailwind fill for each tone. Written out so the classes survive scanning. */
const TONE_FILL: Record<Tone, string> = {
  pink: "fill-pink",
  amber: "fill-amber",
  leaf: "fill-leaf",
};

interface Print {
  id: number;
  x: number;
  y: number;
  /** Degrees, already converted from the direction of travel. */
  angle: number;
  left: boolean;
  tone: Tone;
}

export function FootprintTrail() {
  const [prints, setPrints] = useState<Print[]>([]);

  // Everything the move handler mutates lives in refs, so moving the mouse
  // never triggers a render on its own: only an actual spawn does.
  const last = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const stepRef = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    // A coarse pointer is a finger, and matchMedia is the only reliable way to
    // tell: touch laptops report both, and `hover: hover` is what separates
    // them.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const onMove = (e: PointerEvent) => {
      // A pointermove from a pen or finger still arrives on a hybrid device.
      if (e.pointerType !== "mouse") return;

      const { clientX: x, clientY: y } = e;

      if (!last.current) {
        last.current = { x, y };
        return;
      }

      const dx = x - last.current.x;
      const dy = y - last.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist < STRIDE) return;

      last.current = { x, y };

      const ux = dx / dist;
      const uy = dy / dist;

      // Alternate feet. Left of the direction of travel is (uy, -ux): the
      // perpendicular, negated, because screen y points down.
      const step = stepRef.current++;
      const isLeft = step % 2 === 0;
      const side = isLeft ? 1 : -1;

      const print: Print = {
        id: idRef.current++,
        x: x + uy * SPREAD * side,
        y: y - ux * SPREAD * side,
        // The footprint art points north at 0deg, so travel angle plus 90.
        angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90,
        left: isLeft,
        tone: TONES[step % TONES.length],
      };

      setPrints((prev) => {
        const next = prev.length >= MAX_PRINTS ? prev.slice(1) : prev;
        return [...next, print];
      });

      const timer = setTimeout(() => {
        setPrints((prev) => prev.filter((p) => p.id !== print.id));
        timers.current.delete(timer);
      }, LIFE_MS);
      timers.current.add(timer);
    };

    // Leaving the window resets the anchor, so coming back in does not draw a
    // print at the far end of a jump the cursor never actually made.
    const onLeave = () => {
      last.current = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const pending = timers.current;
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  if (prints.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      // z-30 puts the trail over page content but under the navbar (z-50) and
      // the mobile bar (z-40), so prints walk *behind* the chrome.
      className="foot-trail pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {prints.map((p) => (
        <span
          key={p.id}
          className="foot-press absolute block will-change-transform"
          style={{
            left: p.x,
            top: p.y,
            marginLeft: -13,
            marginTop: -18,
            rotate: `${p.angle}deg`,
            // Consumed by the .foot-press keyframes.
            ["--foot-life" as string]: `${LIFE_MS}ms`,
          }}
        >
          <Footprint left={p.left} className={`h-9 w-auto ${TONE_FILL[p.tone]}`} />
        </span>
      ))}
    </div>
  );
}
