"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PUZZLE_PIECES, type FootRegion } from "./checklistPieces";
import { pieceDndType, type PieceTone } from "./PuzzleTile";
import {
  SOLE_D,
  BALL_BAND,
  ARCH_BAND,
  HEEL_BAND,
  BIG_TOE,
  OTHER_TOES,
  FOOT_VIEWBOX,
} from "./footGeometry";

/**
 * The puzzle board: a real anatomical footprint, assembled from the shared
 * geometry in footGeometry.ts, with five separately-fillable, separately
 * droppable regions - a jigsaw board rather than one big drop zone.
 *
 * Each region only accepts the one piece cut to fit it. That's decided per
 * region, not centrally: every region computes its own expected piece id from
 * checklistPieces.ts and only calls `preventDefault()` on `dragover` - the
 * browser's own signal that a drop here is allowed - when the drag currently
 * over it carries a matching dataTransfer type
 * (`${PIECE_DND_TYPE}:${pieceId}`, set in PuzzleTile.tsx). A region that never
 * accepts the drag never receives a `drop` event, and the browser's native
 * snap-the-drag-image-back animation is what a visitor sees for "wrong spot"
 * - free, and not dependent on any React state timing.
 *
 * `types` (unlike `getData()`) is readable during `dragover`, which is the
 * whole trick: it lets a region validate *which* piece is hovering without
 * ever reading the drag payload early, which the drag-and-drop spec forbids
 * for anything but `dragstart` and `drop`.
 *
 * Unfilled regions show a dashed outline of their own shape - an empty
 * puzzle-board slot, not just a gap in one shared outline - so a visitor can
 * see where every piece belongs before picking one up. A filled region
 * switches to a solid fill in *that piece's own* tray color (passed in via
 * `filled`), so the completed foot is genuinely multi-colored rather than a
 * fixed palette repainted the same way every time.
 */

const REGION_PIECE: Record<FootRegion, string> = PUZZLE_PIECES.reduce(
  (acc, piece) => {
    acc[piece.region] = piece.id;
    return acc;
  },
  {} as Record<FootRegion, string>,
);

const TONE_FILL: Record<PieceTone, string> = {
  pink: "fill-pink-light",
  leaf: "fill-leaf-light",
  amber: "fill-amber-light",
};

const TONE_STROKE: Record<PieceTone, string> = {
  pink: "stroke-pink-dark",
  leaf: "stroke-leaf-dark",
  amber: "stroke-amber-dark",
};

interface RegionSlotProps {
  region: FootRegion;
  tone: PieceTone | null;
  snap: boolean;
  snapKey: number;
  onDropped: (pieceId: string) => void;
  children: (state: {
    hovering: boolean;
    type: "sole" | "toe";
    snap: boolean;
    snapKey: number;
  }) => React.ReactNode;
  type: "sole" | "toe";
}

/**
 * One region's interactive shell: the drag/drop handlers and hover state,
 * shared between the three sole bands and the two toe groups. `children` is a
 * render prop so each region can still draw its own particular shape (a
 * clipped sole band vs. a set of ellipses) inside the same behavior.
 */
function RegionSlot({ region, tone, snap, snapKey, onDropped, children, type }: RegionSlotProps) {
  const [hovering, setHovering] = useState(false);
  const expectedType = pieceDndType(REGION_PIECE[region]);
  const filled = tone !== null;

  return (
    <g
      className={filled ? undefined : "cursor-default"}
      // A filled region has nothing left to accept - its piece is already
      // out of the tray - so it stops listening rather than silently
      // swallowing a drop meant for a still-empty neighbor.
      style={filled ? { pointerEvents: "none" } : undefined}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(expectedType)) {
          e.preventDefault();
        }
      }}
      onDragEnter={(e) => {
        if (e.dataTransfer.types.includes(expectedType)) {
          e.preventDefault();
          setHovering(true);
        }
      }}
      onDragLeave={() => setHovering(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHovering(false);
        const id = e.dataTransfer.getData(expectedType);
        if (id) onDropped(id);
      }}
    >
      {children({ hovering, type, snap, snapKey })}
    </g>
  );
}

