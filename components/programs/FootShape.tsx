"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";
import { PUZZLE_PIECES, type FootRegion } from "./checklistPieces";
import {
  TONE_STROKE,
  TONE_GHOST_FILL,
  PIECE_TONE_BY_ID,
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
  FOOT_VIEWBOX,
} from "./footGeometry";

/**
 * The puzzle board: a real anatomical footprint, assembled from the shared
 * geometry in footGeometry.ts, with six separately-fillable regions - a
 * jigsaw board rather than one big drop zone.
 *
 * Which piece landed where, and whether a drag is currently hovering the
 * board, are both decided by the parent (FootprintChecklist.tsx) and passed
 * in as plain props (`filled`, `dropActive`) - this component no longer
 * listens for drag events itself. Placement used to be driven by native
 * HTML5 drag-and-drop (`onDragOver`/`onDrop`), which never fires for touch
 * input; the whole puzzle now runs on one Pointer Events based drag
 * implementation (see PuzzleTile.tsx) that works the same for mouse, touch,
 * and pen, so the board's only job is to render whatever state it's told.
 *
 * Unfilled regions show a dashed outline of their own shape, tinted with a
 * faint wash of the color that eventually belongs there - an empty
 * puzzle-board slot a visitor can read before they even pick up a piece,
 * not just a gap in one shared outline. A filled region switches to a solid
 * gradient fill in that piece's intentionally assigned brand color (passed
 * in via `filled`), producing the same balanced footprint on every visit.
 */

const REGION_PIECE: Record<FootRegion, string> = PUZZLE_PIECES.reduce(
  (acc, piece) => {
    acc[piece.region] = piece.id;
    return acc;
  },
  {} as Record<FootRegion, string>,
);

interface RegionSlotProps {
  region: FootRegion;
  tone: PieceTone | null;
  ghostTone: PieceTone;
  gradPrefix: string;
  snap: boolean;
  snapKey: number;
  children: (state: {
    type: "sole" | "toe";
    snap: boolean;
    snapKey: number;
  }) => React.ReactNode;
  type: "sole" | "toe";
}

/** One region's shell: shared snap-animation wiring for both the sole bands and the toe groups. */
function RegionSlot({ tone, children, type, snap, snapKey }: RegionSlotProps) {
  const filled = tone !== null;
  return (
    <g className={filled ? undefined : "cursor-default"} style={{ pointerEvents: "none" }}>
      {children({ type, snap, snapKey })}
    </g>
  );
}

function SoleSlot({
  band,
  region,
  tone,
  ghostTone,
  gradPrefix,
  snap,
  snapKey,
}: {
  band: { y: number; height: number; x?: number; width?: number };
  region: FootRegion;
  tone: PieceTone | null;
  ghostTone: PieceTone;
  gradPrefix: string;
  snap: boolean;
  snapKey: number;
}) {
  const clipId = `sole-slot-${gradPrefix}-${region}`;
  const bandX = band.x ?? 0;
  const bandWidth = band.width ?? 41;
  return (
    <RegionSlot region={region} tone={tone} ghostTone={ghostTone} gradPrefix={gradPrefix} snap={snap} snapKey={snapKey} type="sole">
      {({ snap, snapKey }) => (
        <>
          <clipPath id={clipId}>
            <rect x={bandX} y={band.y} width={bandWidth} height={band.height} />
          </clipPath>
          {tone ? (
            <g key={snap ? snapKey : undefined} className={snap ? "foot-puzzle-piece-snap" : undefined}>
              <path
                d={SOLE_D}
                fillRule="evenodd"
                fill={`url(#${toneGradientId(gradPrefix, tone)})`}
                className={TONE_STROKE[tone]}
                strokeWidth="0.9"
                clipPath={`url(#${clipId})`}
              />
              <path
                d={SOLE_D}
                fillRule="evenodd"
                fill={`url(#${sheenGradientId(gradPrefix)})`}
                clipPath={`url(#${clipId})`}
              />
            </g>
          ) : (
            <path
              d={SOLE_D}
              fillRule="evenodd"
              className={cn(TONE_GHOST_FILL[ghostTone], "stroke-cocoa/45")}
              strokeWidth="0.9"
              strokeDasharray="1.6 1.3"
              clipPath={`url(#${clipId})`}
            />
          )}
        </>
      )}
    </RegionSlot>
  );
}

