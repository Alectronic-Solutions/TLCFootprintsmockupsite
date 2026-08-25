import type { ReactNode } from "react";

/**
 * An atomic run of text: the browser may break the line before or after it,
 * never inside it unless it does not fit at all.
 *
 * Extracted from ThelmaStory (components/home/ThelmaStory.tsx), which built
 * this first for the Thelma paragraphs. Used at two levels, and the nesting is
 * the point.
 *
 *   `Clause` wraps a run that ends in a full stop, a comma or a colon, so on
 *   any screen wide enough to hold it, every line of a paragraph ends on
 *   punctuation instead of stranding half a thought.
 *
 *   `Phrase` sits inside a `Clause` that is too long for a narrow screen. The
 *   clause then breaks at the phrase seams it was given rather than at
 *   whatever word happens to land on the edge, so a 320px line still ends
 *   somewhere a person would pause.
 *
 * The two are one component because they do one job at two scales. There is
 * no third tier: below the phrase, normal word wrapping is the right answer.
 *
 * Hand-authored, deliberately: this is not a sentence-boundary algorithm run
 * over arbitrary copy, it is a marker placed by whoever wrote the paragraph,
 * at the seams they actually want a line to end on. Applying it means reading
 * the paragraph and choosing those seams, the way ThelmaStory's prose was
 * built.
 */
export function Run({ children }: { children: ReactNode }) {
  return <span className="inline-block">{children}</span>;
}

export const Clause = Run;
export const Phrase = Run;
