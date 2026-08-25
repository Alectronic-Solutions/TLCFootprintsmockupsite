"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A kid's painting of the house - blue sky, sun, clouds, a rainbow over the
 * roof - as the About hero's background. It ships as a pencil sketch, and the
 * cursor colours it in: paint laid down where the pointer passes *stays*
 * there, so moving around the hero fills the picture in, and each patch then
 * fades slowly back to line art.
 *
 * Two full SVGs stacked, not one recolored by JS: `sketch` is flat cocoa
 * linework, `painted` is the same drawing filled in. What differs from the
 * first version of this file is how the painted layer is revealed. That one
 * used a single CSS `mask-image` circle pinned to the cursor, so colour
 * existed only directly under the pointer and vanished the instant it moved -
 * a flashlight, not colouring. This one accumulates: every STRIDE units of
 * cursor travel drops a dab into an SVG mask, each dab holds full opacity for
 * HOLD_MS and then fades over FADE_MS on its own clock, and the whole mask is
 * blurred so overlapping dabs blend into one wash instead of reading as a
 * string of circles.
 *
 * Pointer tracking listens on the *window*, not on this element, and
 * hit-tests against its own box. PageHero's section is painted over this
 * scene and covers the same area, so a listener bound here would never fire:
 * every move over the hero targets that section, which is a sibling, so the
 * event bubbles past without touching this subtree. FootprintTrail listens on
 * the window for the same reason.
 *
 * Fine-pointer only, and off under reduced motion - both fall back to the
 * painted layer fully revealed rather than leaving anyone holding a grey
 * drawing they have no way to colour.
 */

const VB_W = 1600;
/**
 * The drawing is authored against y = 0..450, with the horizon at y ≈ 396.
 * VB_MIN_Y hangs empty sky above that origin rather than moving a single
 * drawn coordinate: the desktop hero is now tall enough that the copy sits
 * inside the sky rather than straddling the horizon, and the sky is the one
 * part of this picture that can be extended by fiat. Mobile is untouched -
 * it has its own composition on its own viewBox, and its hero is sized by
 * the phone, not by this ratio.
 */
const VB_MIN_Y = -450;
const VB_H = 450 - VB_MIN_Y;

/** One dab of paint, in viewBox units, before the blur softens its edge. */
const BLOB_R = 170;
/** Blur over the whole mask, so overlapping dabs read as a wash, not discs. */
const BLOB_BLUR = 45;
/**
 * Cursor travel between dabs. Spacing by distance, not by time, the way
 * FootprintTrail spaces its prints: time-based spawns smear when the cursor
 * is slow and leave gaps when it is fast. Tighter than the first version
 * (was 70): a smaller gap between dabs, each already growing in rather than
 * popping (see the `coloring-blob` keyframes in globals.css), is what turns
 * a cursor sweep into one continuous stroke instead of a series of stamps.
 */
const STRIDE = 46;
/** Hard cap on live dabs. Fast scribbling across the hero is the stress case. */
const MAX_BLOBS = 160;
/**
 * Lifetime of one dab, in ms. A full minute so a visitor who colours the
 * scene in gets to see it fully painted for a while before it lets go,
 * rather than watching the first strokes fade while still working on the
 * rest of the picture. The hold-then-fade split itself lives in the
 * `coloring-blob` keyframes in globals.css, as a percentage of this.
 */
const LIFE_MS = 60000;

interface Blob {
  id: number;
  x: number;
  y: number;
}

/**
 * Screen pixel to viewBox unit, inverting `preserveAspectRatio="xMidYMax
 * slice"`: scale is whichever axis has to stretch further to cover the box,
 * the drawing is centred horizontally (xMid) and pinned to the bottom (yMax).
 */
function toViewBoxCover(
  px: number,
  py: number,
  rect: DOMRect,
  vbW: number,
  vbH: number,
  vbMinY = 0,
) {
  const scale = Math.max(rect.width / vbW, rect.height / vbH);
  const offsetX = (rect.width - vbW * scale) / 2;
  const offsetY = rect.height - vbH * scale;
  return { x: (px - offsetX) / scale, y: (py - offsetY) / scale + vbMinY };
}

