"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { PUZZLE_PIECES, type FootRegion } from "./checklistPieces";
import { PIECE_DND_TYPE, pieceDndType, type PieceTone } from "./PuzzleTile";
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
 * geometry in footGeometry.ts, with six separately-fillable, separately
 * droppable regions - a jigsaw board rather than one big drop zone.
 *
 * Each region knows the one piece cut to fit it. That's decided per region:
 * every region computes its expected piece id from checklistPieces.ts and
 * accepts its matching dataTransfer type (`${PIECE_DND_TYPE}:${pieceId}`, set
 * in PuzzleTile.tsx). The root SVG is deliberately more forgiving and accepts
 * any puzzle-piece type, routing it to its correct region when the visitor
 * gets it anywhere over the footprint rather than demanding pixel accuracy.
 *
 * `types` (unlike `getData()`) is readable during `dragover`, which is the
 * whole trick: it lets a region validate *which* piece is hovering without
 * ever reading the drag payload early, which the drag-and-drop spec forbids
 * for anything but `dragstart` and `drop`.
 *
 * Unfilled regions show a dashed outline of their own shape - an empty
 * puzzle-board slot, not just a gap in one shared outline - so a visitor can
 * see where every piece belongs before picking one up. A filled region
 * switches to a solid fill in that piece's intentionally assigned brand
 * color (passed in via `filled`), producing the same balanced footprint on
 * every visit.
 */

const REGION_PIECE: Record<FootRegion, string> = PUZZLE_PIECES.reduce(
  (acc, piece) => {
    acc[piece.region] = piece.id;
    return acc;
  },
  {} as Record<FootRegion, string>,
);

const TONE_FILL: Record<PieceTone, string> = {
  pink: "fill-pink/75",
  leaf: "fill-leaf/80",
  amber: "fill-amber/80",
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
  band: { y: number; height: number; x?: number; width?: number };
  region: FootRegion;
  tone: PieceTone | null;
  snap: boolean;
  snapKey: number;
  onDropped: (pieceId: string) => void;
}) {
  const clipId = `sole-slot-${region}`;
  const bandX = band.x ?? 0;
  const bandWidth = band.width ?? 41;
  return (
    <RegionSlot region={region} tone={tone} snap={snap} snapKey={snapKey} onDropped={onDropped} type="sole">
      {({ hovering, snap, snapKey }) => (
        <>
          <clipPath id={clipId}>
            <rect x={bandX} y={band.y} width={bandWidth} height={band.height} />
          </clipPath>
          {/* A generous invisible hit area, wider than the visible dashed
              trace - the curve itself is a thin target to land a drag on. */}
          <rect
            x={band.x ?? 8}
            y={band.y}
            width={band.width ?? 25}
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
  const [boardHovering, setBoardHovering] = useState(false);

  function draggedPieceType(types: readonly string[]) {
    return types.find((type) => type.startsWith(`${PIECE_DND_TYPE}:`));
  }

  return (
    <svg
      viewBox={FOOT_VIEWBOX}
      className={cn(
        "foot-shape-svg block transition-[filter,transform] duration-200",
        boardHovering && "foot-shape-drop-active",
        className,
      )}
      aria-hidden="true"
      onDragOver={(e) => {
        if (draggedPieceType(Array.from(e.dataTransfer.types))) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }
      }}
      onDragEnter={(e) => {
        if (draggedPieceType(Array.from(e.dataTransfer.types))) {
          e.preventDefault();
          setBoardHovering(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setBoardHovering(false);
        }
      }}
      onDrop={(e) => {
        const type = draggedPieceType(Array.from(e.dataTransfer.types));
        if (!type) return;
        e.preventDefault();
        setBoardHovering(false);
        const id = e.dataTransfer.getData(type);
        if (id) onPieceDropped(id);
      }}
    >
      {/* The sole's own base color, so a still-empty region reads as a
          recessed slot rather than a hole in the page. */}
      <path d={SOLE_D} fillRule="evenodd" className="fill-white/80" />

      <SoleSlot band={BALL_LEFT_BAND} region="ballLeft" tone={filled.ballLeft} snap={snappedPiece === REGION_PIECE.ballLeft} snapKey={snapKey} onDropped={onPieceDropped} />
      <SoleSlot band={BALL_RIGHT_BAND} region="ballRight" tone={filled.ballRight} snap={snappedPiece === REGION_PIECE.ballRight} snapKey={snapKey} onDropped={onPieceDropped} />

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
      <SoleSlot band={ARCH_BAND} region="arch" tone={filled.arch} snap={snappedPiece === REGION_PIECE.arch} snapKey={snapKey} onDropped={onPieceDropped} />
      <SoleSlot band={HEEL_BAND} region="heel" tone={filled.heel} snap={snappedPiece === REGION_PIECE.heel} snapKey={snapKey} onDropped={onPieceDropped} />

      <ToeSlot region="toeOne" tone={filled.toeOne} snap={snappedPiece === REGION_PIECE.toeOne} snapKey={snapKey} onDropped={onPieceDropped} ellipses={[BIG_TOE]} />
      <ToeSlot region="toeTwo" tone={filled.toeTwo} snap={snappedPiece === REGION_PIECE.toeTwo} snapKey={snapKey} onDropped={onPieceDropped} ellipses={OTHER_TOES} />

      {/* The whole-foot outline, drawn last and always at full strength, so
          the silhouette reads as one foot even where two dashed slots meet. */}
      <path d={SOLE_D} fillRule="evenodd" fill="none" className="stroke-cocoa/65" strokeWidth="1.05" />
    </svg>
  );
}
