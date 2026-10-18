import { PHOTO_WIDTHS, photoVariantName } from "./photoSizes.mjs";

/**
 * next/image loader for the static export. There is no image server, so each
 * srcset width is pointed at the smallest pre-resized copy that covers it
 * (written by scripts/optimize-images.mjs), and anything wider gets the
 * original. Only photos have copies; any other src passes through untouched.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!/\/photos\/[^/]+\.webp$/i.test(src)) return src;
  const fit = PHOTO_WIDTHS.find((w) => w >= width);
  return fit ? photoVariantName(src, fit) : src;
}