/**
 * Screen pixel to viewBox unit for `preserveAspectRatio="xMidYMid meet"` (the
 * mobile scene's own SVG, which fits the whole viewBox inside its box rather
 * than covering it - see HeroColoringSceneMobile). Scale is whichever axis
 * is the *tighter* fit, and both axes share one centred offset.
 */
function toViewBoxMeet(px: number, py: number, rect: DOMRect, vbW: number, vbH: number) {
  const scale = Math.min(rect.width / vbW, rect.height / vbH);
  const offsetX = (rect.width - vbW * scale) / 2;
  const offsetY = (rect.height - vbH * scale) / 2;
  return { x: (px - offsetX) / scale, y: (py - offsetY) / scale };
}

/**
 * The dab engine shared by the desktop and mobile scenes: accumulates paint
 * dabs from a stream of (x, y) points in viewBox units, spaced by distance
 * rather than time (see STRIDE), capped at MAX_BLOBS, each one self-removing
 * after LIFE_MS via its own timer.
 *
 * `paint(x, y)` is the only thing a caller needs to drive - it does the
 * stride check and dedupes internally, so both pointer-tracking modes below
 * (desktop's window-level mouse listener, mobile's local touch listener) can
 * call it on every raw move event without either flooding the mask or having
 * to reimplement the spacing logic twice.
 */
/**
 * Exported so other hovering-reveals-colour treatments (currently
 * components/what-to-expect/ExpectHeroArtwork.tsx) share this one dab
 * lifecycle instead of a second copy. `lifeMs` is the one knob most callers
 * want: a photo hero that should snap back to grayscale within a couple of
 * seconds of the cursor leaving wants a much shorter life than this hero's
 * 14s hold. `stride` and `maxBlobs` default to the values tuned for this
 * scene's own viewBox scale and are close enough to right for any similarly
 * sized coordinate space that most callers can leave them alone.
 */
export function usePaintDabs({
  lifeMs = LIFE_MS,
  stride = STRIDE,
  maxBlobs = MAX_BLOBS,
}: { lifeMs?: number; stride?: number; maxBlobs?: number } = {}) {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const paint = (x: number, y: number) => {
    if (!last.current) {
      last.current = { x, y };
      return;
    }
    if (Math.hypot(x - last.current.x, y - last.current.y) < stride) return;
    last.current = { x, y };

    const blob: Blob = { id: idRef.current++, x, y };
    setBlobs((prev) => [...(prev.length >= maxBlobs ? prev.slice(1) : prev), blob]);

    const timer = setTimeout(() => {
      setBlobs((prev) => prev.filter((b) => b.id !== blob.id));
      timers.current.delete(timer);
    }, lifeMs);
    timers.current.add(timer);
  };

  /** Drops the stride anchor without painting - see each caller's reset case. */
  const resetStride = () => {
    last.current = null;
  };

  return { blobs, paint, resetStride };
}

export function HeroColoringScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const maskId = `${uid}-reveal`;
  const blurId = `${uid}-reveal-blur`;

  const { blobs, paint, resetStride } = usePaintDabs();
  /**
   * Starts true so the server and the client's first render agree: the mask
   * is present, holding no dabs, which is the sketch. The effect turns it off
   * only where colouring cannot work, and then the paint shows in full.
   */
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const el = ref.current;
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

      const { x, y } = toViewBoxCover(px, py, rect, VB_W, VB_H, VB_MIN_Y);
      paint(x, y);
    };

    // Leaving the document drops the anchor so coming back does not paint a
    // dab at the far end of a jump the cursor never made.
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", resetStride);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", resetStride);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      // Full-bleed cover-crop only works once the hero is wide relative to
      // its height - see the module comment on the 800x450 version this
      // replaced. Below sm the hero is tall and narrow, cover-crop keeps a
      // vertical sliver near the centre of a 1600-wide drawing, and every
      // element here sits far enough from centre to fall outside it: the
      // house and the sun/rainbow group are simply gone at phone width. This
      // instance is hidden there in favour of HeroColoringSceneMobile, a
      // compact composition sized to actually fit.
      className={cn("absolute inset-0 hidden sm:block", className)}
    >
      {/* The sketch: always visible, everywhere. It is the picture on a day
          nobody moves the mouse over it. */}
      <svg
        viewBox={`0 ${VB_MIN_Y} ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <SceneOutline />
      </svg>

      {/* The paint, shown only where dabs have been laid down. */}
      <svg
        viewBox={`0 ${VB_MIN_Y} ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter
            id={blurId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={BLOB_BLUR} />
          </filter>

          {/* userSpaceOnUse, with a region generous enough that a dab near an
              edge still has room for its blur to fall off inside the mask. */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-BLOB_R * 2}
            y={VB_MIN_Y - BLOB_R * 2}
            width={VB_W + BLOB_R * 4}
            height={VB_H + BLOB_R * 4}
          >
            <g filter={`url(#${blurId})`}>
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

        <g mask={interactive ? `url(#${maskId})` : undefined}>
          <ScenePainted />
        </g>
      </svg>
    </div>
  );
}

