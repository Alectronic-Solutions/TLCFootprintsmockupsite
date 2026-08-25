import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Small caps eyebrow above a section heading.
 *
 * No leading rule or ornament: a short horizontal line here reads as a stray
 * dash rather than as decoration. The tracking and colour carry it on their own.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block text-eyebrow font-bold uppercase text-leaf-dark",
        className,
      )}
    >
      {children}
    </span>
  );
}
