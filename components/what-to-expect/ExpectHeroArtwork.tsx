"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePaintDabs } from "@/components/about/HeroColoringScene";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";

/**
 * The classroom photo, muted until the cursor moves across it. Reuses the
 * dab engine from About's HeroColoringScene (usePaintDabs) rather than
 * Programs' version of the same idea (ProgramsHeroArtwork): Programs holds
 * colour until a full minute of stillness, which reads as "sometimes
 * colourful"; this page asked for the opposite - colour follows the cursor
 * and each dab fades back out on its own short clock, so the photo is
 * mostly grayscale at rest and only lights up right where the pointer is.
 * `LIFE_MS` below is the one number that sets how long that hold-then-fade
 * takes; the shape of the fade itself is the shared `.coloring-blob`
 * keyframes in globals.css.
 *
 * Also carries a scroll parallax: the photo drifts a little slower than the
 * page scrolls past it, the same spring-over-scrollYProgress rig
 * ScrollSprig and EmbraceBranches use. The moving layer is sized a few
 * percent taller than its box so the drift never uncovers the section's own
 * background at the top or bottom edge.
 *
 * Fine-pointer and motion-tolerant only. Touch and reduced-motion visitors
 * get the photo in full colour with no mask and no drift - the accessible
 * fallback, not a lesser version.
 */

const LIFE_MS = 4200;
const BLOB_R = 220;
const BLOB_BLUR = 55;

export function ExpectHeroArtwork({
  imageSrc,
  width = 1672,
  height = 941,
  className,
}: {
  imageSrc: string;
  /** Native pixel size, so the pointer math and the dab scale line up with the real crop. */
  width?: number;
  height?: number;
  className?: string;
}) {
  const resolvedImageSrc = asset(imageSrc);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  /**
   * Starts true so the server and the client's first render agree: the mask
   * is present, holding no dabs, which is the grayscale resting state. The
   * effect below turns it off only where hovering cannot work, and the
   * colour layer then shows in full - see HeroColoringScene's identical
   * comment on this same trick.
   */
  const [interactive, setInteractive] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const maskId = `${uid}-colour-reveal`;

  const { blobs, paint, resetStride } = usePaintDabs({ lifeMs: LIFE_MS });

  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start start", "end start"],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });
  const active = mounted && !reduce;
  const parallaxY = useTransform(eased, [0, 1], active ? ["-3%", "3%"] : ["0%", "0%"]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) {
      setInteractive(false);
      return;
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
        resetStride();
        return;
      }

      // Cover-crop math: same fit the CSS background uses, so a dab lands
      // exactly under the cursor regardless of how the box has cropped the
      // photo at this width.
      const scale = Math.max(rect.width / width, rect.height / height);
      const offsetX = (rect.width - width * scale) / 2;
      const offsetY = rect.height - height * scale;
      paint((px - offsetX) / scale, (py - offsetY) / scale);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", resetStride);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", resetStride);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <div ref={boxRef} aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute -inset-y-[6%] inset-x-0" style={{ y: parallaxY }}>
        {/* The resting state: muted, so the room reads as a quiet backdrop
            rather than competing with the copy over it. */}
        <div
          className="absolute inset-0 bg-cover bg-bottom grayscale brightness-110"
          style={{ backgroundImage: `url(${resolvedImageSrc})` }}
        />

        {/* The colour, shown only where dabs have been laid down - or shown
            everywhere, for anyone who cannot hover a mouse over this. */}
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
          <defs>
            <filter id={`${maskId}-blur`} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation={BLOB_BLUR} />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x={-BLOB_R * 2} y={-BLOB_R * 2} width={width + BLOB_R * 4} height={height + BLOB_R * 4}>
              <g filter={`url(#${maskId}-blur)`}>
                {blobs.map((b) => (
                  <circle
                    key={b.id}
                    cx={b.x}
                    cy={b.y}
                    r={BLOB_R}
                    fill="#fff"
                    className="coloring-blob"
                    style={{ ["--blob-life" as string]: `${LIFE_MS}ms` }}
                  />
                ))}
              </g>
            </mask>
          </defs>
          <image
            href={resolvedImageSrc}
            x={0}
            y={0}
            width={width}
            height={height}
            preserveAspectRatio="xMidYMid slice"
            mask={interactive ? `url(#${maskId})` : undefined}
          />
        </svg>
      </motion.div>
    </div>
  );
}