const MOBILE_VB_W = 500;
const MOBILE_VB_H = 300;
/** Smaller than the desktop dab: the whole picture is a third the size. */
const MOBILE_BLOB_R = 60;
const MOBILE_BLOB_BLUR = 16;

/**
 * The house, sun, rainbow and two clouds, placed on the mobile scene's own
 * 500x300 canvas. Shared between the outline pass and the painted pass -
 * `painted` is threaded straight through to every shape - so the two are
 * guaranteed to draw the same picture at the same spots, the same guarantee
 * SceneOutline/ScenePainted give each other on desktop.
 *
 * Each group is `translate(target) scale(s) translate(-center)`: move the
 * shape's own centre to the origin first, scale it, then move the result to
 * where it belongs here. Reading the transform right-to-left is what keeps
 * this tractable - placing a shape drawn in the desktop scene's much larger
 * coordinate space (the house sits at x=136-414 there, centre (275, 292))
 * without that normalising step means solving for a translate that both
 * scales and repositions in one number, which is exactly how the first
 * version of this landed everything off-canvas.
 */
function MobileSceneGroup({ painted }: { painted: boolean }) {
  return (
    <>
      <g transform="translate(120 60) scale(0.34) translate(-1130 -290)">
        <Rainbow painted={painted} />
      </g>
      <g transform="translate(120 190) scale(0.5) translate(-275 -292)">
        <House
          painted={painted}
          wallGradientId="scene-wall-m"
          roofGradientId="scene-roof-m"
        />
      </g>
      <g transform="translate(390 62) scale(0.55) translate(-1300 -150)">
        <Sun painted={painted} gradientId="scene-sun-m" />
      </g>
      <g transform="translate(58 30) scale(0.4) translate(-72 -30)">
        <Cloud painted={painted} />
      </g>
      <g transform="translate(430 20) scale(0.3) translate(-72 -30)">
        <Cloud painted={painted} />
      </g>
      {/* Same three figures as the desktop scene (see Figures / FIGURE_PLACEMENTS),
          scaled and moved onto the grass just right of the house - its feet
          land at mobile (120, 244), right edge at x=203, so x=225 upward is
          clear of the walls. */}
      <g transform="translate(225 244) scale(0.42)">
        <Figures painted={painted} />
      </g>
    </>
  );
}

/**
 * The phone version: the same house/sky/rainbow painting as the desktop
 * scene, laid out on its own compact viewBox close to a phone's own aspect
 * ratio (5:3) so every element fits with room around it - no cover-crop, no
 * slicing. Sits in normal flow under the headline rather than full-bleed
 * behind it: a phone screen has no spare width for text to sit over art and
 * stay readable, so this is a calm band the copy introduces.
 *
 * Interactive the same way the desktop scene is - colour a finger drags
 * across accumulates and fades, via the same usePaintDabs engine - except
 * the pointer source is local (the element's own touchmove/pointermove) and
 * the fit is `meet` rather than `cover`, since this canvas is never cropped.
 * Falls back to fully painted, same as desktop, under reduced motion; touch
 * itself is not gated the way desktop's mouse-only listener gates hover,
 * because touch is the *primary* input this instance exists for.
 */
