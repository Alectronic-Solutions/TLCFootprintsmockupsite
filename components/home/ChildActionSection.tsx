import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { Footprints } from "@/components/brand/Footprints";
import { WatercolorWash } from "@/components/brand/Texture";
import {
  AnimatedGroup,
  AnimatedItem,
  AnimatedSection,
} from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

const CHILD_ACTION_APPLY_URL =
  "https://childaction.org/apply-for-subsidized-care/";
const CHILD_ACTION_PHONE = "(916) 369-0191";
const CHILD_ACTION_PHONE_HREF = "tel:+19163690191";

const STEPS = [
  {
    title: "Check eligibility",
    body: "Answer a few questions on Child Action’s website.",
  },
  {
    title: "Apply or call",
    body: "Apply online, or call Child Action if you want help.",
  },
  {
    title: "Choose T.L.C.",
    body: "Tell Child Action you are interested in care here.",
  },
];

/** A short, plain-language path from needing help to choosing T.L.C. */
export function ChildActionSection() {
  return (
    <section
      aria-labelledby="child-action-heading"
      className="relative overflow-hidden bg-cream py-3 sm:py-5 lg:py-6"
    >
      <WatercolorWash
        tone="leaf"
        className="-left-28 top-6 h-72 w-72"
        strength={0.07}
      />
      <WatercolorWash
        tone="amber"
        className="-right-24 bottom-0 h-80 w-80"
        strength={0.06}
      />

      <div className="container-page relative">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border-hair border-cocoa/15 bg-gradient-to-br from-white via-cream to-leaf-light/40 shadow-warm">
          <span
            aria-hidden="true"
            className="rule-rainbow absolute inset-x-8 top-0 h-1 rounded-full"
          />

          <Footprints className="absolute -right-2 top-5 h-14 w-auto rotate-[8deg] opacity-[0.08] sm:right-7 sm:h-16" />

          <div className="grid gap-4 px-5 py-5 sm:px-8 sm:py-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:px-10 lg:py-7">
            <AnimatedSection className="self-center text-center">
              <SectionLabel className="text-center">
                Child Action accepted
              </SectionLabel>

              <div className="mt-2 inline-flex items-center gap-2 rounded-full border-hair border-leaf/25 bg-leaf-light px-3.5 py-2 text-sm font-bold text-leaf-dark">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Help with child care costs
              </div>

              <h2
                id="child-action-heading"
                className="text-3d mx-auto mt-3 max-w-[13ch] text-h2"
              >
                Need help paying for child care?
              </h2>

              <p className="mx-auto mt-2 max-w-[42ch] text-lead text-ink">
                T.L.C. Footprints accepts Child Action assistance for eligible
                Sacramento County families.
              </p>

              <div className="mt-4 flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:flex-wrap">
                <Button
                  href={CHILD_ACTION_APPLY_URL}
                  className="group sm:w-auto"
                  block
                >
                  Check eligibility &amp; apply
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  href="/resources/child-action-subsidy-sacramento"
                  variant="quiet"
                  size="sm"
                  className="group justify-center sm:w-auto"
                  block
                >
                  Read the simple guide
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection
              delay={0.08}
              className="border-t-hair border-cocoa/12 pt-5 text-center lg:border-l-hair lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              <p className="font-display text-2xl font-semibold leading-tight text-cocoa sm:text-3xl">
                Getting started is simple
              </p>

              <AnimatedGroup as="ol" className="mt-3 space-y-2.5" stagger={0.08}>
                {STEPS.map((step, index) => (
                  <AnimatedItem
                    as="li"
                    key={step.title}
                    className="mx-auto grid max-w-md grid-cols-[1.25rem_1fr] gap-2.5 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className="block pt-0.5 font-display text-xl font-bold leading-none text-pink-dark"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-snug text-cocoa">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-cocoa-mid sm:text-base">
                        {step.body}
                      </p>
                    </div>
                  </AnimatedItem>
                ))}
              </AnimatedGroup>

              <div className="mt-4 rounded-2xl border-hair border-leaf/20 bg-leaf-light/75 p-3">
                <p className="font-bold text-cocoa">
                  On CalWORKs? Start with your CalWORKs worker.
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-cocoa-mid">
                  Child Action decides eligibility, coverage, and any family
                  fee.
                </p>
              </div>

              <div className="mt-2 flex items-start justify-center gap-2 text-sm text-cocoa-mid">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-dark"
                  aria-hidden="true"
                />
                <p className="text-center">
                  Rather call?{" "}
                  <a
                    href={CHILD_ACTION_PHONE_HREF}
                    className="font-bold text-cocoa underline decoration-amber/70 underline-offset-4 hover:text-pink-dark"
                  >
                    {CHILD_ACTION_PHONE}
                  </a>
                  , weekdays 7:30 AM–5 PM.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
