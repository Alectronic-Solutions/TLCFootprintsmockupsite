import { ArrowRight } from "lucide-react";
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
 * Anything that is not one of those six belongs on an interior page. The full
 * thirteen-point expectations list and the meals breakdown both used to sit
 * here; they are now only on /what-to-expect, where a parent who wants that
 * level of detail goes looking for it. The home page had grown to twelve
 * sections and read as a wall.
 *
 * The rule the page is now edited against: state each fact prominently once,
 * then repeat it only where it helps someone act. In practice that means the
 * FAQ, where a parent scanning questions needs the answer in front of them,
 * and the CTAs. Two sections were dissolved into that rule in August 2026.
 *
 * "Current openings" is gone. It answered question one with a whole section,
 * but it did so by re-stating the ages, re-stating the small-home point, and
 * rendering the same two programme cards the rates section renders a few
 * hundred pixels further down. The status pill moved into the hero, the
 * freshness stamp into the highlights bar, and nothing else in it was said
 * only there.
 *
 * "Hours and meals" kept its clock and its photograph and gave up its subject.
 * It had been restating the hours the bar already lists and the clock already
 * draws, the meals the bar already lists, and the philosophy the third
 * differentiator block already names. It is now the one section on the page
 * that says what a day actually contains, which is the thing none of the
 * others were doing.
 */

/* `edge` is the painted top edge of each block, taken from the dominant colour
   of the mark above it so the two never disagree. */
const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: "constant",
    edge: "leaf",
    /* Was "One home, birth to five", and the body said "the same small
       setting". The age range is stated in the hero lead and in the ages FAQ;
       "small" is the subject of the block below this one and of the heading
       above it. What is left is the actual claim - continuity - which is the
       one thing here a centre cannot offer. */
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
      {/* The highlights bar fades cream -> cream-deep and was built as a seam
          into the cream-deep availability section. That section is gone, so
          this divider now lands in the Child Action section instead. */}
      <ArcDivider variant="shallow" from="bg-cream-deep" to="fill-cream" />

      <ChildActionSection />

      {/* Why a home */}
      <section className="section-y relative overflow-hidden bg-cream">
        <div className="container-page relative">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <SectionLabel className="text-center">Why families choose us</SectionLabel>
            <h2 className="text-3d mt-4 text-h2">A home, not a center</h2>
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

      <ArcDivider variant="deep" from="bg-cream" to="fill-cream-deep" />

      <RatesPanel />

      <ArcDivider variant="scallop" from="bg-cream-deep" to="fill-cream" />

      {/* Inside the day: the visual break between the rate cards and the trust
          sections that follow, and the one section that keeps moving once you
          stop scrolling.

          Still deliberately not a schedule, and every phrase in the copy
          column is one LaTrell gave - they are lifted from PROGRAMS in
          lib/constants.ts, where the two tiers describe what the day contains.
          See the note where DAILY_RHYTHM used to live for why there are no
          clock times in the prose.

          The clock stays, and it is now the only thing in the section that
          states the hours. Drawn as an arc it is a picture rather than a
          sentence, so it does not read as a repeat of the highlights bar three
          sections up, or of the hours FAQ two sections down. The prose used to
          say the hours twice more on top of it - once as the h2 - and then
          restate the meals and the philosophy as well. All four of those facts
          are prominent elsewhere on the page; what a day actually contains was
          nowhere, which is what this column carries now. */}
      <DayBand
        photo="dayPlay"
        side="clock-left"
        label="Inside the day"
        title="Long stretches of play that nobody interrupts"
        lead={
          <>
            <span className="block text-balance font-semibold text-cocoa">
              Sensory play, building, music, and story book time.
            </span>
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

      {/* From here the page answers "can I trust her": the name, then the
          process, then the questions. The licence-lookup panel used to open
          this run; it is an errand, not a reason to enrol, and it lives on
          /resources where a parent who wants to check goes looking. Surfaces
          alternate cream / cream-deep the whole way down, which is what the
          arc dividers are seaming. */}
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
            <h2 className="text-3d mt-4 text-h2">The things parents ask first</h2>
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
