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
    // Required for `output: "export"`: there is no server to transcode at
    // request time, so images are optimized ahead of time by scripts/optimize-images.mjs.
    unoptimized: true,
  },
};

export default nextConfig;
