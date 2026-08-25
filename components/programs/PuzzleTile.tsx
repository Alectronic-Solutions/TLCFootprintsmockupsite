"use client";

import { useId, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/cn";
import type { FootRegion } from "./checklistPieces";
import {
  TONE_STROKE,
  TONE_DOT,
  ToneGradientDefs,
  toneGradientId,
  sheenGradientId,
  type PieceTone,
} from "./pieceTones";
import {
  SOLE_D,
  BALL_LEFT_BAND,
  BALL_RIGHT_BAND,
  ARCH_BAND,
  HEEL_BAND,
  BIG_TOE,
  OTHER_TOES,
  REGION_VIEWBOX,
} from "./footGeometry";

export type { PieceTone } from "./pieceTones";

/**
 * Each region's own natural width:height ratio, read straight off
 * REGION_VIEWBOX in footGeometry.ts. The lower sole slices are wide and
 * short, the divided ball pieces are compact, and the toe regions are closer
 * to square. A fixed *square*
 * icon box was the first version of this component, and it was a real bug,
 * not a style choice: "meet" letterboxes a wide viewBox inside a square
 * viewport, so all three sole pieces rendered as similarly-proportioned
 * short blobs in the middle of a mostly-empty square - none of them read as
 * a distinct slice of a foot. Sizing the box itself to each region's ratio
 * is what lets a piece fill its tray slot and keep its own real shape.
 */
const REGION_RATIO: Record<FootRegion, number> = {
  ballLeft: 13.3 / 11.2,
  ballRight: 13.5 / 11.2,
  arch: 25 / 11.2,
  heel: 25 / 11.2,
  toeOne: 7.8 / 9.2,
  toeTwo: 18.2 / 11.8,
};

/**
 * The piece's own cutout, large and solid - the dominant thing on the tile,
 * cropped from the exact same path and ellipses FootShape.tsx assembles the
 * board from, so a tile visibly *is* a slice of that picture and not a
 * separate icon standing in for it. Sized off its own aspect ratio rather
 * than a fixed box - see REGION_RATIO above - so pieces are chunky where
 * they are naturally wide and tall where they are naturally tall, the way
 * real jigsaw pieces are never uniform.
 *
 * Exported so FootprintChecklist.tsx can reuse the exact same cutout for the
 * floating clone that follows a finger/cursor while a piece is being dragged.
 */
export function RegionCutout({
  region,
  tone,
  style,
  className,
}: {
  region: FootRegion;
  tone: PieceTone;
  style?: CSSProperties;
  className?: string;
}) {
  const stroke = TONE_STROKE[tone];
  const rawId = useId().replace(/:/g, "");
  const clipId = `clip-${rawId}`;
  const gradId = toneGradientId(rawId, tone);
  const sheenId = sheenGradientId(rawId);

  if (region === "toeOne") {
    return (
      <svg
        viewBox={REGION_VIEWBOX.toeOne}
        style={style}
        className={cn("max-w-full drop-shadow-sm", className)}
        aria-hidden="true"
      >
        <defs>
          <ToneGradientDefs prefix={rawId} />
        </defs>
        <ellipse
          cx={BIG_TOE.cx}
          cy={BIG_TOE.cy}
          rx={BIG_TOE.rx}
          ry={BIG_TOE.ry}
          transform={`rotate(${BIG_TOE.rotate} ${BIG_TOE.cx} ${BIG_TOE.cy})`}
          fill={`url(#${gradId})`}
          className={stroke}
          strokeWidth="0.8"
        />
        <ellipse
          cx={BIG_TOE.cx}
          cy={BIG_TOE.cy}
          rx={BIG_TOE.rx}
          ry={BIG_TOE.ry}
          transform={`rotate(${BIG_TOE.rotate} ${BIG_TOE.cx} ${BIG_TOE.cy})`}
          fill={`url(#${sheenId})`}
        />
      </svg>
    );
  }
  if (region === "toeTwo") {
    return (
      <svg
        viewBox={REGION_VIEWBOX.toeTwo}
        style={style}
        className={cn("max-w-full drop-shadow-sm", className)}
        aria-hidden="true"
      >
        <defs>
          <ToneGradientDefs prefix={rawId} />
        </defs>
        {OTHER_TOES.map((t) => (
          <g key={t.cx}>
            <ellipse
              cx={t.cx}
              cy={t.cy}
              rx={t.rx}
              ry={t.ry}
              transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
              fill={`url(#${gradId})`}
              className={stroke}
              strokeWidth="0.8"
            />
            <ellipse
              cx={t.cx}
              cy={t.cy}
              rx={t.rx}
              ry={t.ry}
              transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
              fill={`url(#${sheenId})`}
            />
          </g>
        ))}
      </svg>
    );
  }
  // ball halves / arch / heel: a cropped slice of the shared sole path.
  const band: { y: number; height: number; x?: number; width?: number } =
    region === "ballLeft"
      ? BALL_LEFT_BAND
      : region === "ballRight"
        ? BALL_RIGHT_BAND
        : region === "arch"
          ? ARCH_BAND
          : HEEL_BAND;
  const bandX = band.x ?? 0;
  const bandWidth = band.width ?? 41;

  return (
    <svg
      viewBox={REGION_VIEWBOX[region]}
      style={style}
      className={cn("max-w-full drop-shadow-sm", className)}
      aria-hidden="true"
    >
      <defs>
        <ToneGradientDefs prefix={rawId} />
        <clipPath id={clipId}>
          <rect x={bandX} y={band.y} width={bandWidth} height={band.height} />
        </clipPath>
      </defs>
      <path
        d={SOLE_D}
        fillRule="evenodd"
        fill={`url(#${gradId})`}
        className={stroke}
        strokeWidth="0.8"
        clipPath={`url(#${clipId})`}
      />
      <path
        d={SOLE_D}
        fillRule="evenodd"
        fill={`url(#${sheenId})`}
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

/** How far a pointer has to travel before a press counts as a drag rather than a tap. */
const DRAG_THRESHOLD_PX = 7;

/**
 * One puzzle piece in the tray: its own foot-region cutout, large and solid,
 * with its label as a caption underneath - one draggable, tappable piece,
 * intentionally left open on the tray rather than boxed into a card.
 *
 * Dragging is hand-rolled on the Pointer Events API rather than native HTML5
 * drag-and-drop, on purpose: native `draggable`/`dragstart` never fires for
 * touch input, so a phone visitor could tap a piece into place but never
 * actually drag one the way a mouse user could. Pointer Events fire
 * identically for mouse, touch, and pen, so this is one drag implementation
 * for every input, not a desktop feature with a tap fallback bolted on for
 * everyone else.
 *
 * A press that never travels past `DRAG_THRESHOLD_PX` is a tap and places
 * the piece immediately; a press that travels further reports its live
 * position up to `onDragMove`/`onDragEnd` so the parent (FootprintChecklist)
 * can render a floating clone and decide whether it lands on the foot. The
 * underlying `<button>` still handles Enter/Space for keyboard users.
 */
export function PuzzleTile({
  id,
  label,
  region,
  tone,
  dragging,
  onPlace,
  onDragStart,
  onDragMove,
  onDragEnd,
}: {
  id: string;
  label: string;
  region: FootRegion;
  tone: PieceTone;
  /** True while this exact piece is the one currently being pointer-dragged. */
  dragging: boolean;
  onPlace: () => void;
  onDragStart: (id: string, tone: PieceTone, region: FootRegion, x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
}) {
  const pointerState = useRef<{ id: number; startX: number; startY: number; dragged: boolean } | null>(null);
  // Guards against the browser's own synthetic `click` firing a second
  // placement right after a pointer-driven tap already placed the piece.
  const suppressNextClick = useRef(false);

  function handlePointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
    pointerState.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, dragged: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const state = pointerState.current;
    if (!state || state.id !== e.pointerId) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (!state.dragged && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      state.dragged = true;
      onDragStart(id, tone, region, e.clientX, e.clientY);
    }
    if (state.dragged) {
      onDragMove(e.clientX, e.clientY);
    }
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const state = pointerState.current;
    if (!state || state.id !== e.pointerId) return;
    pointerState.current = null;
    if (state.dragged) {
      onDragEnd(e.clientX, e.clientY);
    } else {
      suppressNextClick.current = true;
      onPlace();
    }
  }

  function handlePointerCancel(e: ReactPointerEvent<HTMLButtonElement>) {
    const state = pointerState.current;
    if (!state || state.id !== e.pointerId) return;
    pointerState.current = null;
    if (state.dragged) onDragEnd(e.clientX, e.clientY);
  }

  function handleClick() {
    // A pointer-driven tap already called onPlace(); this click is the
    // browser's own follow-up event for the same gesture. A keyboard
    // Enter/Space press never sets the flag, so it still places normally.
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }
    onPlace();
  }

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={handleClick}
      style={{ touchAction: "none" }}
      aria-label={`${label}. Tap to place this piece, or press and drag it onto the footprint.`}
      className={cn(
        "group flex min-h-[7.5rem] min-w-0 w-full cursor-grab select-none flex-col items-center justify-center gap-2 rounded-2xl border border-transparent p-2 text-center transition-[transform,filter,opacity,border-color] duration-200 sm:min-h-[8rem]",
        "hover:-translate-y-1 hover:border-cocoa/10 hover:bg-white/70 hover:drop-shadow-md active:translate-y-0 active:scale-[0.97] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-dark focus-visible:ring-offset-2",
        dragging && "pointer-events-none opacity-25",
      )}
    >
      <span
        aria-hidden="true"
        className="flex gap-1 opacity-40 transition-opacity group-hover:opacity-75"
      >
        <span className={cn("h-1 w-1 rounded-full", TONE_DOT[tone])} />
        <span className={cn("h-1 w-1 rounded-full", TONE_DOT[tone])} />
        <span className={cn("h-1 w-1 rounded-full", TONE_DOT[tone])} />
      </span>
      <RegionCutout
        region={region}
        tone={tone}
        style={{ height: "clamp(2.9rem, 13vw, 3.7rem)", width: "auto", aspectRatio: REGION_RATIO[region] }}
      />
      <span className="whitespace-pre-line text-sm font-bold leading-tight text-cocoa sm:text-base">
        {label}
      </span>
    </button>
  );
}
