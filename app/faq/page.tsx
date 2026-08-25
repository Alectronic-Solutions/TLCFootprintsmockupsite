import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { Accordion } from "@/components/ui/Accordion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { BUSINESS, FAQS } from "@/lib/constants";
import { breadcrumbJsonLd, faqJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Licensing, hours, rates, meals, Child Action, tours, and enrollment questions answered for T.L.C. Footprints Home Daycare in Elk Grove, CA.",
  path: "/faq",
  keywords: ["home daycare questions Elk Grove", "licensed daycare Elk Grove"],
});

export default function FaqPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      <PageHero
        label="Frequently asked questions"
        title="Answers to the questions families ask most"
        subtitle="Find the essentials on licensing, hours, rates, meals, enrollment, and tours. If your question is not here, call or text me."
        align="center"
        backdrop
        backdropScrimClassName="bg-cream/25"
        decor={false}
        contentClassName="rounded-2xl border-hair border-cocoa/10 bg-cream/90 px-6 py-8 shadow-soft backdrop-blur-sm sm:px-10 sm:py-10"
      />

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <section className="section-y bg-cream-deep">
        <div className="container-prose">
          <AnimatedSection>
            <div className="rounded-2xl border-hair border-cocoa/10 bg-cream px-6 py-2 shadow-soft sm:px-8">
              <Accordion items={FAQS} align="center" />
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-8 text-center">
            <p className="text-cocoa-mid">
              Need an answer about your family&apos;s situation? Call or text{" "}
              <a
                href={BUSINESS.phoneHref}
                className="font-semibold text-cocoa underline underline-offset-4 hover:text-pink-dark"
              >
                {BUSINESS.phone}
              </a>
              .
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTABand />
    </>
  );
}
