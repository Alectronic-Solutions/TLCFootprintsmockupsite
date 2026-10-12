import { type ReactNode } from "react";
import { WatercolorWash } from "@/components/brand/Texture";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { cn } from "@/lib/cn";

/**
 * Decoration around the About page portrait: a wash behind it and a sprig
 * tucked at its corner, plus a caption slot that keeps the signature grouped
 * with the photo as one plate. Pinning is native `position: sticky`, applied
 * by the caller; there is no motion in this file.
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