function SoleSlot({
  band,
  region,
  tone,
  snap,
  snapKey,
  onDropped,
}: {
  band: { y: number; height: number };
  region: FootRegion;
  tone: PieceTone | null;
  snap: boolean;
  snapKey: number;
  onDropped: (pieceId: string) => void;
}) {
  const clipId = `sole-slot-${band.y}`;
  return (
    <RegionSlot region={region} tone={tone} snap={snap} snapKey={snapKey} onDropped={onDropped} type="sole">
      {({ hovering, snap, snapKey }) => (
        <>
          <clipPath id={clipId}>
            <rect x="0" y={band.y} width="41" height={band.height} />
          </clipPath>
          {/* A generous invisible hit area, wider than the visible dashed
              trace - the curve itself is a thin target to land a drag on. */}
          <rect
            x="8"
            y={band.y}
            width="25"
            height={band.height}
            fill="transparent"
            clipPath={`url(#${clipId})`}
          />
          {tone ? (
            <g key={snap ? snapKey : undefined} className={snap ? "foot-puzzle-piece-snap" : undefined}>
              <path
                d={SOLE_D}
                fillRule="evenodd"
                className={cn(TONE_FILL[tone], TONE_STROKE[tone])}
                strokeWidth="0.9"
                clipPath={`url(#${clipId})`}
              />
            </g>
          ) : (
            <path
              d={SOLE_D}
              fillRule="evenodd"
              fill="none"
              className={hovering ? "stroke-leaf-dark" : "stroke-cocoa/45"}
              strokeWidth={hovering ? "1.3" : "0.9"}
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
  snap,
  snapKey,
  onDropped,
  ellipses,
}: {
  region: FootRegion;
  tone: PieceTone | null;
  snap: boolean;
  snapKey: number;
  onDropped: (pieceId: string) => void;
  ellipses: readonly { cx: number; cy: number; rx: number; ry: number; rotate: number }[];
}) {
  return (
    <RegionSlot region={region} tone={tone} snap={snap} snapKey={snapKey} onDropped={onDropped} type="toe">
      {({ hovering, snap, snapKey }) => (
        <>
          {ellipses.map((t) => (
            <ellipse
              key={t.cx}
              cx={t.cx}
              cy={t.cy}
              rx={t.rx + 0.6}
              ry={t.ry + 0.6}
              transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
              fill="transparent"
            />
          ))}
          {tone ? (
            <g key={snap ? snapKey : undefined} className={snap ? "foot-puzzle-piece-snap" : undefined}>
              {ellipses.map((t) => (
                <ellipse
                  key={t.cx}
                  cx={t.cx}
                  cy={t.cy}
                  rx={t.rx}
                  ry={t.ry}
                  transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
                  className={cn(TONE_FILL[tone], TONE_STROKE[tone])}
                  strokeWidth="0.9"
                />
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
                fill="none"
                className={hovering ? "stroke-leaf-dark" : "stroke-cocoa/45"}
                strokeWidth={hovering ? "1.3" : "0.9"}
                strokeDasharray="1.4 1.1"
              />
            ))
          )}
        </>
      )}
    </RegionSlot>
  );
}

export function FootShape({
  filled,
  onPieceDropped,
  snappedPiece,
  snapKey,
  className,
}: {
  /** Each region's fill tone, or null while its piece is still in the tray. */
  filled: Record<FootRegion, PieceTone | null>;
  /** Fires once, only when a region receives the one piece cut to fit it. */
  onPieceDropped: (pieceId: string) => void;
  /** The most recently placed piece gets a short physical snap animation. */
  snappedPiece: string | null;
  snapKey: number;
  className?: string;
}) {
  return (
    <svg viewBox={FOOT_VIEWBOX} className={cn("foot-shape-svg block", className)} aria-hidden="true">
      {/* The sole's own base color, so a still-empty region reads as a
          recessed slot rather than a hole in the page. */}
      <path d={SOLE_D} fillRule="evenodd" className="fill-cream-deep" />

      <SoleSlot band={BALL_BAND} region="ball" tone={filled.ball} snap={snappedPiece === REGION_PIECE.ball} snapKey={snapKey} onDropped={onPieceDropped} />
      <SoleSlot band={ARCH_BAND} region="arch" tone={filled.arch} snap={snappedPiece === REGION_PIECE.arch} snapKey={snapKey} onDropped={onPieceDropped} />
      <SoleSlot band={HEEL_BAND} region="heel" tone={filled.heel} snap={snappedPiece === REGION_PIECE.heel} snapKey={snapKey} onDropped={onPieceDropped} />

      <ToeSlot region="toeOne" tone={filled.toeOne} snap={snappedPiece === REGION_PIECE.toeOne} snapKey={snapKey} onDropped={onPieceDropped} ellipses={[BIG_TOE]} />
      <ToeSlot region="toeTwo" tone={filled.toeTwo} snap={snappedPiece === REGION_PIECE.toeTwo} snapKey={snapKey} onDropped={onPieceDropped} ellipses={OTHER_TOES} />

      {/* The whole-foot outline, drawn last and always at full strength, so
          the silhouette reads as one foot even where two dashed slots meet. */}
      <path d={SOLE_D} fillRule="evenodd" fill="none" className="stroke-cocoa/55" strokeWidth="0.9" />
    </svg>
  );
}
