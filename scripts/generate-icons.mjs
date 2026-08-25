// Renders the PNG icons from app/icon.svg, so the raster icons can never drift
// from the mark the site itself draws.
//
//   npm run generate-icons
//
// app/icon.svg is the source of truth: it is the same rainbow-with-footprints
// as <FootprintMark>, and Safari and the older tab bars that cannot take an SVG
// get these fallbacks instead.

import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const source = readFileSync(path.join(rootDir, "app", "icon.svg"));
const publicDir = path.join(rootDir, "public");

const CREAM = "#FDF8F0";

/**
 * The mark is 110x62, so it never fills a square. Rather than letting `fit:
 * contain` centre it inside its own bounding box and leave a wide margin on
 * every side - which at 48px shrinks the footprints to two or three pixels and
 * loses them - render it at a chosen width and place it on the canvas by hand.
 */
async function markOn({ size, width, background, radius }) {
  const mark = await sharp(source, { density: 640 })
    .resize({ width })
    .png()
    .toBuffer();
  const { height } = await sharp(mark).metadata();

  const plate = radius
    ? Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
          `<rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>` +
          `</svg>`,
      )
    : null;

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      ...(plate ? [{ input: plate, top: 0, left: 0 }] : []),
      {
        input: mark,
        top: Math.round((size - height) / 2),
        left: Math.round((size - width) / 2),
      },
    ])
    .png()
    .toBuffer();
}

// Tab icon: transparent, and as wide as the canvas allows. A pixel of bleed on
// each side is all the margin a 48px favicon can afford.
writeFileSync(
  path.join(publicDir, "favicon-48.png"),
  await markOn({ size: 48, width: 46 }),
);

// Home-screen icon: iOS puts it on a light background and rounds it itself, so
// it gets the cream plate and the usual ~18% inset.
writeFileSync(
  path.join(publicDir, "apple-touch-icon.png"),
  await markOn({ size: 180, width: 130, background: CREAM, radius: 38 }),
);

console.log("Wrote public/favicon-48.png and public/apple-touch-icon.png");
