import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourcesHeroBackdrop } from "@/components/resources/ResourcesHeroBackdrop";
import { getAllArticles } from "@/lib/mdx";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Parent Resources",
  description:
    "Practical guides for Elk Grove families comparing child care, planning costs, checking licenses, applying for assistance, and preparing for the first day.",
  path: "/resources",
  keywords: [
    "choosing a daycare Elk Grove",
    "child care subsidy Sacramento",
    "home daycare guide",
  ],
});

export default function ResourcesPage() {
  const articles = getAllArticles();
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
        label="Parent resources"
        title="Straight answers about choosing child care."
        subtitle="Practical guides for Elk Grove families comparing care, planning costs, and preparing for the first day. They are here to help, whether or not you choose T.L.C. Footprints."
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
          {articles.length} guides · updated {articles[0]?.updated}
        </p>
      </PageHero>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <SectionLabel className="text-center">The library</SectionLabel>
            <h2 className="mt-3 text-h2 text-cocoa">Start with the question on your mind</h2>
          </AnimatedSection>

          <AnimatedGroup
            as="ul"
            stagger={0.06}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {articles.map((a) => (
              <AnimatedItem as="li" key={a.slug}>
                <ResourceCard article={a} />
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      <CTABand
        title="Still have a question?"
        body="Call or text me. I am happy to talk through your family's needs and help you decide what to do next."
      />
    </>
  );
}