export function HeroColoringSceneMobile({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const maskId = `${uid}-reveal-m`;
  const blurId = `${uid}-reveal-blur-m`;

  const { blobs, paint, resetStride } = usePaintDabs();
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (calm.matches) {
      setInteractive(false);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
        resetStride();
        return;
      }
      const { x, y } = toViewBoxMeet(px, py, rect, MOBILE_VB_W, MOBILE_VB_H);
      paint(x, y);
    };

    // touchmove does not fire pointermove-compatible coordinates on every
    // browser in the same way, but it does dispatch pointermove alongside it
    // on every engine this site targets, so one listener covers touch and
    // mouse alike; only the leave/reset differs by input, and this scene has
    // no equivalent of "the pointer moved off the section" worth wiring for
    // touch, which lifts rather than hovering away.
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", resetStride);
    el.addEventListener("pointerup", resetStride);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", resetStride);
      el.removeEventListener("pointerup", resetStride);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative touch-pan-y sm:hidden", className)}
    >
      <svg viewBox={`0 0 ${MOBILE_VB_W} ${MOBILE_VB_H}`} className="block h-auto w-full">
        <SceneOutlineMobile />
      </svg>

      <svg
        viewBox={`0 0 ${MOBILE_VB_W} ${MOBILE_VB_H}`}
        className="absolute inset-0 block h-full w-full"
      >
        <defs>
          <filter
            id={blurId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={MOBILE_BLOB_BLUR} />
          </filter>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-MOBILE_BLOB_R * 2}
            y={-MOBILE_BLOB_R * 2}
            width={MOBILE_VB_W + MOBILE_BLOB_R * 4}
            height={MOBILE_VB_H + MOBILE_BLOB_R * 4}
          >
            <g filter={`url(#${blurId})`}>
              {blobs.map((b) => (
                <circle
                  key={b.id}
                  cx={b.x}
                  cy={b.y}
                  r={MOBILE_BLOB_R}
                  fill="#fff"
                  className="coloring-blob"
                  style={{ ["--blob-life" as string]: `${LIFE_MS}ms` }}
                />
              ))}
            </g>
          </mask>

          <linearGradient id="scene-sky-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B7D8EC" />
            <stop offset="100%" stopColor="#E9F4FA" />
          </linearGradient>
          <linearGradient id="scene-grass-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FC155" />
            <stop offset="100%" stopColor="#5C9130" />
          </linearGradient>
          {/* House and Sun (painted) take gradientId props for exactly this:
              this <svg> mounts alongside the desktop scene's (sm:hidden, not
              unmounted), and reusing the unsuffixed ids would be a duplicate
              id in the document rather than a locally scoped one - which is
              what silently broke the house here the first time. */}
          <linearGradient id="scene-roof-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EA4A6B" />
            <stop offset="100%" stopColor="#C22B4B" />
          </linearGradient>
          <linearGradient id="scene-wall-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDF0DC" />
            <stop offset="100%" stopColor="#F2A63B" />
          </linearGradient>
          <radialGradient id="scene-sun-m" cx="0.35" cy="0.3" r="0.75">
            <stop offset="0%" stopColor="#FDE7A8" />
            <stop offset="100%" stopColor="#F2A63B" />
          </radialGradient>
        </defs>

        <g mask={interactive ? `url(#${maskId})` : undefined}>
          <path
            d="M0 0 L500 0 L500 246 Q 250 234 0 248 Z"
            fill="url(#scene-sky-m)"
          />
          <path
            d="M0 248 Q 250 234 500 246 L500 300 L0 300 Z"
            fill="url(#scene-grass-m)"
          />
          <MobileSceneGroup painted />
        </g>
      </svg>
    </div>
  );
}

/** The mobile sketch layer - same placements as MobileSceneGroup, unpainted. */
function SceneOutlineMobile() {
  return (
    <g fill="none" stroke="#3E2A21" strokeLinecap="round" strokeLinejoin="round">
      <g strokeOpacity={0.6} strokeWidth={2.5}>
        <MobileSceneGroup painted={false} />
        <path d="M0 248 Q 250 234 500 246" />
      </g>
    </g>
  );
}

