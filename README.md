# Site source

A Next.js site exported as static HTML.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
```

Node 20 or newer. Do not run `npm run build` while `npm run dev` is running; both write to `.next`. If the dev server will not load, stop it, delete `.next`, and start it again.

## Where things live

```
app/                  One folder per page
components/           UI, grouped by page or purpose
content/resources/    Articles, as .mdx files
lib/
  constants.ts        Site content and settings. Single source of truth.
  photos.ts           Photo slots: filename, alt text, crop.
  seo.ts              Page metadata and structured data
  site.ts             Build-time deploy settings
public/               Icons, images, photos
scripts/              Image optimization and icon generation
```

Text is not typed directly into components. It comes from `lib/constants.ts`, so a change there updates every page that uses it.

## Photos

1. Put the file in `public/photos/`.
2. Set that slot's `src` in `lib/photos.ts`.
3. Run `npm run optimize-images`.

An empty slot renders a placeholder.

## Deployment

The build reads two environment variables:

| Variable | Purpose |
| --- | --- |
| `DEPLOY_TARGET` | `github-pages` (preview) or `cloudflare` (production) |
| `NEXT_PUBLIC_SITE_URL` | Canonical root URL for the build |

Only a production build with `DEPLOY_TARGET=cloudflare` is indexable. Every other build is served with `noindex, nofollow` and an empty sitemap.
