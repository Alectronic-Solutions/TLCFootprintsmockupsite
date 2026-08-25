import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { FootRegion } from "./checklistPieces";
import {
  SOLE_D,
  BALL_BAND,
  ARCH_BAND,
  HEEL_BAND,
  BIG_TOE,
  OTHER_TOES,
  REGION_VIEWBOX,
} from "./footGeometry";

export type PieceTone = "pink" | "leaf" | "amber";

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

/**
 * Each region's own natural width:height ratio, read straight off
 * REGION_VIEWBOX in footGeometry.ts. The three sole slices are wide and
 * short (~2.2:1); the toe regions are closer to square. A fixed *square*
 * icon box was the first version of this component, and it was a real bug,
 * not a style choice: "meet" letterboxes a wide viewBox inside a square
 * viewport, so all three sole pieces rendered as similarly-proportioned
 * short blobs in the middle of a mostly-empty square - none of them read as
 * a distinct slice of a foot. Sizing the box itself to each region's ratio
 * is what lets a piece fill its card and keep its own real shape.
 */
const REGION_RATIO: Record<FootRegion, number> = {
  ball: 25 / 11.2,
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
 */
function RegionCutout({ region, tone }: { region: FootRegion; tone: PieceTone }) {
  const fill = TONE_FILL[tone];
  const stroke = TONE_STROKE[tone];
  const clipId = useId().replace(/:/g, "");
  // A fixed height, width derived from the region's own ratio: this is what
  // keeps every piece the same visual "weight" on the tray shelf even though
  // their shapes differ, the way same-size jigsaw pieces sit in a box.
  const style = {
    height: "clamp(2.75rem, 12vw, 4.5rem)",
    width: "auto",
    aspectRatio: REGION_RATIO[region],
  } as CSSProperties;

  if (region === "toeOne") {
    return (
      <svg viewBox={REGION_VIEWBOX.toeOne} style={style} className="max-w-full drop-shadow-sm" aria-hidden="true">
        <ellipse
          cx={BIG_TOE.cx}
          cy={BIG_TOE.cy}
          rx={BIG_TOE.rx}
          ry={BIG_TOE.ry}
          transform={`rotate(${BIG_TOE.rotate} ${BIG_TOE.cx} ${BIG_TOE.cy})`}
          className={cn(fill, stroke)}
          strokeWidth="0.8"
        />
      </svg>
    );
  }
  if (region === "toeTwo") {
    return (
      <svg viewBox={REGION_VIEWBOX.toeTwo} style={style} className="max-w-full drop-shadow-sm" aria-hidden="true">
        {OTHER_TOES.map((t) => (
          <ellipse
            key={t.cx}
            cx={t.cx}
            cy={t.cy}
            rx={t.rx}
            ry={t.ry}
            transform={`rotate(${t.rotate} ${t.cx} ${t.cy})`}
            className={cn(fill, stroke)}
            strokeWidth="0.8"
          />
        ))}
      </svg>
    );
  }
  // ball / arch / heel: a cropped slice of the shared sole path.
  const band =
    region === "ball" ? BALL_BAND : region === "arch" ? ARCH_BAND : HEEL_BAND;

  return (
    <svg
      viewBox={REGION_VIEWBOX[region]}
      style={style}
      className="max-w-full drop-shadow-sm"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y={band.y} width="41" height={band.height} />
        </clipPath>
      </defs>
      <path
        d={SOLE_D}
        fillRule="evenodd"
        className={cn(fill, stroke)}
        strokeWidth="0.8"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

/**
 * dataTransfer MIME type for one specific piece: `${PIECE_DND_TYPE}:${id}`.
 *
 * The id lives in the *type string* itself, not only in the data value,
 * because a region's `dragover` handler (FootShape.tsx) has to decide
 * whether *this* drag is the one piece it accepts, and `dataTransfer.types`
 * - unlike `getData()` - is readable during `dragover`. `getData()` only
 * returns real data at `drop`, by design, so it can't drive that decision.
 */
export const PIECE_DND_TYPE = "application/x-tlc-puzzle-piece";

export function pieceDndType(id: string) {
  return `${PIECE_DND_TYPE}:${id}`;
}

/**
 * One puzzle piece in the tray: its own foot-region cutout, large and solid,
 * with its label as a caption underneath - one draggable, clickable card.
 *
 * Draggable for a mouse or trackpad (native HTML5 drag and drop, validated
 * per region in FootShape.tsx - a piece only fits its own slot). A real
 * `<button>` underneath, so a tap or an Enter/Space press places the piece
 * directly, the same result a correct drag ends in - the fallback a touch
 * visitor or a keyboard user needs, not an afterthought bolted on.
 */
export function PuzzleTile({
  id,
  label,
  region,
  tone,
  onPlace,
}: {
  id: string;
  label: string;
  region: FootRegion;
  tone: PieceTone;
  onPlace: () => void;
}) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(pieceDndType(id), id);
        e.dataTransfer.setData("text/plain", label);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onPlace}
      className={cn(
        "group flex min-h-[6.75rem] min-w-0 w-full touch-manipulation cursor-grab flex-col items-center justify-center gap-1.5 rounded-xl p-1.5 text-center transition-transform sm:min-h-[8.5rem] sm:gap-2 sm:p-2",
        "hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-dark focus-visible:ring-offset-2",
      )}
    >
      <RegionCutout region={region} tone={tone} />
      <span className="text-xs font-semibold leading-tight text-cocoa sm:text-sm">{label}</span>
    </button>
  );
}
