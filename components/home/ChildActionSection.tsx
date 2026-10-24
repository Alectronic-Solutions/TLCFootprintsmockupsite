import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import {
  AnimatedGroup,
  AnimatedItem,
  AnimatedSection,
} from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const CHILD_ACTION_APPLY_URL =
  "https://childaction.org/apply-for-subsidized-care/";
const CHILD_ACTION_PHONE = "(916) 369-0191";
const CHILD_ACTION_PHONE_HREF = "tel:+19163690191";

const STEPS = [
  {
    title: "Check eligibility",
    body: "Answer a few questions on Child Action’s website.",
    badge: "bg-pink text-white",
    line: "bg-pink/40",
  },
  {
    title: "Apply or call",
    body: "Apply online, or call Child Action if you want help.",
    badge: "bg-amber text-cocoa",
    line: "bg-amber/50",
  },
  {
    title: "Choose T.L.C.",
    body: "Tell Child Action you are interested in care here.",
    badge: "bg-leaf text-white",
    line: "bg-leaf/30",
  },
];

/** A short, plain-language path from needing help to choosing T.L.C. */
export function ChildActionSection() {
  return (
    <section
      aria-labelledby="child-action-heading"
      className="relative overflow-hidden bg-cream py-8 sm:py-10 lg:py-12"
    >
      <div className="container-page relative">
        <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border-hair border-cocoa/15 bg-white lg:grid-cols-[0.95fr_1.05fr]">
          <AnimatedSection className="flex flex-col justify-center bg-cream-deep/60 px-5 py-7 text-center sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <SectionLabel className="text-center">
              Child Action accepted
            </SectionLabel>

            <h2
              id="child-action-heading"
              className="mx-auto mt-3 max-w-[13ch] text-h2"
            >
              Need help paying for child care?
            </h2>

            <p className="mx-auto mt-3 max-w-[38ch] text-balance text-lead text-ink">
              T.L.C. Footprints accepts Child Action assistance for eligible
              Sacramento County families.
            </p>

            <div className="mt-6 flex justify-center">
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
            </div>

            <p className="mt-4 text-balance text-sm text-cocoa-mid">
              <Phone
                className="mr-1.5 inline-block h-4 w-4 -translate-y-px text-amber-dark"
                aria-hidden="true"
              />
              <span>
                Rather call?{" "}
                <a
                  href={CHILD_ACTION_PHONE_HREF}
                  className="whitespace-nowrap font-bold text-cocoa underline decoration-amber/70 underline-offset-4 hover:text-pink-dark"
                >
                  {CHILD_ACTION_PHONE}
                </a>
                , weekdays 7:30 AM–5 PM.
              </span>
            </p>

            <div className="mt-2 flex justify-center">
              <Button
                href="/resources/family-guide-child-action-and-costs"
                variant="quiet"
                size="sm"
                className="group justify-center"
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
            className="px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
          >
            <SectionLabel className="text-center lg:text-left">
              How to get started
            </SectionLabel>

            <AnimatedGroup
              as="ol"
              className="relative mx-auto mt-5 w-fit max-w-full lg:mx-0"
              stagger={0.08}
            >
              {STEPS.map((step, index) => (
                <AnimatedItem
                  as="li"
                  key={step.title}
                  className="relative grid grid-cols-[2rem_1fr] gap-4 pb-5 last:pb-0"
                >
                  {index < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-0 left-4 top-9 w-px -translate-x-1/2",
                        step.line,
                      )}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full font-display text-base font-bold",
                      step.badge,
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-lg font-bold leading-snug text-cocoa">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-balance text-sm leading-relaxed text-cocoa-mid sm:text-base">
                      {step.body}
                    </p>
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedGroup>

            <div className="mt-6 rounded-2xl border-hair border-leaf/25 bg-leaf-light px-4 py-2.5 text-center sm:mx-auto sm:w-fit sm:rounded-full sm:px-5 lg:mx-0 lg:text-left">
              <p className="text-balance text-sm font-bold leading-snug text-cocoa sm:whitespace-nowrap">
                On CalWORKs? Start with your CalWORKs worker.
              </p>
            </div>

            <p className="mt-3 text-balance text-center text-sm leading-relaxed text-cocoa-mid lg:text-left">
              Child Action decides eligibility, coverage, and any family fee.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
