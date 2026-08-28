import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { ResourcesHeroBackdrop } from "@/components/resources/ResourcesHeroBackdrop";
import {
  ResourceLibrary,
  type ResourceBookData,
} from "@/components/resources/ResourceLibrary";
import { getAllArticles } from "@/lib/mdx";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Parent Resources",
  description:
    "A focused family resource library for checking California child care licenses, applying for Child Action assistance, comparing care, and preparing to enroll.",
  path: "/resources",
  keywords: [
    "choosing a daycare Elk Grove",
    "child care subsidy Sacramento",
    "home daycare guide",
  ],
});

const HANDBOOK_SLUGS = [
  "family-guide-choosing-licensed-child-care",
  "family-guide-child-action-and-costs",
  "family-guide-enrollment-and-first-days",
  "family-guide-daily-care",
  "family-guide-health-medicine-and-sick-days",
  "family-guide-pickup-contacts-and-records",
] as const;

const bookComponents = {
  h2: (props: React.ComponentProps<"h2">) => <h2 className="text-h3" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-6 text-[1.2rem] font-semibold leading-snug" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => <p className="mt-4 text-base text-ink" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-4 list-outside list-disc space-y-2 pl-5 marker:text-leaf-dark" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="mt-4 list-outside list-decimal space-y-2 pl-5 marker:font-semibold marker:text-leaf-dark"
      {...props}
    />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="text-base text-ink" {...props} />,
  a: ({ href = "", ...props }: React.ComponentProps<"a">) => {
    const classes =
      "break-words font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark";
    return href.startsWith("/") ? (
      <Link href={href} className={classes} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />
    );
  },
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-bold text-cocoa" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-5 rounded-r-xl border-l-4 border-l-leaf bg-leaf-light/55 py-3 pl-4 pr-3 [&>p]:mt-0 [&>p+p]:mt-3"
      {...props}
    />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="mt-5 overflow-x-auto rounded-xl border-hair border-cocoa/10">
      <table className="tabular w-full min-w-[28rem] text-center text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="border-b-hair border-cocoa/10 bg-cream-deep p-3 font-bold text-cocoa" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border-b-hair border-cocoa/10 p-3" {...props} />
  ),
};

const MAX_BOOK_PAGE_WORDS = 220;

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function splitLongBookSection(source: string): string[] {
  if (wordCount(source) <= MAX_BOOK_PAGE_WORDS || !/^###\s/m.test(source)) {
    return [source];
  }

  const parts = source.split(/\n(?=###\s)/g);
  const pages: string[] = [];
  let current = parts[0];

  for (const part of parts.slice(1)) {
    const combined = `${current}\n${part}`;
    if (wordCount(current) >= 80 && wordCount(combined) > MAX_BOOK_PAGE_WORDS) {
      pages.push(current);
      current = part;
    } else {
      current = combined;
    }
  }

  if (current.trim()) pages.push(current);
  return pages;
}

function splitIntoBookPages(body: string, slug: string): ResourceBookData["pages"] {
  const sources = body
    .trim()
    .split(/\n(?=##\s)/g)
    .flatMap(splitLongBookSection);

  return sources.map((source, index) => {
      const heading = source.match(/^#{2,3}\s+(.+)$/m)?.[1]?.trim();
      return {
        label: heading ?? (index === 0 ? "A quick start" : `Page ${index + 1}`),
        content: <MDXRemote key={`${slug}-${index}`} source={source} components={bookComponents} />,
      };
    });
}

export default function ResourcesPage() {
  const articles = getAllArticles();
  const books: ResourceBookData[] = HANDBOOK_SLUGS.map((slug) =>
    articles.find((article) => article.slug === slug),
  )
    .filter((article): article is NonNullable<typeof article> => Boolean(article))
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      updated: article.updated,
      readingTime: article.readingTime,
      topic: article.topic,
      pages: splitIntoBookPages(article.body, article.slug),
    }));
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      <PageHero
        label="The family resource library"
        title="A useful shelf for your child care search."
        subtitle={
          <>
            <span className="block">No filler and no endless parenting feed.</span>{" "}
            <span className="mt-1 block">
              Just practical help for checking a license, paying for care, choosing a provider,
              and getting ready to enroll.
            </span>
          </>
        }
        align="center"
        decor={false}
        backdrop={<ResourcesHeroBackdrop />}
        // Keep the footprints present as texture rather than competing with
        // the hero message: this cream veil gives the artwork a deliberately
        // faded, printed-underlay feel.
        backdropScrimClassName="bg-cream/55"
        contentClassName="max-w-[46rem] rounded-[1.5rem] border border-white/90 bg-cream/[0.94] px-5 py-7 shadow-lift sm:px-10 sm:py-9"
      >
        <p className="text-sm text-cocoa-mid">
          6 purposeful handbooks · official links included · written for T.L.C. families
        </p>
      </PageHero>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <ResourceLibrary books={books} />

      <CTABand
        title="Your family may not fit a checklist."
        body="Call or text me. I am happy to talk through your child’s needs, your schedule, and what a comfortable start could look like."
        from="bg-cream-deep"
      />
    </>
  );
}