function ToeSlot({
  region,
  tone,
  ghostTone,
  gradPrefix,
  snap,
  snapKey,
  ellipses,
}: {
  region: FootRegion;
  tone: PieceTone | null;
  ghostTone: PieceTone;
  gradPrefix: string;
  snap: boolean;
  snapKey: number;
  ellipses: readonly { cx: number; cy: number; rx: number; ry: number; rotate: number }[];
}) {
  return (
    <RegionSlot region={region} tone={tone} ghostTone={ghostTone} gradPrefix={gradPrefix} snap={snap} snapKey={snapKey} type="toe">
      {({ snap, snapKey }) => (
        <>
          {tone ? (
            <g key={snap ? snapKey : undefined} className={snap ? "foot-puzzle-piece-snap" : undefined}>
              {ellipses.map((t) => (
                <g key={t.cx}>
                  <ellipse
                    cx={t.cx}
                    cy={t.cy}
                    rx={t.rx}
                    ry={t.ry}
                    transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
                    fill={`url(#${toneGradientId(gradPrefix, tone)})`}
                    className={TONE_STROKE[tone]}
                    strokeWidth="0.9"
                  />
                  <ellipse
                    cx={t.cx}
                    cy={t.cy}
                    rx={t.rx}
                    ry={t.ry}
                    transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
                    fill={`url(#${sheenGradientId(gradPrefix)})`}
                  />
                </g>
              ))}
            </g>
          ) : (
            ellipses.map((t) => (
              <ellipse
                key={t.cx}
                cx={t.cx}
                cy={t.cy}
                rx={t.rx}
                ry={t.ry}
                transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
                className={cn(TONE_GHOST_FILL[ghostTone], "stroke-cocoa/45")}
                strokeWidth="0.9"
                strokeDasharray="1.4 1.1"
              />
            ))
          )}
        </>
      )}
    </RegionSlot>
  );
}

export const FootShape = forwardRef<SVGSVGElement, {
  /** Each region's fill tone, or null while its piece is still in the tray. */
  filled: Record<FootRegion, PieceTone | null>;
  /** True while a dragged piece's pointer is currently over the board. */
  dropActive: boolean;
  /** The most recently placed piece gets a short physical snap animation. */
  snappedPiece: string | null;
  snapKey: number;
  className?: string;
}>(function FootShape({ filled, dropActive, snappedPiece, snapKey, className }, ref) {
  const gradPrefix = useId().replace(/:/g, "");
  const ghostTone = (region: FootRegion) => PIECE_TONE_BY_ID[REGION_PIECE[region]] ?? "pink";

  return (
    <svg
      ref={ref}
      viewBox={FOOT_VIEWBOX}
      className={cn(
        "foot-shape-svg block transition-[filter,transform] duration-200",
        dropActive && "foot-shape-drop-active",
        className,
      )}
      aria-hidden="true"
    >
      <defs>
        <ToneGradientDefs prefix={gradPrefix} />
      </defs>

      {/* The sole's own base color, so a still-empty region reads as a
          recessed slot rather than a hole in the page. */}
      <path d={SOLE_D} fillRule="evenodd" className="fill-white/80" />

      <SoleSlot band={BALL_LEFT_BAND} region="ballLeft" tone={filled.ballLeft} ghostTone={ghostTone("ballLeft")} gradPrefix={gradPrefix} snap={snappedPiece === REGION_PIECE.ballLeft} snapKey={snapKey} />
      <SoleSlot band={BALL_RIGHT_BAND} region="ballRight" tone={filled.ballRight} ghostTone={ghostTone("ballRight")} gradPrefix={gradPrefix} snap={snappedPiece === REGION_PIECE.ballRight} snapKey={snapKey} />

      {/* A quiet puzzle seam makes the two food pieces read as separate cuts
          while empty and as one deliberately joined band when complete. */}
      <line
        x1={BALL_RIGHT_BAND.x}
        x2={BALL_RIGHT_BAND.x}
        y1={BALL_RIGHT_BAND.y + 0.35}
        y2="23.15"
        className={
          filled.ballLeft && filled.ballRight ? "stroke-white/75" : "stroke-cocoa/45"
        }
        strokeWidth="0.72"
        strokeDasharray={filled.ballLeft && filled.ballRight ? undefined : "1.2 1.05"}
      />
      <SoleSlot band={ARCH_BAND} region="arch" tone={filled.arch} ghostTone={ghostTone("arch")} gradPrefix={gradPrefix} snap={snappedPiece === REGION_PIECE.arch} snapKey={snapKey} />
      <SoleSlot band={HEEL_BAND} region="heel" tone={filled.heel} ghostTone={ghostTone("heel")} gradPrefix={gradPrefix} snap={snappedPiece === REGION_PIECE.heel} snapKey={snapKey} />

      <ToeSlot region="toeOne" tone={filled.toeOne} ghostTone={ghostTone("toeOne")} gradPrefix={gradPrefix} snap={snappedPiece === REGION_PIECE.toeOne} snapKey={snapKey} ellipses={[BIG_TOE]} />
      <ToeSlot region="toeTwo" tone={filled.toeTwo} ghostTone={ghostTone("toeTwo")} gradPrefix={gradPrefix} snap={snappedPiece === REGION_PIECE.toeTwo} snapKey={snapKey} ellipses={OTHER_TOES} />

      {/* The whole-foot outline, drawn last and always at full strength, so
          the silhouette reads as one foot even where two dashed slots meet. */}
      <path d={SOLE_D} fillRule="evenodd" fill="none" className="stroke-cocoa/65" strokeWidth="1.05" />
    </svg>
  );
});
