"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";

/**
 * The family/house/rainbow illustration, grayscale until a cursor sweeps -
 * or, on a phone or tablet, a finger drags - across it. Applied to one flat
 * PNG rather than a sketch/paint SVG pair.
 *
 * Reveal persistence matches ProgramsHeroArtwork rather than the
 * accumulate-and-fade engine HeroColoringScene uses: dabs pile up and stay
 * at full strength for as long as the pointer keeps moving, and only start
 * fading - all at once, together - after IDLE_FADE_DELAY_MS of no movement.
 * The earlier per-dab clock (each dab fading on its own timer regardless of
 * continued activity) meant color visibly drained out from under an active
 * cursor; this idle-gated version keeps the scene fully painted while
 * someone is actually engaging with it.
 *
 * The listener is local to this element and pointer-type-agnostic (mouse,
 * touch, pen all paint) - the same choice HeroColoringSceneMobile makes and
 * documents: touchmove does not carry pointermove-compatible coordinates on
 * every engine, but every engine this site targets also dispatches
 * pointermove alongside it, so one listener covers every input. This
 * replaces an earlier version that only listened on `window` for
 * `pointerType === "mouse"` - correct for a desktop-only backdrop, but it
 * meant touch visitors got the illustration in flat, permanent colour with
 * nothing to reveal, since they have no hover to trigger a window-level
 * mouse listener with.
 *
 * Reduced-motion visitors get the illustration in full colour with no mask
 * - the accessible fallback, not a lesser version, matching every other
 * coloring-reveal on this site.
 */

const BLOB_R = 260;
const BLOB_BLUR = 60;
/** Smaller dab on phones - the whole picture is far smaller on screen there than on a desktop backdrop. */
const MOBILE_BLOB_R = 130;
/** Leave a little sky around the panoramic scene in the tall mobile hero. */
const MOBILE_ART_HEIGHT = 0.86;
/** How long the scene stays fully coloured after the pointer goes idle, before the whole reveal fades out together - matches ProgramsHeroArtwork. */
const IDLE_FADE_DELAY_MS = 60_000;
const FADE_DURATION_MS = 1_400;
/** Minimum cursor travel, in image pixels, between dabs. */
const STRIDE = BLOB_R * 0.18;
const MOBILE_STRIDE = MOBILE_BLOB_R * 0.18;

type Dab = { id: number; x: number; y: number };

export function AboutHeroArtwork({
  imageSrc,
  width,
  height,
  className,
  /** Scales the dab down for the compact mobile/tablet composition. */
  compact = false,
}: {
  imageSrc: string;
  /** Native pixel size, so the pointer math and the dab scale line up with the real crop. */
  width: number;
  height: number;
  className?: string;
  compact?: boolean;
}) {
  const resolvedImageSrc = asset(imageSrc);
  const boxRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const maskId = `${uid}-colour-reveal`;

  const blobR = compact ? MOBILE_BLOB_R : BLOB_R;
  const stride = compact ? MOBILE_STRIDE : STRIDE;

  const [dabs, setDabs] = useState<Dab[]>([]);
  const [fading, setFading] = useState(false);
  /**
   * Starts true so the server and the client's first render agree: the mask
   * is present, holding no dabs, which is the grayscale resting state. The
   * effect below turns it off only where reduced motion asks for it, and
   * the colour layer then shows in full.
   */
  const [interactive, setInteractive] = useState(true);

  const last = useRef<{ x: number; y: number } | null>(null);
  const dabId = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (calm.matches) {
      setInteractive(false);
      return;
    }

    const armIdleFade = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
      setFading(false);
      idleTimer.current = setTimeout(() => {
        setFading(true);
        clearTimer.current = setTimeout(() => setDabs([]), FADE_DURATION_MS);
      }, IDLE_FADE_DELAY_MS);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
        last.current = null;
        return;
      }

      // Cover-crop math: same fit the CSS background uses (bg-[center_top]
      // and the SVG's xMidYMin), so a dab lands exactly under the pointer
      // regardless of how the box has cropped the image at this width. The
      // compact mobile art is shorter than its hero box and bottom-aligned,
      // which leaves extra sky above the scene to make the panorama read
      // farther out rather than enlarging it to fill the phone.
      // Y is anchored to the top rather than centred - centring it here
      // (as a plain "object-fit: cover" would) shifted every dab down by
      // half the vertical crop, so the top of the artwork could never be
      // reached by the pointer and never coloured in.
      const scale = Math.max(
        rect.width / width,
        ((compact ? MOBILE_ART_HEIGHT : 1) * rect.height) / height,
      );
      const offsetX = (rect.width - width * scale) / 2;
      const offsetY = rect.height - height * scale;
      const point = { x: (px - offsetX) / scale, y: (py - offsetY) / scale };

      if (
        point.x < 0 ||
        point.y < 0 ||
        point.x > width ||
        point.y > height ||
        (last.current && Math.hypot(point.x - last.current.x, point.y - last.current.y) < stride)
      ) {
        return;
      }

      armIdleFade();
      last.current = point;
      setDabs((current) => [...current.slice(-299), { id: dabId.current++, ...point }]);
    };

    const reset = () => {
      last.current = null;
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointerup", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointerup", reset);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, stride]);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={cn("absolute inset-0 touch-pan-y overflow-hidden", compact ? "bg-[#b8e2f4]" : null, className)}
    >
      {/* The resting state: grayscale, so the scene reads as a quiet
          colouring-book backdrop rather than competing with the copy over
          it. */}
      <div
        className={cn(
          "bg-cover bg-[center_top] grayscale",
          compact ? "absolute inset-x-0 bottom-0 top-auto h-[86%]" : "absolute inset-0",
        )}
        style={{ backgroundImage: `url(${resolvedImageSrc})` }}
      />

      {/* The colour, shown only where dabs have been laid down - or shown
          everywhere, for anyone who cannot hover a mouse over this. */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMin slice"
        className={cn(
          "w-full",
          compact ? "absolute inset-x-0 bottom-0 top-auto h-[86%]" : "absolute inset-0 h-full",
        )}
      >
        <defs>
          <filter
            id={`${maskId}-blur`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={compact ? MOBILE_BLOB_R * 0.23 : BLOB_BLUR} />
          </filter>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-blobR * 2}
            y={-blobR * 2}
            width={width + blobR * 4}
            height={height + blobR * 4}
          >
            <g filter={`url(#${maskId}-blur)`}>
              {dabs.map((d) => (
                <circle
                  key={d.id}
                  cx={d.x}
                  cy={d.y}
                  r={blobR}
                  fill="#fff"
                  className={fading ? "coloring-fade" : undefined}
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
          preserveAspectRatio="xMidYMin slice"
          mask={interactive ? `url(#${maskId})` : undefined}
        />
      </svg>
    </div>
  );
}
