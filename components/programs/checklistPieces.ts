/**
 * The single mapping between the foot puzzle's six pieces and the
 * clipboard's checklist lines, so FootShape.tsx and IncludedClipboard.tsx
 * can never drift apart into two different lists of "the same" six facts.
 *
 * The included-food area is intentionally split in two: breakfast earns one
 * half of the ball of the foot, while morning and afternoon snacks share the
 * yellow half. That keeps the checklist's three food lines understandable
 * without turning the footprint into eight tiny pieces.
 */
export type ChecklistList = "included" | "notIncluded" | "enrollment";
export type FootRegion =
  | "heel"
  | "arch"
  | "ballLeft"
  | "ballRight"
  | "toeOne"
  | "toeTwo";

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
  { id: "schedule", label: "Weekly /\nbi-weekly", region: "arch", list: "enrollment", indices: [1] },
  { id: "breakfast", label: "Breakfast", region: "ballLeft", list: "included", indices: [0] },
  { id: "snacks", label: "AM + PM snacks", region: "ballRight", list: "included", indices: [1, 2] },
  { id: "lunch", label: "Lunch from home", region: "toeOne", list: "notIncluded", indices: [0] },
  {
    id: "child-action",
    label: "Child Action",
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
