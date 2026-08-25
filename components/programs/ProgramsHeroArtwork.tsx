"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";

const DAB_RADIUS = 150;
/** Smaller dab on phones - the mobile crop reads much smaller on screen than the desktop panorama. */
const MOBILE_DAB_RADIUS = 90;
const IDLE_FADE_DELAY_MS = 60_000;
const FADE_DURATION_MS = 1_400;

type Dab = { id: number; x: number; y: number };

/**
 * The Programs illustration starts in black and white, then gains colour
 * under a cursor - or, on a phone or tablet, a finger dragging across it.
 * Reduced-motion visitors get the full-colour version with no mask, the
 * accessible fallback, matching every other coloring-reveal on this site.
 */
export function ProgramsHeroArtwork({
  imageSrc,
  mobileImageSrc,
  fit = "cover",
  mobileFit = "contain",
  width = 2172,
  height = 724,
  mobileWidth,
  mobileHeight,
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
  /** Native dimensions of the mobile crop, if it differs in aspect from the desktop image. Defaults to width/height. */
  mobileWidth?: number;
  mobileHeight?: number;
  className?: string;
}) {
  const resolvedImageSrc = asset(imageSrc);
  const resolvedMobileImageSrc = mobileImageSrc ? asset(mobileImageSrc) : null;
  const activeMobileWidth = mobileWidth ?? width;
  const activeMobileHeight = mobileHeight ?? height;
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const dabId = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dabs, setDabs] = useState<Dab[]>([]);
  const [fading, setFading] = useState(false);
  /**
   * Starts true so the server and the client's first render agree: the mask
   * is present, holding no dabs, which is the grayscale resting state. The
   * effect below turns it off only where reduced motion asks for it, and the
   * colour layer then shows in full.
   */
  const [interactive, setInteractive] = useState(true);
  const [isDesktopCrop, setIsDesktopCrop] = useState(false);
  const maskId = `${useId().replace(/[^a-zA-Z0-9-]/g, "")}-colour-reveal`;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopCrop = window.matchMedia("(min-width: 640px)");
    if (reducedMotion.matches) {
      setInteractive(false);
      return;
    }
    setInteractive(true);
    setIsDesktopCrop(desktopCrop.matches);
    const onCropChange = () => setIsDesktopCrop(desktopCrop.matches);
    desktopCrop.addEventListener("change", onCropChange);

    const activeWidth = desktopCrop.matches ? width : activeMobileWidth;
    const activeHeight = desktopCrop.matches ? height : activeMobileHeight;
    const activeFit = desktopCrop.matches ? fit : mobileFit;

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
        activeFit === "cover"
          ? Math.max(rect.width / activeWidth, rect.height / activeHeight)
          : Math.min(rect.width / activeWidth, rect.height / activeHeight);
      const offsetX = (rect.width - activeWidth * scale) / 2;
      const offsetY = (rect.height - activeHeight * scale) / 2;
      const point = { x: (px - offsetX) / scale, y: (py - offsetY) / scale };
      if (
        point.x < 0 ||
        point.y < 0 ||
        point.x > activeWidth ||
        point.y > activeHeight ||
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
    const el = ref.current;
    el?.addEventListener("pointermove", onMove, { passive: true });
    el?.addEventListener("pointerleave", reset);
    el?.addEventListener("pointerup", reset);
    return () => {
      desktopCrop.removeEventListener("change", onCropChange);
      el?.removeEventListener("pointermove", onMove);
      el?.removeEventListener("pointerleave", reset);
      el?.removeEventListener("pointerup", reset);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, [fit, mobileFit, height, width, activeMobileWidth, activeMobileHeight]);

  const activeWidth = isDesktopCrop ? width : activeMobileWidth;
  const activeHeight = isDesktopCrop ? height : activeMobileHeight;
  const activeFit = isDesktopCrop ? fit : mobileFit;
  const activeSrc = isDesktopCrop ? resolvedImageSrc : (resolvedMobileImageSrc ?? resolvedImageSrc);
  const preserveAspectRatio = activeFit === "cover" ? "xMidYMid slice" : "xMidYMid meet";
  const dabRadius = isDesktopCrop ? DAB_RADIUS : MOBILE_DAB_RADIUS;

  return (
    <div ref={ref} aria-hidden="true" className={cn("absolute inset-0 touch-pan-y overflow-hidden bg-cream", className)}>
      {/* CSS background art direction avoids the preload scanner fetching an
          <img> fallback before it evaluates a <picture> source. Only the
          image selected by the active media query is requested. The resting
          state is grayscale everywhere; the SVG layer above paints colour
          back in under a cursor or a finger. */}
      <div
        className={cn(
          "programs-hero-base absolute inset-0 bg-center bg-no-repeat",
          interactive ? "grayscale brightness-110" : null,
          mobileFit === "cover" ? "bg-cover" : "bg-contain",
          fit === "cover" ? "sm:bg-cover" : "sm:bg-contain",
        )}
        style={{
          ["--programs-hero-desktop" as string]: `url("${resolvedImageSrc}")`,
          ["--programs-hero-mobile" as string]: `url("${resolvedMobileImageSrc ?? resolvedImageSrc}")`,
        }}
      />

      {interactive ? (
        <svg viewBox={`0 0 ${activeWidth} ${activeHeight}`} preserveAspectRatio={preserveAspectRatio} className="absolute inset-0 h-full w-full">
          <defs>
            <filter id={`${maskId}-blur`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={isDesktopCrop ? 28 : 18} />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={activeWidth} height={activeHeight}>
              <g filter={`url(#${maskId}-blur)`}>
                {dabs.map((dab) => (
                  <circle
                    key={dab.id}
                    cx={dab.x}
                    cy={dab.y}
                    r={dabRadius}
                    fill="white"
                    className={fading ? "coloring-fade" : undefined}
                  />
                ))}
              </g>
            </mask>
          </defs>
          <image
            href={activeSrc}
            x="0"
            y="0"
            width={activeWidth}
            height={activeHeight}
            preserveAspectRatio={preserveAspectRatio}
            mask={`url(#${maskId})`}
          />
        </svg>
      ) : null}
    </div>
  );
}
