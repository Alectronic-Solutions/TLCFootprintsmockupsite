import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { CTABand } from "@/components/sections/CTABand";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { HeartDots } from "@/components/brand/HeartDots";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ResourcesHeroBackdrop } from "@/components/resources/ResourcesHeroBackdrop";
import { getAllArticles, getArticle, getRelated } from "@/lib/mdx";
import { BUSINESS } from "@/lib/constants";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
  pageMeta,
} from "@/lib/seo";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return pageMeta({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.summary,
    path: `/resources/${article.slug}`,
    keywords: article.keywords,
  });
}

/** Prose styling for MDX output. Articles ship no client JS of their own. */
const components = {
  h2: (p: React.ComponentProps<"h2">) => (
    <h2 className="mt-9 scroll-mt-28 text-h2 first:mt-0" {...p} />
  ),
  h3: (p: React.ComponentProps<"h3">) => (
    <h3 className="mt-8 scroll-mt-28 text-h3" {...p} />
  ),
  p: (p: React.ComponentProps<"p">) => (
    <p className="mt-5 text-article text-ink" {...p} />
  ),
  ul: (p: React.ComponentProps<"ul">) => (
    <ul
      className="mt-5 list-outside list-disc space-y-2.5 pl-6 marker:text-leaf-dark"
      {...p}
    />
  ),
  ol: (p: React.ComponentProps<"ol">) => (
    <ol
      className="mt-5 list-outside list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-leaf-dark"
      {...p}
    />
  ),
  li: (p: React.ComponentProps<"li">) => (
    <li className="text-article text-ink" {...p} />
  ),
  a: ({ href = "", ...p }: React.ComponentProps<"a">) => {
    const internal = href.startsWith("/");
    const cls =
      "break-words [overflow-wrap:anywhere] font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark";
    return internal ? (
      <Link href={href} className={cls} {...p} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...p} />
    );
  },
  strong: (p: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-cocoa" {...p} />
  ),
  blockquote: (p: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-6 rounded-r-xl border-l-4 border-l-leaf bg-leaf-light/40 py-4 pl-5 pr-4 [&>p]:mt-0 [&>p+p]:mt-3"
      {...p}
    />
  ),
  table: (p: React.ComponentProps<"table">) => (
    <div className="mt-6">
      {/* Article tables are authored in MDX and can hold any number of
          columns, so they cannot be restacked into cards the way the rate
          table is. They scroll instead, and below md they say so: a table
          that scrolls without telling you is a table whose last column
          nobody reads. */}
      <div className="overflow-x-auto rounded-xl border-hair border-cocoa/10">
        <table className="tabular w-full min-w-[28rem] text-center text-base" {...p} />
      </div>
      <p className="mt-2 text-sm text-cocoa-mid md:hidden" aria-hidden="true">
        Scroll the table sideways to see every column.
      </p>
    </div>
  ),
  th: (p: React.ComponentProps<"th">) => (
    <th className="border-b-hair border-cocoa/10 bg-cream-deep p-3 font-semibold text-cocoa" {...p} />
  ),
  td: (p: React.ComponentProps<"td">) => (
    <td className="border-b-hair border-cocoa/10 p-3" {...p} />
  ),
  hr: () => <HeartDots className="my-8" />,
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelated(article);
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: article.title, path: `/resources/${article.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            articleJsonLd({
              title: article.title,
              description: article.summary,
              slug: article.slug,
              updated: article.updated,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      <article>
        <header className="relative isolate overflow-hidden bg-cream pt-[var(--header-h)]">
          <ResourcesHeroBackdrop />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-cream/55" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-cream to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-cream to-transparent"
          />

          <div className="container-prose relative py-9 text-center sm:py-11">
            <div className="rounded-[1.5rem] border border-white/90 bg-cream/[0.94] px-5 py-7 shadow-lift sm:px-10 sm:py-9">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cocoa-mid transition-colors hover:text-pink-dark"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All resources
              </Link>

              <h1 className="mt-6 text-h1">{article.title}</h1>
              <p className="mx-auto mt-5 max-w-[54ch] text-lead text-ink">{article.summary}</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-cocoa-mid">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {article.readingTime} min read
                </span>
                <span aria-hidden="true">·</span>
                <span>Last updated {article.updated}</span>
                <span aria-hidden="true">·</span>
                <span>By {BUSINESS.shortName}</span>
              </div>
            </div>
          </div>
        </header>

        <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

        <div className="bg-cream-deep py-10 sm:py-12">
          <div className="container-prose">
            <div className="rounded-2xl border-hair border-cocoa/10 bg-cream p-7 text-left shadow-soft sm:p-10">
              <MDXRemote source={article.body} components={components} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-y bg-cream">
          <div className="container-prose">
            <AnimatedSection>
              <h2 className="text-h3">Related reading</h2>
              <ul className="mt-6 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/resources/${r.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border-hair border-cocoa/10 bg-cream-deep p-5 transition-colors hover:bg-leaf-light/50"
                    >
                      <span className="font-semibold text-cocoa">{r.title}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-pink-dark transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </section>
      )}

      <CTABand
        title="Looking for care in Elk Grove?"
        body="T.L.C. Footprints is a licensed family child care home with limited openings. A tour can help you decide whether the setting feels right for your family."
        from={related.length > 0 ? "bg-cream" : "bg-cream-deep"}
      />
    </>
  );
}
