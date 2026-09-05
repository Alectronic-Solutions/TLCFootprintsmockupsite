import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { RateBoard } from "@/components/programs/RateBoard";
import { ProgramPanels } from "@/components/programs/ProgramPanels";
import { FootprintChecklist } from "@/components/programs/FootprintChecklist";
import { ProgramsHeroArtwork } from "@/components/programs/ProgramsHeroArtwork";
import { BUSINESS } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  jsonLdScript,
  offerCatalogJsonLd,
  pageMeta,
} from "@/lib/seo";

export const metadata = pageMeta({
  title: "Programs & Rates",
  description:
    "Published weekly rates for infant, toddler, and preschool-age care at a licensed Elk Grove home daycare. Full-time and part-time. Child Action accepted.",
  path: "/programs",
  keywords: [
    "infant daycare Elk Grove",
    "toddler daycare Elk Grove",
    "preschool-age childcare Elk Grove",
    "home daycare rates Elk Grove",
  ],
});

export default function ProgramsPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Programs & Rates", path: "/programs" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(offerCatalogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      <PageHero
        label="Programs and rates"
        title="Clear tuition. No surprises."
        subtitle={`${BUSINESS.shortName} serves children from birth through age 5. Both full-time and part-time care are available in a small, licensed family child care home in ${BUSINESS.city}. Tuition rates are published here so families can decide whether the program is a good fit before scheduling a tour.`}
        decor={false}
        surface="bg-cream/95"
        align="center"
        contentClassName="md:rounded-3xl md:border-hair md:border-cocoa/10 md:bg-cream/90 md:px-10 md:py-10 md:shadow-soft md:backdrop-blur-sm lg:-translate-x-28 lg:-translate-y-9"
        responsiveBackdrop={
          <ProgramsHeroArtwork
            imageSrc="/programs-hero-classroom-panorama.webp"
            mobileImageSrc="/programs-hero-classroom.webp"
            mobileFit="cover"
            mobileWidth={1401}
            mobileHeight={1123}
            mobilePosition="center"
          />
        }
        responsiveBackdropClassName="h-[52vh] min-h-[22rem]"
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/availability" variant="secondary">
            Check Availability
          </Button>
          <Button href="/tour">Request a Tour</Button>
        </div>
      </PageHero>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      {/* Rate board: the one place the big numbers live. */}
      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <h2 className="sr-only">Weekly child care rates</h2>
          <RateBoard />
        </div>
      </section>

      <ArcDivider variant="deep" from="bg-cream-deep" to="fill-cream" />

      <ProgramPanels />

      <ArcDivider variant="scallop" from="bg-cream" to="fill-cream-deep" />

      {/* Practical enrollment and meal details, after families have explored care. */}
      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <SectionLabel className="text-center">The practical details</SectionLabel>
            <h2 className="text-3d mt-4 text-h2">Put the pieces together.</h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-lead text-ink">
              The details that help your day run smoothly,
              <br className="hidden lg:block" />
              {" "}collected in one simple place.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mx-auto mt-9 max-w-6xl">
            <FootprintChecklist />
          </AnimatedSection>
        </div>
      </section>

      <CTABand
        title="Come see T.L.C. Footprints"
        body="Choosing child care is personal. A tour gives you the opportunity to see the environment, ask questions, and decide whether T.L.C. Footprints feels right for your family. Tours are available by appointment."
      />
    </>
  );
}
