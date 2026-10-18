"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A grid column that pins beside a longer one on large screens.
 *
 * When the column fits in the viewport it pins `offset` px from the top. When
 * it is taller, it scrolls with the page until its bottom comes into view and
 * pins there instead, so nothing in it (a submit button, say) is ever held
 * out of reach. Sticky lives on this plain div: keep animated wrappers inside
 * it, since a transformed element breaks the pin (see app/about/page.tsx).
 */
export function StickyColumn({
  children,
  className,
  offset = 96,
  gap = 24,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
  gap?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(offset, window.innerHeight - el.offsetHeight - gap));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [offset, gap]);

  return (
    <div
      ref={ref}
      className={cn("lg:sticky lg:self-start", className)}
      style={{ top: top ?? offset }}
    >
      {children}
    </div>
  );
}
