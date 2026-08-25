// One source tree supports both deployment stages:
//   - GitHub Pages client preview: /TLCFootprints2
//   - Cloudflare Pages custom domain: /
// Local development always stays at http://localhost:3000/.
const deployTarget = process.env.DEPLOY_TARGET ?? "github-pages";
const basePath =
  process.env.NODE_ENV === "production" && deployTarget === "github-pages"
    ? "/TLCFootprints2"
    : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  images: {
    // Required for `output: "export"`: there is no server to transcode at
    // request time, so images are optimized ahead of time by scripts/optimize-images.mjs.
    unoptimized: true,
  },
};

export default nextConfig;
