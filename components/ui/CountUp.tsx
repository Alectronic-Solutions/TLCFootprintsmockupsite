"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up the first time it scrolls into view.
 *
 * Used only on the openings figures. The point is not decoration: a number
 * that moves is read as *current*, which is exactly the claim the availability
 * panel is making. Anywhere else on this site it would be a gimmick.
 *
 * The final value is rendered on the server and is what a crawler, a printer,
 * and a reduced-motion visitor all see. The animation only ever replaces it
 * after mount, so the figure is never missing.
 */
export function CountUp({
  value,
  duration = 900,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Counting from 0 to 0 is a no-op with a pause in the middle.
    if (value <= 0) return;

    let raf = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Ease-out cubic: fast off the mark, settles onto the final number.
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(eased * value));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        setDisplay(0);
        run();
        io.disconnect();
      },
      { threshold: 0.6 },
    );

    io.observe(node);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
