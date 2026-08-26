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
  // Next's dev-tools overlay (indicator, panel, segment explorer) is meant to
  // be stripped from production bundles by NODE_ENV dead-code elimination,
  // but it was leaking into this `output: "export"` build regardless -
  // ~217 KB of dev-only UI shipped in the shared JS chunk on every route.
  // Disabling the indicator here removes that leak.
  devIndicators: false,
  images: {
    // Required for `output: "export"`: there is no server to transcode at
    // request time, so images are optimized ahead of time by scripts/optimize-images.mjs.
    unoptimized: true,
  },
};

export default nextConfig;
