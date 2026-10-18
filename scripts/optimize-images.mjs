// Converts public/photos/*.jpg or *.png to WebP, resizing anything wider than
// 1920px, then writes the smaller widths in lib/photoSizes.mjs beside every
// photo. The site's illustrated heroes already live in public as WebP files.
//
// A static export has no server to transcode or resize at request time, so
// this has to happen at build time instead. lib/imageLoader.ts points each
// srcset entry at these files, which is what lets a phone download a 1080px
// photo rather than the 1920px original. Run it after adding new photos:
//
//   npm run optimize-images

import sharp from "sharp";
import { readdirSync, unlinkSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PHOTO_WIDTHS, photoVariantName, VARIANT_PATTERN } from "../lib/photoSizes.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const photosDir = path.join(rootDir, "public", "photos");
const MAX_WIDTH = 1920;
const QUALITY = 82;

if (!existsSync(photosDir)) {
  mkdirSync(photosDir, { recursive: true });
  console.log("Created public/photos. Drop La Trell's photos in there before launch.");
}

const files = readdirSync(photosDir).filter((f) => /\.(jpe?g|png)$/i.test(f));

if (files.length === 0) {
  console.log("No .jpg or .png files found in public/photos.");
}

for (const file of files) {
  const inputPath = path.join(photosDir, file);
  const outputPath = path.join(photosDir, file.replace(/\.(jpe?g|png)$/i, ".webp"));

  const image = sharp(inputPath);
  const meta = await image.metadata();
  const pipeline =
    meta.width && meta.width > MAX_WIDTH ? image.resize({ width: MAX_WIDTH }) : image;

  await pipeline.webp({ quality: QUALITY }).toFile(outputPath);
  console.log(`${file} -> ${path.basename(outputPath)}`);
  unlinkSync(inputPath);
}

console.log(`Converted ${files.length} photo(s) to WebP.`);

// Every width is written even for a photo narrower than it (never enlarged),
// because the loader assumes the file exists and would otherwise 404.
const photos = readdirSync(photosDir).filter((f) => /\.webp$/i.test(f) && !VARIANT_PATTERN.test(f));

for (const file of photos) {
  for (const width of PHOTO_WIDTHS) {
    await sharp(path.join(photosDir, file))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(photosDir, photoVariantName(file, width)));
  }
}

console.log(`Wrote ${PHOTO_WIDTHS.join("px, ")}px versions of ${photos.length} photo(s).`);
