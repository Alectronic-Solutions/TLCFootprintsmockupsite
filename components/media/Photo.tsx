import Image from "next/image";
import { Camera } from "lucide-react";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import { asset } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * One photo slot.
 *
 * Renders the real photo once `lib/photos.ts` has a filename for it, and a
 * designed placeholder until then. Both states occupy exactly the same box,
 * because the aspect ratio comes from the config rather than from the file, so
 * filling a slot never moves the layout underneath it.
 *
 * `next/image` is running unoptimized here: the site is a static export with no
 * server to transcode at request time, so files are shrunk ahead of time by
 * `npm run optimize-images`. The width/height are still declared so the browser
 * reserves the box before the file arrives.
 */

const RATIO_CLASS: Record<string, string> = {
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
};

/** Nominal box, only ever used to give the browser an intrinsic ratio. */
const RATIO_SIZE: Record<string, { w: number; h: number }> = {
  "4/3": { w: 1600, h: 1200 },
  "3/2": { w: 1500, h: 1000 },
  "4/5": { w: 1200, h: 1500 },
  "1/1": { w: 1200, h: 1200 },
  "16/9": { w: 1600, h: 900 },
};

export function Photo({
  name,
  className,
  /** Set on the one photo above the fold. Everything else stays lazy. */
  priority = false,
  /** Rounds and shadows the slot. Off when the caller frames it itself. */
  framed = true,
  /**
   * Fill the nearest positioned ancestor instead of declaring a box.
   *
   * The declared ratio is what stops a slot from shifting the layout when it
   * is filled, so this is only for the case where the caller *is* the box -
   * a full-bleed background - and the ratio is therefore irrelevant. No frame
   * either: a full-bleed photo has no edge to dress.
   */
  fill = false,
  /**
   * Whether a full-bleed empty slot shows its "photo goes here" label.
   *
   * The hero has copy in its left half and an empty right half, so the label
   * has somewhere to live. The hours sections have copy on the right and a
   * clock dial with its legend filling the left, and no empty region at any
   * width - a label there lands behind something whichever corner you pick.
   * They pass "none", and the hatched fill carries the message on its own.
   * The shot spec is in lib/photos.ts and the README photo table, which is
   * where anyone filling the slot is reading anyway.
   *
   * Ignored unless `fill` is set: a framed slot has no copy over it.
   */
  fillLabel = "shown",
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  name: PhotoKey;
  className?: string;
  priority?: boolean;
  framed?: boolean;
  fill?: boolean;
  fillLabel?: "shown" | "none";
  sizes?: string;
}) {
  const photo = PHOTOS[name];
  const ratio = RATIO_CLASS[photo.ratio] ?? "aspect-[4/3]";
  const box = RATIO_SIZE[photo.ratio] ?? RATIO_SIZE["4/3"];

  const wrap = cn(ratio, "w-full", framed && "photo-frame", className);

  if (fill) {
    if (!photo.src) {
      return (
        <div className={cn("photo-placeholder absolute inset-0", className)}>
          {/* Off-center on purpose. A full-bleed slot has copy laid over it,
              and a label in the middle of the box sits behind the headline.
              Hidden below lg: the copy stacks over the whole frame there, so
              there is no quiet corner at all and it shows through the words. */}
          {fillLabel === "shown" && (
            <div
              aria-hidden="true"
              className="hidden px-6 text-center lg:absolute lg:right-[8%] lg:top-[30%] lg:block lg:w-[26%] lg:min-w-[16rem]"
            >
              <Camera className="mx-auto h-7 w-7 text-cocoa/25" />
              <p className="mt-3 text-eyebrow font-bold uppercase text-leaf-dark/70">
                Photo goes here
              </p>
              <p className="mx-auto mt-1.5 max-w-[24ch] text-sm leading-snug text-cocoa-mid/80">
                {photo.spec}
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <Image
        src={asset(`/photos/${photo.src}`)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  if (!photo.src) {
    return (
      <div className={cn(wrap, "photo-placeholder grid place-items-center p-6")}>
        {/* aria-hidden throughout: an empty slot is not content, and announcing
            "photo placeholder" to a screen reader is noise, not information. */}
        <div aria-hidden="true" className="text-center">
          <Camera className="mx-auto h-7 w-7 text-cocoa/25" />
          <p className="mt-3 text-eyebrow font-bold uppercase text-leaf-dark/70">
            Photo goes here
          </p>
          <p className="mx-auto mt-1.5 max-w-[24ch] text-sm leading-snug text-cocoa-mid/80">
            {photo.spec}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <Image
        src={asset(`/photos/${photo.src}`)}
        alt={photo.alt}
        width={box.w}
        height={box.h}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