/**
 * The line-drawing layer: one stroke weight, cocoa, the way a child's pencil
 * sketch reads before the crayons come out. Same geometry as ScenePainted -
 * two skins over one drawing, which is what makes the reveal read as
 * colouring rather than as a crossfade between unrelated art.
 *
 * The sky has no outline, because a sky is not a thing you draw an edge
 * around; it is the one element that exists only in the painted layer, and
 * washing it in is most of what makes the reveal feel like painting.
 */
function SceneOutline() {
  return (
    <g fill="none" stroke="#3E2A21" strokeLinecap="round" strokeLinejoin="round">
      <g strokeOpacity={0.6} strokeWidth={5}>
        <Clouds />
        <Sun />
        <Rainbow />

        {/* Ground line, full width */}
        <path d="M0 398 Q 800 372 1600 396" />
      </g>

      {/* The house alone gets a bolder line: it sits under the heaviest part
          of the left-side reading scrim (see the gradient in app/about/page.tsx),
          and at the rest of this group's weight it all but disappeared there. */}
      <g strokeOpacity={0.78} strokeWidth={6}>
        <House />
      </g>

      <g strokeOpacity={0.6} strokeWidth={4} transform="translate(500 400)">
        <Figures />
      </g>
    </g>
  );
}

/**
 * The painted layer. The rainbow and the house take the brand triad; the sky
 * is the one hue on the site that is not in the palette at all, because a
 * child's painting of a house has a blue sky in it and nothing else reads as
 * one. It is kept pale and warm-leaning so it sits against cream rather than
 * fighting it, and it only ever appears inside the reveal.
 */
function ScenePainted() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B7D8EC" />
          <stop offset="100%" stopColor="#E9F4FA" />
        </linearGradient>
        <linearGradient id="scene-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FC155" />
          <stop offset="100%" stopColor="#5C9130" />
        </linearGradient>
        <linearGradient id="scene-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EA4A6B" />
          <stop offset="100%" stopColor="#C22B4B" />
        </linearGradient>
        <linearGradient id="scene-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDF0DC" />
          <stop offset="100%" stopColor="#F2A63B" />
        </linearGradient>
        <radialGradient id="scene-sun" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#FDE7A8" />
          <stop offset="100%" stopColor="#F2A63B" />
        </radialGradient>
      </defs>

      {/* Sky, behind everything, down to the horizon */}
      <path
        d={`M0 ${VB_MIN_Y} L1600 ${VB_MIN_Y} L1600 396 Q 800 372 0 398 Z`}
        fill="url(#scene-sky)"
      />

      {/* Ground */}
      <path d="M0 398 Q 800 372 1600 396 L1600 450 L0 450 Z" fill="url(#scene-grass)" />

      <Clouds painted />
      <Sun painted />
      <Rainbow painted />
      <House painted />
      <g transform="translate(500 400)">
        <Figures painted />
      </g>
    </g>
  );
}

/**
 * One lumpy cloud in its own ~160x60 box, placed by the caller's transform.
 * Drawn as a single closed path rather than a cluster of circles, so the
 * sketch layer outlines the silhouette instead of every internal seam.
 */
const CLOUD_PATH =
  "M 18 60 C 4 60, -2 46, 8 37 C 2 24, 16 12, 30 17 C 38 4, 62 2, 72 15 " +
  "C 84 4, 108 8, 112 24 C 128 22, 140 34, 134 47 C 146 50, 144 60, 130 60 Z";

/**
 * Desktop only - the mobile scene places its own two clouds directly (see
 * MobileSceneGroup). These sit up in the sky added by VB_MIN_Y, which is
 * negative territory: without moving them, all three would have stayed
 * bunched along the horizon with a bare band of sky above them.
 */
const CLOUD_PLACEMENTS = [
  { x: 60, y: -330, s: 0.85 },
  { x: 900, y: -386, s: 0.8 },
  { x: 1280, y: -150, s: 1 },
];

