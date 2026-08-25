import { cn } from "@/lib/cn";

/**
 * Page textures. Both are pure CSS/SVG: no image files, so they cost nothing
 * against the performance budget.
 */

/**
 * The noise itself, shared by both grain layers so they are the same paper.
 */
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Fine paper grain over the whole page at ~3%.
 *
 * This is what produces the "soft cream document" feel LaTrell described in
 * her brief. feTurbulence generates the noise in the browser; no asset needed.
 */
export function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: GRAIN_URL }}
    />
  );
}

/**
 * The same grain, scoped to one surface rather than the page.
 *
 * PaperGrain is `fixed inset-0 z-0` and the app sits above it at z-10, so it
 * never reaches a section that paints its own background. Anything with a
 * colored field needs its own copy, and needs it in `soft-light`: `multiply`
 * over a saturated color greys it out, `soft-light` keeps the hue and only
 * adds the tooth.
 */
export function SurfaceGrain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ backgroundImage: GRAIN_URL }}
    />
  );
}

type WashTone = "pink" | "leaf" | "amber" | "white";

const TONES: Record<WashTone, string> = {
  pink: "226,58,94",
  leaf: "111,168,60",
  amber: "242,166,59",
  // For washes *on* a colored field rather than on cream: a white blob at 12
  // to 16 percent reads as a highlight, not as a shape.
  white: "255,255,255",
};

/**
 * Soft watercolor wash: a radial gradient blob at 6 to 10 percent.
 *
 * Sits behind content to keep large cream areas from reading as empty, without
 * introducing a saturated background (see the color distribution rule).
 */
export function WatercolorWash({
  tone = "pink",
  className,
  strength = 0.08,
}: {
  tone?: WashTone;
  className?: string;
  strength?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        background: `radial-gradient(circle, rgba(${TONES[tone]},${strength}) 0%, rgba(${TONES[tone]},0) 70%)`,
      }}
    />
  );
}
