import { forwardRef } from "react";
import {
  DifferentiatorIcon,
  type DifferentiatorIconName,
} from "@/components/brand/DifferentiatorIcon";
import { cn } from "@/lib/cn";

/**
 * One cube. Stateless: useBlockPhysics writes `transform` every frame, so
 * nothing here may set it. The pen is aria-hidden; the accessible copy of
 * this section lives in the legend below it.
 */

export interface Differentiator {
  icon: DifferentiatorIconName;
  title: string;
  /**
   * Where the legend column breaks the title, given as the words that end its
   * first line - a prefix of `title`, not a second copy of it, so the two can
   * never drift apart. Set it on every title in a row or none: it exists so
   * three entries standing side by side are all two lines deep. The block face
   * ignores it and the accessible title is unaffected; anything that does not
   * match a prefix simply wraps on its own.
   */
  titleBreakAfter?: string;
  body: string;
  /** The paint. Picks the block's three face colours; matches its mark. */
  edge: "leaf" | "pink" | "amber";
  /**
   * A cube by default. "prism" is a triangular roof block, laid across the two
   * below it. useBlockPhysics reads this off `data-shape` to give it a
   * triangular body, so it tumbles and stacks the way it is drawn.
   */
  shape?: "cube" | "prism";
}

export const EDGE_CLASS = {
  leaf: "toy-block--leaf",
  pink: "toy-block--pink",
  amber: "toy-block--amber",
} as const;

export const ToyBlock = forwardRef<HTMLLIElement, { item: Differentiator }>(
  function ToyBlock({ item }, ref) {
    return (
      <li
        ref={ref}
        data-shape={item.shape ?? "cube"}
        className={cn(
          "toy-block",
          EDGE_CLASS[item.edge],
          item.shape === "prism" && "toy-block--prism",
        )}
      >
        {item.shape === "prism" && (
          <>
            <span className="toy-prism-slope toy-prism-slope--left" />
            <span className="toy-prism-slope toy-prism-slope--right" />
            <span className="toy-prism-front" />
          </>
        )}
        <span className="toy-block-face">
          <span className="toy-block-mark">
            <DifferentiatorIcon name={item.icon} className="h-10 w-10 sm:h-12 sm:w-12" />
          </span>
          <span className="toy-block-title">{item.title}</span>
        </span>
      </li>
    );
  },
);
