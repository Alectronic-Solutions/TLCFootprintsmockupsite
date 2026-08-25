import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Surface inverts against its section: cream cards on cream-deep sections and
 * vice versa, so cards read as raised without needing a heavy shadow.
 *
 * `interactive` adds `.card-lift` (globals.css): a 4px rise and a rainbow
 * hairline that wipes in along the top edge. The hairline is the payoff. A
 * card that only moves on hover reads as a bug on a slow machine; a card that
 * picks up the brand colors reads as deliberate.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
  /** Adds a permanent rainbow rule at the top. For one feature card, not a grid. */
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  interactive?: boolean;
  accent?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-cream",
        "p-6 shadow-soft sm:p-7",
        interactive && "card-lift card-rule",
        className,
      )}
    >
      {accent && (
        <span
          aria-hidden="true"
          className="rule-rainbow absolute inset-x-6 top-0 h-[3px] rounded-full"
        />
      )}
      {children}
    </Tag>
  );
}
