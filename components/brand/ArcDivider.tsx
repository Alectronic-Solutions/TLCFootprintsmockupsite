import { cn } from "@/lib/cn";

/**
 * The seam between two sections.
 *
 * A hard horizontal line reads institutional. These curves are derived from the
 * logo's rainbow radius, so the page's macro-geometry echoes the mark. Three
 * variants exist so consecutive seams never repeat.
 *
 * The wrapper is painted with the *outgoing* section's color and the path is
 * filled with the *incoming* one, so the curve is a true two-tone edge with no
 * seam at either join.
 */

type Variant = "shallow" | "deep" | "scallop";

/**
 * The curve alone. The fill path closes it down to the bottom of the viewBox so
 * the incoming color fills everything beneath it - closing at the curve itself
 * would fill only a hairline sliver - while the rainbow rule strokes it as it
 * stands. Split rather than duplicated so the two can never drift apart.
 */
const CURVES: Record<Variant, string> = {
  // Single wide sweep, mirroring the outermost rainbow arc.
  shallow: "M0 26 C 360 -2, 1080 -2, 1440 26",
  // Tighter curvature, for seams that need more presence.
  deep: "M0 44 C 300 -8, 1140 -8, 1440 44",
  // Repeating scallops, echoing the dotted-heart rhythm of her flyers.
  scallop:
    "M0 30 C 90 6, 270 6, 360 30 C 450 6, 630 6, 720 30 C 810 6, 990 6, 1080 30 C 1170 6, 1350 6, 1440 30",
};

const CLOSE = " L1440 50 L0 50 Z";

interface ArcDividerProps {
  variant?: Variant;
  /** Tailwind bg class for the section above. */
  from?: string;
  /** Tailwind fill class for the section below. */
  to?: string;
  /**
   * Trace the curve with the logo's pink-amber-leaf rule.
   *
   * Reserved for the seams around the CTA band, so that band sits inside the
   * mark's rainbow. Everywhere else the seam is meant to be felt and not seen,
   * and a colored line there would turn a transition into an ornament.
   */
  rule?: boolean;
  className?: string;
}

export function ArcDivider({
  variant = "shallow",
  from = "bg-cream-deep",
  to = "fill-cream",
  rule = false,
  className,
}: ArcDividerProps) {
  // Keyed to the variant so the two arcs on a page hold distinct ids without
  // useId(), which a server component cannot call.
  const gradientId = `arc-rainbow-${variant}`;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full leading-[0]", from, className)}
    >
      <svg
        viewBox="0 0 1440 50"
        preserveAspectRatio="none"
        // -mb-px closes the sub-pixel gap that rounding can leave at the join.
        className={cn("-mb-px block h-[clamp(28px,4vw,52px)] w-full", to)}
      >
        {rule ? (
          <defs>
            {/* The pink end is lightened. The rule sits on the boundary of the
                pink band, and --color-pink against --color-pink is an invisible
                third of the rainbow. */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9FB4" />
              <stop offset="50%" stopColor="var(--color-amber)" />
              <stop offset="100%" stopColor="var(--color-leaf)" />
            </linearGradient>
          </defs>
        ) : null}

        <path d={CURVES[variant] + CLOSE} />

        {rule ? (
          <path
            d={CURVES[variant]}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={3}
            strokeLinecap="round"
            // preserveAspectRatio="none" scales x and y by different factors,
            // which would leave the rule fat where the curve runs steep. This
            // holds it at a true 3px everywhere.
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
    </div>
  );
}
