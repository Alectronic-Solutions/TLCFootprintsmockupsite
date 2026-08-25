"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";

const DAB_RADIUS = 150;
const IDLE_FADE_DELAY_MS = 60_000;
const FADE_DURATION_MS = 1_400;

type Dab = { id: number; x: number; y: number };

/**
 * The Programs illustration starts in black and white, then gains colour
 * under a cursor. The full-colour version is the accessible fallback for
 * touch and reduced-motion visitors.
 */
export function ProgramsHeroArtwork({
  imageSrc,
  mobileImageSrc,
  fit = "cover",
  mobileFit = "contain",
  width = 2172,
  height = 724,
  className,
}: {
  imageSrc: string;
  /** Optional phone crop. A native picture source ensures only one file downloads. */
  mobileImageSrc?: string;
  fit?: "cover" | "contain";
  mobileFit?: "cover" | "contain";
  /** Native dimensions ensure the hover reveal tracks the image precisely. */
  width?: number;
  height?: number;
  className?: string;
}) {
  const resolvedImageSrc = asset(imageSrc);
  const resolvedMobileImageSrc = mobileImageSrc ? asset(mobileImageSrc) : null;
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const dabId = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dabs, setDabs] = useState<Dab[]>([]);
  const [fading, setFading] = useState(false);
  // False on the server and on touch devices. This keeps the SVG colour layer
  // (and its image request) out of mobile markup entirely.
  const [interactive, setInteractive] = useState(false);
  const maskId = `${useId().replace(/[^a-zA-Z0-9-]/g, "")}-colour-reveal`;

  useEffect(() => {
    const finePointer = window.matchMedia("(min-width: 640px) and (hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) {
      setInteractive(false);
      return;
    }
    setInteractive(true);

    const armIdleFade = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
      setFading(false);
      idleTimer.current = setTimeout(() => {
        setFading(true);
        clearTimer.current = setTimeout(() => setDabs([]), FADE_DURATION_MS);
      }, IDLE_FADE_DELAY_MS);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
        last.current = null;
        return;
      }
      armIdleFade();

      const scale =
        fit === "cover"
          ? Math.max(rect.width / width, rect.height / height)
          : Math.min(rect.width / width, rect.height / height);
      const offsetX = (rect.width - width * scale) / 2;
      const offsetY = (rect.height - height * scale) / 2;
      const point = { x: (px - offsetX) / scale, y: (py - offsetY) / scale };
      if (
        point.x < 0 ||
        point.y < 0 ||
        point.x > width ||
        point.y > height ||
        (last.current && Math.hypot(point.x - last.current.x, point.y - last.current.y) < 28)
      ) {
        return;
      }

      last.current = point;
      setDabs((current) => [...current.slice(-299), { id: dabId.current++, ...point }]);
    };

    const reset = () => {
      last.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, [fit, height, width]);

  const preserveAspectRatio = fit === "cover" ? "xMidYMid slice" : "xMidYMid meet";

  return (
    <div ref={ref} aria-hidden="true" className={cn("absolute inset-0 overflow-hidden bg-cream", className)}>
      {/* CSS background art direction avoids the preload scanner fetching an
          <img> fallback before it evaluates a <picture> source. Only the
          image selected by the active media query is requested. */}
      <div
        className={cn(
          "programs-hero-base absolute inset-0 bg-center bg-no-repeat",
          mobileFit === "cover" ? "bg-cover" : "bg-contain",
          fit === "cover" ? "sm:bg-cover" : "sm:bg-contain",
        )}
        style={{
          ["--programs-hero-desktop" as string]: `url("${resolvedImageSrc}")`,
          ["--programs-hero-mobile" as string]: `url("${resolvedMobileImageSrc ?? resolvedImageSrc}")`,
        }}
      />

      {interactive ? (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio={preserveAspectRatio} className="absolute inset-0 hidden h-full w-full sm:block">
          <defs>
            <filter id={`${maskId}-blur`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
              <g filter={`url(#${maskId}-blur)`}>
                {dabs.map((dab) => (
                  <circle
                    key={dab.id}
                    cx={dab.x}
                    cy={dab.y}
                    r={DAB_RADIUS}
                    fill="white"
                    className={fading ? "coloring-fade" : undefined}
                  />
                ))}
              </g>
            </mask>
          </defs>
          <image
            href={resolvedImageSrc}
            x="0"
            y="0"
            width={width}
            height={height}
            preserveAspectRatio={preserveAspectRatio}
            mask={`url(#${maskId})`}
          />
        </svg>
      ) : null}
    </div>
  );
}
