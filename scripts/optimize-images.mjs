// Converts public/photos/*.jpg or *.png to WebP, resizing anything wider than
// 1920px. The site's illustrated heroes already live in public as WebP files.
//
// `images.unoptimized: true` is required for static export, which means Next
// cannot transcode or resize at request time. This has to happen at build time
// instead. Run it after adding new photos:
//
//   npm run optimize-images

import sharp from "sharp";
import { readdirSync, unlinkSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const photosDir = path.join(rootDir, "public", "photos");
const MAX_WIDTH = 1920;
const QUALITY = 82;

if (!existsSync(photosDir)) {
  mkdirSync(photosDir, { recursive: true });
  console.log("Created public/photos. Drop LaTrell's photos in there before launch.");
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
