import type { FootRegion } from "./checklistPieces";

/**
 * Shared geometry between FootShape.tsx (the assembled foot) and
 * PuzzleTile.tsx (the same regions cut out individually for the tray).
 * Lives in one file so a tile's shape and its slot on the foot can never
 * drift apart - both are cropped from the exact same path and ellipses.
 *
 * Traced from the sole-and-heart outline in components/brand/Footprints.tsx
 * (FootprintGlyph), scaled up as the one large foot this puzzle needs rather
 * than the small pair that file draws.
 */

// Sole outline with the heart cutout, unchanged from FootprintGlyph.
export const SOLE_D =
  "M 9.6 26 C 9.2 24.8, 9.6 24.4, 9.9 23.1 C 10.3 21.8, 10.2 21.8, 11 20.9 C 11.8 19.9, 11.9 19.9, 13.2 19.3 C 14.5 18.7, 14.6 18.6, 16.2 18.3 C 17.8 18, 17.9 18, 19.5 18.1 C 21.1 18.2, 21.2 18.2, 22.8 18.7 C 24.4 19.2, 24.5 19.2, 25.9 20 C 27.3 20.8, 27.4 20.9, 28.5 22 C 29.6 23.1, 29.7 23.2, 30.4 24.6 C 31.1 26, 31.1 26.1, 31.3 27.6 C 31.5 29.1, 31.4 29.1, 31.3 30.6 C 31.2 32.1, 31.2 32.2, 31 33.6 C 30.8 35, 30.9 35, 30.6 36.4 C 30.4 37.8, 30.4 37.8, 30 39.2 C 29.6 40.6, 29.6 40.6, 29 41.9 C 28.4 43.2, 28.5 43.3, 27.4 44.4 C 26.3 45.5, 26.3 45.6, 24.7 46.2 C 23.1 46.8, 22.9 46.8, 21.2 46.8 C 19.4 46.8, 19.2 46.8, 17.7 46.2 C 16.2 45.6, 16.1 45.4, 15.1 44.3 C 14.1 43.1, 14.2 43, 13.8 41.6 C 13.4 40.2, 13.4 40.2, 13.6 38.8 C 13.8 37.4, 14.2 37.3, 14.5 35.9 C 14.8 34.5, 15.1 34.5, 14.8 33 C 14.5 31.6, 14.3 31.4, 13.4 30.1 C 12.6 28.8, 12.4 28.9, 11.4 27.9 C 10.4 26.9, 10 27.2, 9.6 26 Z M 20.8 33.6 C 23.4 30.6, 25.5 28.6, 25.5 26.3 C 25.5 24.5, 24.4 23.2, 22.9 23.2 C 22.1 23.2, 21.3 23.6, 20.8 24.3 C 20.3 23.6, 19.5 23.2, 18.7 23.2 C 17.2 23.2, 16.1 24.5, 16.1 26.3 C 16.1 28.6, 18.2 30.6, 20.8 33.6 Z";

// Sole spans y 18.0 (ball, where the toes attach) to 46.8 (heel). The ball is
// divided down its center for the separate breakfast and snack pieces; the
// lower two bands remain full-width.
export const BALL_BAND = { y: 18.0, height: 9.6 };
export const BALL_LEFT_BAND = { x: 7.5, width: 13.3, ...BALL_BAND };
export const BALL_RIGHT_BAND = { x: 20.8, width: 13.5, ...BALL_BAND };
export const ARCH_BAND = { y: 27.6, height: 9.6 };
export const HEEL_BAND = { y: 37.2, height: 9.6 };

export const BIG_TOE = { cx: 11.9, cy: 15.0, rx: 3.1, ry: 3.8, rotate: -26 };
export const OTHER_TOES = [
  { cx: 18.8, cy: 13.0, rx: 2.4, ry: 2.85, rotate: -6 },
  { cx: 23.9, cy: 12.8, rx: 2.2, ry: 2.6, rotate: 8 },
  { cx: 28.2, cy: 14.7, rx: 2.0, ry: 2.35, rotate: 20 },
  { cx: 31.4, cy: 18.0, rx: 1.8, ry: 2.1, rotate: 32 },
];

/** The foot's full natural bounding box, same as the Footprint wrapper in Footprints.tsx. */
export const FOOT_VIEWBOX = "7.7 9.1 26.6 38.6";

/**
 * A tight viewBox cropped to just one region, for the tray tile's own small
 * SVG. The two lower sole bands share the sole's full x-extent, while the ball
 * uses two matching half-width crops so the tray pieces visibly join into one
 * band on the completed foot.
 */
export const REGION_VIEWBOX: Record<FootRegion, string> = {
  ballLeft: `${BALL_LEFT_BAND.x} ${BALL_BAND.y - 0.8} ${BALL_LEFT_BAND.width} ${BALL_BAND.height + 1.6}`,
  ballRight: `${BALL_RIGHT_BAND.x} ${BALL_BAND.y - 0.8} ${BALL_RIGHT_BAND.width} ${BALL_BAND.height + 1.6}`,
  arch: `7.5 ${ARCH_BAND.y - 0.8} 25 ${ARCH_BAND.height + 1.6}`,
  heel: `7.5 ${HEEL_BAND.y - 0.8} 25 ${HEEL_BAND.height + 1.6}`,
  toeOne: "7.6 10.4 7.8 9.2",
  toeTwo: "15.8 9.4 18.2 11.8",
};