/** One cloud, undrawn - its own path spans roughly x=-2..146, y=2..60. */
function Cloud({ painted = false }: { painted?: boolean }) {
  return (
    <path
      d={CLOUD_PATH}
      fill={painted ? "#FFFFFF" : "none"}
      fillOpacity={painted ? 0.92 : undefined}
      stroke={painted ? "#FFFFFF" : undefined}
      strokeWidth={painted ? 2 : undefined}
    />
  );
}

/** All three, at their desktop placements. */
function Clouds({ painted = false }: { painted?: boolean }) {
  return (
    <>
      {CLOUD_PLACEMENTS.map((c) => (
        <g key={`${c.x}-${c.y}`} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
          <Cloud painted={painted} />
        </g>
      ))}
    </>
  );
}

/** The sun, tucked between the rainbow's arch and the right edge. */
const SUN_RAYS =
  "M 1300 94 L 1300 80 M 1300 206 L 1300 220 M 1356 150 L 1370 150 M 1244 150 L 1230 150 " +
  "M 1340 190 L 1349 199 M 1260 110 L 1251 101 M 1260 190 L 1251 199 M 1340 110 L 1349 101";

/**
 * `gradientId` defaults to the shared name (`scene-sun`, `scene-wall`,
 * `scene-roof` below) because the full desktop scene defines those once in
 * its own `<defs>` and every shape in it just references them. The mobile
 * scene mounts a second, independent `<svg>` at the same time - sm:hidden,
 * not unmounted - and SVG ids are resolved against the whole document, so a
 * second `<defs>` reusing those names is a duplicate id, not a local scope.
 * It passes its own suffixed ids in instead of colliding with the desktop
 * scene's.
 */
function Sun({ painted = false, gradientId = "scene-sun" }: { painted?: boolean; gradientId?: string }) {
  if (!painted) {
    return (
      <>
        <circle cx="1300" cy="150" r="44" />
        <path d={SUN_RAYS} />
      </>
    );
  }
  return (
    <>
      <circle cx="1300" cy="150" r="44" fill={`url(#${gradientId})`} />
      <path d={SUN_RAYS} fill="none" stroke="#F2A63B" strokeWidth={6} strokeLinecap="round" />
    </>
  );
}

/**
 * Three arcs over the house, echoing the logo's own curvature and order.
 * Centred further right than the house (feet at x=910-1350, house at
 * x=170-440), so the two do not compete for the same quiet strip the copy
 * needs - and so the house is not the one element sitting directly under the
 * heaviest part of the reading scrim on the left.
 */
const RAINBOW_ARCS = [
  { d: "M 910 400 A 220 220 0 0 1 1350 400", color: "#E23A5E" },
  { d: "M 960 400 A 170 170 0 0 1 1300 400", color: "#F2A63B" },
  { d: "M 1010 400 A 120 120 0 0 1 1250 400", color: "#6FA83C" },
];

function Rainbow({ painted = false }: { painted?: boolean }) {
  return (
    <>
      {RAINBOW_ARCS.map((a) => (
        <path
          key={a.color}
          d={a.d}
          fill="none"
          stroke={painted ? a.color : undefined}
          strokeWidth={painted ? 26 : 5}
        />
      ))}
    </>
  );
}

/**
 * A stick figure: circle head, a single body line, two arm strokes, two leg
 * strokes - the crayon-drawing vocabulary this whole scene is drawn in, not
 * a rendered person. Deliberately not a countable cast: DifferentiatorIcon.tsx
 * documents the same rule this scene follows - no mark on this site may
 * depict a specific number of children, because the brief states no capacity
 * or ratio and a fixed count in art reads as a claim about how many the house
 * cares for. FIGURE_PLACEMENTS below is one adult and two children, drawn
 * small and loosely grouped on the grass rather than lined up and counted -
 * "children playing in the yard," not a roster.
 *
 * Drawn standing at (0, 0), feet at y=0, so `h` (head-to-feet height) is the
 * only number a caller needs to place and scale one: translate to where the
 * feet should land, no further normalising required.
 */
