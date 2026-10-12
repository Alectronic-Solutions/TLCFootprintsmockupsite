import { WatercolorBranch } from "./WatercolorBranch";

/**
 * The leaf-and-berry sprig from the logo: WatercolorBranch pinned to its
 * `sprig` variant, so a hero-scale arm can't land in a page margin.
 *
 * Placement: always enters from a corner or edge, never floats centered;
 * rotated or mirrored so no two placements match; opacity 0.5 to 0.8.
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
