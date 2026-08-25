import { FootprintPairGlyph, PAIR_IN_ARCH } from "@/components/brand/Footprints";
import { cn } from "@/lib/cn";

/**
 * The three-arc rainbow from the logo: pink, amber, leaf, outermost first.
 *
 * The arc radii here are the source of the site's macro-geometry: ArcDivider
 * reuses the same curvature so section seams echo the mark.
 */

const ARCS = [
  { r: 46, cls: "stroke-pink" },
  { r: 35, cls: "stroke-amber" },
  { r: 24, cls: "stroke-leaf" },
] as const;

/** Where the arcs stand, in viewBox units. */
const BASELINE = 55;

interface RainbowArcProps {
  className?: string;
  /** Stroke width in viewBox units. */
  weight?: number;
  /** Animate the arcs drawing in. Handled by the caller via CSS custom props. */
  draw?: boolean;
  /**
   * Nest the footprint pair in the opening, as the logo does.
   *
   * On at every size the arch is read as the mark rather than as a divider -
   * an empty arch beside the wordmark is a rainbow, not this daycare's
   * rainbow. Off for decorative arcs that only borrow the curvature.
   */
  feet?: boolean;
}

export function RainbowArc({
  className,
  weight = 9,
  draw = false,
  feet = false,
}: RainbowArcProps) {
  return (
    <svg viewBox="0 0 110 60" className={cn("block", className)} aria-hidden="true">
      {ARCS.map(({ r, cls }, i) => (
        <path
          key={r}
          d={`M ${55 - r} ${BASELINE} A ${r} ${r} 0 0 1 ${55 + r} ${BASELINE}`}
          fill="none"
          strokeWidth={weight}
          strokeLinecap="round"
          pathLength={1}
          className={cn(cls, draw && "arc-draw")}
          style={
            draw
              ? ({
                  // Staggered so the arcs draw outermost-in.
                  animationDelay: `${i * 0.12}s`,
                } as React.CSSProperties)
              : undefined
          }
        />
      ))}

      {feet ? (
        <g
          transform={`translate(${PAIR_IN_ARCH.x},${(BASELINE + PAIR_IN_ARCH.dy).toFixed(2)}) scale(${PAIR_IN_ARCH.scale})`}
        >
          <FootprintPairGlyph />
        </g>
      ) : null}
    </svg>
  );
}
