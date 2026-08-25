import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans, Great_Vibes, Caveat } from "next/font/google";
import "./globals.css";
import { PaperGrain } from "@/components/brand/Texture";
import { FootprintTrail } from "@/components/effects/FootprintTrail";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { BackToTop } from "@/components/ui/BackToTop";
import { BUSINESS } from "@/lib/constants";
import {
  SITE_URL,
  asset,
  localBusinessJsonLd,
  websiteJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import { IS_INDEXABLE } from "@/lib/site";

/**
 * Fraunces carries the SOFT and WONK axes, which is what makes it read warm
 * rather than institutional. Latin subset only, to stay inside the font budget.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

/** Used on a handful of glyphs only: the wordmark, the tagline, one pull-quote. */
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

/**
 * The hero's licence line, and nothing else.
 *
 * Great Vibes was tried there first and could not hold it: it is copperplate,
 * and its hairlines stop resolving well above the size an eyebrow can occupy.
 * Caveat is a casual hand with even strokes and a tall x-height, which is what
 * makes it readable at 27px where the other is not. Variable 400-700 in one
 * file, latin only.
 */
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} | Licensed Home Daycare in Elk Grove, CA`,
    template: `%s | ${BUSINESS.shortName}`,
  },
  description:
    "Licensed, play-based home daycare in Elk Grove for children birth through age five. View rates, check availability, and request a tour. Child Action accepted.",
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.owner }],
  creator: BUSINESS.owner,
  icons: {
    icon: [
      { url: asset("/icon.svg"), type: "image/svg+xml" },
      { url: asset("/favicon-48.png"), type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: asset("/apple-touch-icon.png") }],
  },
  manifest: asset("/manifest.json"),
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false, noarchive: true },
  formatDetection: { telephone: true, address: false, email: true },
};

export const viewport: Viewport = {
  themeColor: "#FDF8F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunito.variable} ${greatVibes.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }}
        />
      </head>
      <body className="bg-cream text-ink">
        {/* framer-motion serialises its initial styles into the SSR markup, so
            without JS the copy is in the HTML but invisible: opacity:0 on every
            scroll-revealed section, and a closed clip edge on the two lines
            that are written by hand rather than faded in. */}
        <noscript>
          <style>
            {`[style*="opacity"]{opacity:1!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}`}
          </style>
        </noscript>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <PaperGrain />
        {/* Mouse-only, and silent under prefers-reduced-motion. See the
            component for why it is spaced by distance rather than by time. */}
        <FootprintTrail />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <MobileActionBar />
        <BackToTop />
      </body>
    </html>
  );
}
