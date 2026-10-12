import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ChildActionSection } from "@/components/home/ChildActionSection";
import { HighlightsBar } from "@/components/home/HighlightsBar";
import { ThelmaStory } from "@/components/home/ThelmaStory";
import {
  DifferentiatorBlocks,
  type Differentiator,
} from "@/components/home/DifferentiatorBlocks";
import { EnrollmentSteps } from "@/components/home/EnrollmentSteps";
import { RatesPanel } from "@/components/home/RatesPanel";
import { CTABand } from "@/components/sections/CTABand";
import { DayBand } from "@/components/sections/DayBand";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BUSINESS, HOME_FAQS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { asset } from "@/lib/site";

export const metadata = pageMeta({
  title: `Licensed Home Daycare in Elk Grove, CA | ${BUSINESS.shortName}`,
  description:
    "Licensed, play-based home daycare in Elk Grove for children birth through age five. View rates, check availability, and request a tour. Child Action accepted.",
  path: "/",
  keywords: [
    "home daycare Elk Grove",
    "licensed daycare Elk Grove",
    "family childcare Elk Grove",
    "home childcare near me",
  ],
});

/**
 * The home page answers six questions in order, and nothing else:
 *
 *   Is there room for my child?      The hero status pill, the highlights bar
 *   Can I get help paying?           The Child Action starting path
 *   Why a home instead of a center?  Differentiators
 *   What does it cost?               Rates
 *   What is the day like?            Inside the day
 *   Can I trust her?                 The name, the process, the FAQ
 *
 * Anything else belongs on an interior page. State each fact prominently
 * once, and repeat it only where it helps someone act (the FAQ and the CTAs).
 */

/* `edge` is the painted top edge of each block, taken from the dominant colour
   of the mark above it so the two never disagree. */
const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: "constant",
    edge: "leaf",
    /* Continuity is the one thing here a center cannot offer. Ages and
       "small" are stated elsewhere on the page. */
    title: "Consistent care in a familiar home setting",
    titleBreakAfter: "Consistent care",
    body: "No moving up to a different room every September. Your child stays where they started, first day to last.",
  },
  {
    icon: "home",
    edge: "pink",
    title: "A small group",
    titleBreakAfter: "A small",
    body: "I know each child's temperament, what settles them, and what they are working on right now.",
  },
  {
    icon: "play",
    edge: "amber",
    title: "Play-based and child-led",
    titleBreakAfter: "Play-based and",
    body: "Children learn by exploring and asking questions, inside a routine they can count on.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <HighlightsBar />
      <ArcDivider variant="shallow" from="bg-cream-deep" to="fill-cream" />

      <ChildActionSection />

      <ArcDivider variant="deep" from="bg-cream" to="fill-cream-deep" />

      <RatesPanel />

      <ArcDivider variant="scallop" from="bg-cream-deep" to="fill-cream" />

      {/* Why a home */}
      <section className="section-y relative overflow-hidden bg-cream">
        <div className="container-page relative">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <SectionLabel className="text-center">Why families choose us</SectionLabel>
            <h2 className="mt-4 text-h2">A home, not a center</h2>
            {/* This lead names the three benefits developed by the cards below,
                so it makes sense even when this is the first section a visitor
                reads. Avoid vague references such as "what that changes" here:
                there is no preceding explanation for "that" to point to. */}
            <p className="mx-auto mt-5 max-w-[46ch] text-lead text-ink">
              Home-based care gives your child consistency, personal attention,
              and room to grow.
            </p>
          </AnimatedSection>

          <DifferentiatorBlocks items={DIFFERENTIATORS} />
        </div>
      </section>

      {/* Inside the day: what a day contains, in phrases drawn from PROGRAMS.
          Deliberately not a schedule. The clock is the only place in this
          section that states the hours. */}
      <DayBand
        side="clock-left"
        copyAlign="text-center"
        label="Inside the day"
        title="Long stretches of play that nobody interrupts"
        lead={
          <>
            <span className="block text-balance font-semibold text-cocoa">
              Sensory play, building, music, and storybook time.
            </span>{" "}
            <span className="mt-1 block text-balance">
              The same rhythm every day, so your child knows what comes next.
            </span>
          </>
        }
        /* The infant half of the home, which the rest of this section would
           otherwise leave out: everything above it describes a child who is
           walking around. */
        body={
          <span className="block text-balance">
            Infant routines are responsive to each child&apos;s individual
            feeding and sleep needs while following safe-sleep and licensing
            guidelines.
          </span>
        }
        link={{ href: "/what-to-expect", label: "What families can expect" }}
      />

      {/* A clear, in-flow preview of the full "What to Expect" guide. */}
      <section className="relative overflow-hidden bg-cream pb-6 pt-2 sm:pb-10 sm:pt-4">
        <div className="container-page">
          <AnimatedSection className="mx-auto max-w-5xl">
            <Link
              href="/what-to-expect"
              className="group block overflow-hidden rounded-[2rem] border-hair border-cocoa/10 bg-cream-deep shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={asset("/photos/snack-table.webp")}
                  alt="A small table set with snacks, fruit, and children's cups at T.L.C. Footprints"
                  fill
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-cocoa/75 via-cocoa/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center sm:p-8">
                  <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-cream">
                    What families can expect
                  </p>
                  <p className="mx-auto mt-2 max-w-[38ch] text-lg font-semibold leading-snug text-white sm:text-xl">
                    Take a closer look at everyday care at T.L.C. Footprints.
                  </p>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* From here the page answers "can I trust her": the name, then the
          process, then the questions. */}
      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <ThelmaStory surface="bg-cream-deep" />

      <ArcDivider variant="deep" from="bg-cream-deep" to="fill-cream" />

      <EnrollmentSteps surface="bg-cream" />

      <ArcDivider variant="scallop" from="bg-cream" to="fill-cream-deep" />

      {/* FAQ preview. Centred the whole way down, including inside the cards:
          the section is a short, symmetrical run between two arc dividers, and
          a left-aligned accordion sitting under a centred heading reads as a
          different section that wandered in. The long-form /faq page keeps its
          left-aligned answers, where reading down a dozen of them matters more
          than the silhouette. */}
      <section className="section-y bg-cream-deep">
        <div className="container-prose">
          <AnimatedSection className="text-center">
            <SectionLabel className="text-center">Common questions</SectionLabel>
            <h2 className="mt-4 text-h2">The things parents ask first</h2>
            {/* Was a list of the accordion's own items, sitting directly on
                top of the accordion. */}
            <p className="mx-auto mt-4 max-w-[42ch] text-balance text-cocoa-mid">
              The ones I get asked most, answered straight.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <Accordion items={HOME_FAQS} headingLevel="h3" align="center" />
          </AnimatedSection>

          {/* A parent whose question is not one of the five needs somewhere to
              go that is not another page. The phone sits above the button so
              the cheaper answer is the one they meet first. */}
          <AnimatedSection className="mt-8 text-center">
            <p className="text-cocoa-mid">
              Not the question you came with? Call or text{" "}
              <a
                href={BUSINESS.phoneHref}
                className="font-semibold text-cocoa underline underline-offset-4 hover:text-pink-dark"
              >
                {BUSINESS.phone}
              </a>
              .
            </p>

            <Button href="/faq" variant="secondary" className="group mt-5">
              Read all questions
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <CTABand />
    </>
  );
}
