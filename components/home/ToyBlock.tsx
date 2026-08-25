import { forwardRef } from "react";
import {
  DifferentiatorIcon,
  type DifferentiatorIconName,
} from "@/components/brand/DifferentiatorIcon";
import { cn } from "@/lib/cn";

/**
 * One cube.
 *
 * Purely presentational, and deliberately dumb: it holds no state and knows
 * nothing about the simulation. useBlockPhysics writes a transform onto this
 * element every frame, so anything that also wrote to `transform` here would be
 * overwritten - the resting tilt the old card had is gone for that reason, and
 * because a block resting on a floor is not tilted.
 *
 * A cube only has room for the mark and the title. The sentence that used to
 * sit under them is in the legend below the pen, at full reading size, which is
 * also where the accessible copy of this section lives - the pen itself is
 * aria-hidden, because a toy that duplicates the text beside it is decoration.
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
}

export const EDGE_CLASS = {
  leaf: "toy-block--leaf",
  pink: "toy-block--pink",
  amber: "toy-block--amber",
} as const;

export const ToyBlock = forwardRef<HTMLLIElement, { item: Differentiator }>(
  function ToyBlock({ item }, ref) {
    return (
      <li ref={ref} className={cn("toy-block", EDGE_CLASS[item.edge])}>
        <span className="toy-block-face">
          <span className="toy-block-mark">
            <DifferentiatorIcon name={item.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
          </span>
          <span className="toy-block-title">{item.title}</span>
        </span>
      </li>
    );
  },
);
