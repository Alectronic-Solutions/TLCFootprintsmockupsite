import type { Metadata } from "next";
import { BUSINESS, FAQS, PROGRAMS } from "./constants";
import { absoluteAsset, SITE_URL } from "./site";

export { BASE_PATH, SITE_URL, asset } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

/**
 * Per-page metadata.
 *
 * Head terms go to service pages, long tail to resource articles: no two
 * pages target the same phrase, which is what prevents keyword cannibalization.
 */
export function pageMeta({
  title,
  description,
  path,
  keywords = [],
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = path === "/" ? title : `${title} | ${BUSINESS.shortName}`;

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: BUSINESS.name,
      title: socialTitle,
      description,
      images: [
        {
          url: absoluteAsset("/og.png"),
          width: 1200,
          height: 630,
          alt: `${BUSINESS.name}. ${BUSINESS.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteAsset("/og.png")],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Structured data                                                           */
/* -------------------------------------------------------------------------- */

const ADDRESS = {
  "@type": "PostalAddress",
  // City-level only. A home daycare should not publish a street address, and
  // the brief gives neither a ZIP nor coordinates, so neither is asserted.
  addressLocality: BUSINESS.city,
  addressRegion: BUSINESS.state,
  addressCountry: "US",
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ChildCare",
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS.name,
  alternateName: BUSINESS.shortName,
  description: `A licensed California Family Child Care Home in ${BUSINESS.city}, CA offering play-based, child-led care for children birth through age five.`,
  slogan: BUSINESS.tagline,
  url: SITE_URL,
  image: absoluteAsset("/og.png"),
  logo: absoluteAsset("/icon.svg"),
  telephone: BUSINESS.phoneHref.replace("tel:", ""),
  email: BUSINESS.email,
  address: ADDRESS,
  // The city is the whole service area claim. The five Elk Grove neighborhoods
  // that used to be listed here were not hers, and they also rendered on the
  // tour page as "families come from" - a clientele claim at a home that is
  // still enrolling its first families.
  areaServed: [
    {
      "@type": "City",
      name: BUSINESS.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `${BUSINESS.county}, ${BUSINESS.stateFull}`,
      },
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: BUSINESS.hours.open24,
      closes: BUSINESS.hours.close24,
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "USD",
  // Only what the brief names. Cash and check were assumed.
  paymentAccepted: "Child Action childcare subsidy",
  // The state license, published so it can be verified.
  identifier: {
    "@type": "PropertyValue",
    name: "California Community Care Licensing facility number",
    value: BUSINESS.license,
  },
  founder: { "@type": "Person", name: BUSINESS.owner },
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 0,
    suggestedMaxAge: 5,
  },
};

/** Gives Google an explicit, stable site-name signal on the canonical home page. */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BUSINESS.name,
  alternateName: BUSINESS.shortName,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#business` },
};

export const offerCatalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: `${BUSINESS.shortName} programs and rates`,
  url: `${SITE_URL}/programs`,
  itemListElement: PROGRAMS.flatMap((p) => [
    {
      "@type": "Offer",
      name: `${p.name}, Full-Time`,
      price: p.fullTime,
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.fullTime,
        priceCurrency: "USD",
        unitText: "WEEK",
      },
    },
    {
      "@type": "Offer",
      name: `${p.name}, Part-Time`,
      price: p.partTime,
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.partTime,
        priceCurrency: "USD",
        unitText: "WEEK",
      },
    },
  ]),
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  updated,
}: {
  title: string;
  description: string;
  slug: string;
  updated: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}/resources/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/resources/${slug}`,
    },
    image: absoluteAsset("/og.png"),
    dateModified: toIsoMonthDate(updated),
    inLanguage: "en-US",
    // The guides are published by the daycare, rather than attributed to an
    // individual provider, to match the visible byline on every article.
    author: {
      "@type": "Organization",
      name: BUSINESS.shortName,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      url: SITE_URL,
    },
    isPartOf: { "@id": `${SITE_URL}/#business` },
  };
}

/** Converts article frontmatter like "August 2026" to a Schema.org ISO date. */
export function toIsoMonthDate(value: string): string {
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return value;

  const month = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ].indexOf(match[1].toLowerCase());

  return month === -1
    ? value
    : `${match[2]}-${String(month + 1).padStart(2, "0")}-01`;
}

/** Serializes JSON-LD for a <script> tag, escaping the sequence that could break out. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
