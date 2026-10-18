// Widths each photo is pre-resized to, shared by scripts/optimize-images.mjs
// (which writes them) and lib/imageLoader.ts (which points srcset at them).
// Anything wider is served the original, which the script caps at 1920px.
//
// 640 covers a phone at 1.5x, 1080 a phone at 2.6x or a half-width desktop slot.
export const PHOTO_WIDTHS = [640, 1080];

export function photoVariantName(file, width) {
  return file.replace(/\.webp$/i, `-${width}w.webp`);
}

export const VARIANT_PATTERN = /-\d+w\.webp$/i;
