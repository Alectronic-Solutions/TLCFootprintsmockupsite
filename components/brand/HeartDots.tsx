import { cn } from "@/lib/cn";

/**
 * The dotted heart divider from LaTrell's flyers: • • • ♥ • • •
 * Her own visual vocabulary, carried onto the site.
 */
export function HeartDots({
  className,
  dots = 5,
}: {
  className?: string;
  dots?: number;
}) {
  const side = Array.from({ length: dots });

  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      aria-hidden="true"
    >
      {side.map((_, i) => (
        <span
          key={`l-${i}`}
          className="block rounded-full bg-pink"
          style={{
            width: 4,
            height: 4,
            // Dots fade as they travel away from the heart.
            opacity: 0.28 + (i / dots) * 0.5,
          }}
        />
      ))}

      <svg viewBox="0 0 24 22" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
        <path
          d="M12 21 C 4 14.5, 1 11, 1 7.2 C 1 3.8, 3.6 1, 7 1 C 9.1 1, 10.9 2.1, 12 3.8 C 13.1 2.1, 14.9 1, 17 1 C 20.4 1, 23 3.8, 23 7.2 C 23 11, 20 14.5, 12 21 Z"
          className="fill-pink"
        />
      </svg>

      {side.map((_, i) => (
        <span
          key={`r-${i}`}
          className="block rounded-full bg-pink"
          style={{
            width: 4,
            height: 4,
            opacity: 0.78 - (i / dots) * 0.5,
          }}
        />
      ))}
    </div>
  );
}
