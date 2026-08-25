import { type ReactNode } from "react";
import { WatercolorWash } from "@/components/brand/Texture";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { cn } from "@/lib/cn";

/**
 * Decoration around the "Meet LaTrell" portrait: a wash behind it and a sprig
 * tucked at its corner, plus a caption slot that keeps the signature grouped
 * with the photo as one plate.
 *
 * This used to be ParallaxFrame - a scroll-linked follower that measured its
 * own travel with a ResizeObserver and smoothed the result through a spring.
 * That was the wrong tool for what the page wanted: a spring is always
 * drifting toward its target and never rests at it, so the portrait could
 * never read as *stuck*. The pinning is now native `position: sticky`,
 * applied by the caller in app/about/page.tsx, which is genuinely motionless
 * while held and costs no JS at all. There is deliberately no motion left in
 * this file.
 *
 * Purely presentational: it takes whatever `children` the caller gives it
 * (the `<Photo>` slot) and never touches the photo workflow in lib/photos.ts.
 */
export function PortraitFrame({
  children,
  caption,
  className,
}: {
  children: ReactNode;
  /**
   * Rendered under the photo, inside the same box the sprig anchors to. A
   * separate slot rather than more `children` because the sprig pins to the
   * bottom of the photo, not to the bottom of photo-plus-caption - passing
   * the signature as a child would push the sprig down below it.
   */
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Ground, so it sits on the static outer layer and behind everything
          the caller passes in. */}
      <WatercolorWash
        tone="amber"
        className="-left-10 -top-10 h-56 w-56"
        strength={0.09}
      />

      <div className="relative">
        {children}

        <BotanicalSprig
          flip
          leavesOnly
          windScale={1.1}
          className="pointer-events-none absolute -bottom-6 -right-6 hidden h-24 w-auto opacity-60 sm:block"
        />
      </div>

      {caption}
    </div>
  );
}
