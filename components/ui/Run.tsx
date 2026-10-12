import type { ReactNode } from "react";

/**
 * An atomic run of text: the browser may break the line before or after it,
 * never inside it unless it does not fit at all.
 *
 *   `Clause` wraps a run ending in punctuation, so on any screen wide enough
 *   every line of a paragraph ends on a pause.
 *
 *   `Phrase` sits inside a `Clause` too long for a narrow screen, giving it
 *   finer seams to break at.
 *
 * Hand-placed by whoever writes the paragraph, at the seams they want.
 */
export function Run({ children }: { children: ReactNode }) {
  return <span className="inline-block">{children}</span>;
}

export const Clause = Run;
export const Phrase = Run;
