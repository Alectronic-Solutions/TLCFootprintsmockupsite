/**
 * The single mapping between the foot puzzle's five pieces and the
 * clipboard's checklist lines, so FootShape.tsx and IncludedClipboard.tsx
 * can never drift apart into two different lists of "the same" five facts.
 *
 * One piece can satisfy more than one clipboard line - "Meals & snacks" is
 * one region of the foot but three separate lines on the sheet (breakfast,
 * morning snack, afternoon snack), because a parent thinks of it as one
 * decision even though the rate states it as three items.
 */
export type ChecklistList = "included" | "notIncluded" | "enrollment";
export type FootRegion = "heel" | "arch" | "ball" | "toeOne" | "toeTwo";

export interface PuzzlePiece {
  id: string;
  label: string;
  region: FootRegion;
  list: ChecklistList;
  /** Index (or indices) within RATE_INCLUSIONS[list] this piece accounts for. */
  indices: readonly number[];
}

export const PUZZLE_PIECES: readonly PuzzlePiece[] = [
  { id: "deposit", label: "$150 deposit", region: "heel", list: "enrollment", indices: [0] },
  { id: "schedule", label: "Weekly or bi-weekly", region: "arch", list: "enrollment", indices: [1] },
  { id: "meals", label: "Meals & snacks", region: "ball", list: "included", indices: [0, 1, 2] },
  { id: "lunch", label: "Lunch from home", region: "toeOne", list: "notIncluded", indices: [0] },
  {
    id: "child-action",
    label: "Child Action accepted",
    region: "toeTwo",
    list: "enrollment",
    indices: [2],
  },
] as const;

/** Whether a given RATE_INCLUSIONS[list][index] line is checked, given placed piece ids. */
export function isLineChecked(list: ChecklistList, index: number, placed: readonly string[]): boolean {
  return PUZZLE_PIECES.some(
    (piece) => piece.list === list && piece.indices.includes(index) && placed.includes(piece.id),
  );
}
