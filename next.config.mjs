// One source tree supports both deployment stages:
//   - GitHub Pages client preview: /TLCFootprintsmockupsite
//   - Cloudflare Pages custom domain: /
// Local development always stays at http://localhost:3000/.
const deployTarget = process.env.DEPLOY_TARGET ?? "github-pages";
const basePath =
  process.env.NODE_ENV === "production" && deployTarget === "github-pages"
    ? "/TLCFootprintsmockupsite"
    : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  // Hides the dev-mode indicator. Do not add a custom `browserslist` to
  // package.json: with one present, Next shipped its dev-tools overlay
  // (~217 KB gzipped) in the production bundle on every route.
  devIndicators: false,
  images: {
    // `output: "export"` has no server to transcode at request time, so photos
    // are resized ahead of time by scripts/optimize-images.mjs and this loader
    // maps each srcset width onto those files.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // The original (capped at 1920) plus the copies in lib/photoSizes.mjs.
    // imageSizes stays small: every width below 640 resolves to the 640 copy.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [320],
  },
};

export default nextConfig;
