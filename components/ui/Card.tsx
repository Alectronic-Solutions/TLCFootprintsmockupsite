import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Surface inverts against its section: cream cards on cream-deep sections and
 * vice versa. `interactive` adds the hover lift from globals.css.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  interactive?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-cream",
        "p-6 sm:p-7",
        interactive && "card-lift",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
