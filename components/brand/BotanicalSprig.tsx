import { WatercolorBranch } from "./WatercolorBranch";

/**
 * The leaf-and-berry sprig from the logo.
 *
 * The art now lives in WatercolorBranch, which paints the flyer's broad
 * two-tone leaves instead of the line-art slivers this used to draw. This
 * wrapper is kept because the sprig is placed on nearly every page and the
 * name says what it is at each call site; it also pins the `sprig` variant, so
 * a caller can never accidentally drop a full hero-scale arm into a page
 * margin.
 *
 * Placement rules (from the plan's illustration art direction) are unchanged:
 * always enters from a corner or edge, never floats centered; rotated or
 * mirrored so no two placements look identical; opacity 0.5 to 0.8 so it sits
 * behind content.
 */

interface BotanicalSprigProps {
  className?: string;
  /** Mirrors the sprig so a facing pair reads as two different sprigs. */
  flip?: boolean;
  /** Mirrors vertically so the sprig hangs down from a top edge. */
  flipY?: boolean;
  /** Drops the hearts and berries for a quieter placement. */
  leavesOnly?: boolean;
  /**
   * Multiplies every animation duration. Above 1 the branch is sleepier, which
   * is what you want when two sprigs are visible at once and matching rhythms
   * would give the trick away.
   */
  windScale?: number;
  /** Freezes the sway. For dense pages where a third moving thing is noise. */
  still?: boolean;
}

export function BotanicalSprig(props: BotanicalSprigProps) {
  return <WatercolorBranch variant="sprig" {...props} />;
}
