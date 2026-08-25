/**
 * Build-time deployment settings shared by metadata and client-side asset
 * helpers. Set both values in the hosting provider; neither is a secret.
 */
export const DEPLOY_TARGET = process.env.DEPLOY_TARGET ?? "github-pages";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const defaultSiteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : DEPLOY_TARGET === "cloudflare"
      ? "https://tlcfootprints.com"
      : "https://alectronic-solutions.github.io/TLCFootprintsmockupsite";

/** The canonical root, including the repository path for a Pages preview. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl
).replace(/\/+$/, "");

/** Only the final Cloudflare build should be eligible for search indexing. */
export const IS_INDEXABLE =
  process.env.NODE_ENV === "production" && DEPLOY_TARGET === "cloudflare";

/** Prefixes a public asset with the active deploy base path. */
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Returns an absolute URL for a public asset without duplicating basePath. */
export function absoluteAsset(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