function StickFigure({ h, painted = false, tint }: { h: number; painted?: boolean; tint?: string }) {
  const headR = h * 0.14;
  const neckY = -h + headR * 2;
  const hipY = -h * 0.42;
  const armY = -h * 0.72;
  const armSpan = h * 0.24;
  const legSpan = h * 0.16;

  return (
    <g strokeLinecap="round">
      <circle
        cx="0"
        cy={-h + headR}
        r={headR}
        fill={painted ? tint : "none"}
        fillOpacity={painted ? 0.85 : undefined}
      />
      <path
        d={`M0 ${neckY.toFixed(1)} L0 ${hipY.toFixed(1)} ` +
          `M0 ${armY.toFixed(1)} L${-armSpan.toFixed(1)} ${(armY + h * 0.14).toFixed(1)} ` +
          `M0 ${armY.toFixed(1)} L${armSpan.toFixed(1)} ${(armY + h * 0.14).toFixed(1)} ` +
          `M0 ${hipY.toFixed(1)} L${-legSpan.toFixed(1)} 0 ` +
          `M0 ${hipY.toFixed(1)} L${legSpan.toFixed(1)} 0`}
        fill="none"
        stroke={painted ? tint : undefined}
      />
    </g>
  );
}

/**
 * One adult, two children, loose on a shared ground line - small enough, and
 * few enough, to read as figures animating the yard rather than as a stated
 * headcount. Relative to the *group's* own origin (the adult's feet at
 * (0, 0)), not to either scene's absolute coordinates, so both the desktop
 * placement (translate(500 400), full scale) and the mobile one (translate
 * (225 244) scale(0.42), on the grass beside the house) are just a wrapping
 * transform on the same group - the same normalise-then-place pattern
 * MobileSceneGroup uses for the house, sun and rainbow.
 */
const FIGURE_PLACEMENTS = [
  { x: 0, y: 0, h: 78, tint: "#C22B4B" },
  { x: 90, y: 0, h: 46, tint: "#4E7A28" },
  { x: 150, y: 2, h: 42, tint: "#D98A20" },
] as const;

function Figures({ painted = false }: { painted?: boolean }) {
  return (
    <>
      {FIGURE_PLACEMENTS.map((f) => (
        <g key={`${f.x}-${f.y}`} transform={`translate(${f.x} ${f.y})`}>
          <StickFigure h={f.h} painted={painted} tint={f.tint} />
        </g>
      ))}
    </>
  );
}

/**
 * Moved left and enlarged from the first version (was x=260-470, now
 * x=170-440) and given a bolder stroke in the outline layer (see
 * SceneOutline) - it used to sit dead centre under the heaviest part of the
 * left-side reading scrim and read as barely-there next to the rainbow.
 */
function House({
  painted = false,
  wallGradientId = "scene-wall",
  roofGradientId = "scene-roof",
}: {
  painted?: boolean;
  wallGradientId?: string;
  roofGradientId?: string;
}) {
  if (!painted) {
    return (
      <>
        <path d="M 170 296 L 170 400 L 380 400 L 380 296 Z" />
        <path d="M 144 305 L 275 200 L 406 305" />
        <path d="M 254 400 L 254 332 L 296 332 L 296 400" />
        <path d="M 190 320 L 190 354 L 226 354 L 226 320 Z" />
        <path d="M 324 320 L 324 354 L 360 354 L 360 320 Z" />
      </>
    );
  }
  return (
    <>
      <path d="M 170 296 L 170 400 L 380 400 L 380 296 Z" fill={`url(#${wallGradientId})`} />
      <path
        d="M 136 310 L 275 185 L 414 310 L 380 310 L 275 216 L 170 310 Z"
        fill={`url(#${roofGradientId})`}
      />
      <path d="M 254 400 L 254 332 L 296 332 L 296 400 Z" fill="#6B5245" />
      <path d="M 190 320 L 190 354 L 226 354 L 226 320 Z" fill="#FCE7EC" fillOpacity={0.9} />
      <path d="M 324 320 L 324 354 L 360 354 L 360 320 Z" fill="#FCE7EC" fillOpacity={0.9} />
      <g stroke="#6B5245" strokeWidth={2.5} fill="none">
        <path d="M 190 337 L 226 337 M 208 320 L 208 354" />
        <path d="M 324 337 L 360 337 M 342 320 L 342 354" />
      </g>
    </>
  );
}
