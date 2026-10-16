import { ArrowUpRight } from "lucide-react";
import { HeartDots } from "@/components/brand/HeartDots";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import { BRIGHTWHEEL } from "@/lib/constants";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

function OutIcon() {
  return (
    <ArrowUpRight
      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  );
}

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/**
 * Two doors into the family portal, deliberately unequal. The interest list is
 * for families still deciding, so it is the loud half. Current families
 * already know the portal and only need the way in, so theirs is the quiet
 * half and never competes with the enrollment path.
 *
 * `full` is the home-page band. `compact` stacks both halves into a single
 * sidebar card for /availability, where the neighbouring cards use h2.
 */
export function BrightwheelPanel({
  variant = "full",
  surface = "bg-cream",
}: {
  variant?: "full" | "compact";
  surface?: "bg-cream" | "bg-cream-deep";
}) {
  const compact = variant === "compact";
  const headingId = compact ? "interest-list-heading-compact" : "interest-list-heading";
  const FamiliesHeading = compact ? "h2" : "h3";

  const card = (
    <div
      className={cn(
        "relative overflow-hidden border-hair bg-white text-center",
        compact
          ? "rounded-2xl border-cocoa/10"
          : "mx-auto max-w-5xl rounded-[2rem] border-cocoa/15 shadow-soft",
      )}
    >
      <div aria-hidden="true" className="rule-rainbow h-1.5 w-full" />

      <div className={cn(!compact && "grid lg:grid-cols-[1.35fr_1fr]")}>
        <div
          className={cn(
            compact ? "p-6" : "px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12",
          )}
        >
          {compact ? null : <HeartDots className="mb-5" />}
          <SectionLabel className="text-center">Prospective families</SectionLabel>
          <h2
            id={headingId}
            className={cn("mx-auto mt-3", compact ? "text-h3" : "max-w-[16ch] text-h2")}
          >
            Join our interest list
          </h2>
          <p
            className={cn(
              "mx-auto mt-3 text-balance",
              compact ? "text-base text-cocoa-mid" : "max-w-[40ch] text-lead text-ink sm:mt-4",
            )}
          >
            Thinking about care at{" "}
            <span className="whitespace-nowrap">T.L.C. Footprints</span>? Add your
            family to the interest list through Brightwheel.
          </p>

          <Button
            href={BRIGHTWHEEL.interestListUrl}
            {...EXTERNAL}
            size={compact ? "md" : "lg"}
            block
            className={cn("group", compact ? "mt-5" : "mt-6 sm:mt-7 sm:w-auto")}
          >
            Join the Interest List
            <OutIcon />
            {NEW_TAB}
          </Button>

          <p className="mx-auto mt-3 max-w-[36ch] text-balance text-xs text-cocoa-mid sm:text-sm">
            Brightwheel may ask you to sign in or create an account first.
          </p>
        </div>

        <div
          className={cn(
            "flex flex-col items-center justify-center border-cocoa/10 bg-cream-deep/70",
            compact
              ? "border-t-hair p-6"
              : "border-t-hair px-5 py-8 sm:px-10 lg:border-l-hair lg:border-t-0 lg:px-10",
          )}
        >
          <SectionLabel className="text-center">Current families</SectionLabel>
          <FamiliesHeading
            className={cn(
              "mt-3 font-display font-semibold leading-tight text-cocoa",
              compact ? "text-h3" : "text-2xl sm:text-3xl",
            )}
          >
            Already enrolled?
          </FamiliesHeading>
          <p className="mx-auto mt-2 max-w-[30ch] text-balance text-base text-cocoa-mid">
            Sign in to Brightwheel for forms, messages, and payments.
          </p>

          <Button
            href={BRIGHTWHEEL.familySignInUrl}
            {...EXTERNAL}
            variant="secondary"
            size={compact ? "sm" : "md"}
            block
            className="group mt-5 sm:w-auto"
          >
            Brightwheel Sign-In
            <OutIcon />
            {NEW_TAB}
          </Button>
        </div>
      </div>
    </div>
  );

  if (compact) return card;

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative overflow-hidden py-6 sm:py-8 lg:py-10", surface)}
    >
      <div className="container-page">
        <AnimatedSection>{card}</AnimatedSection>
      </div>
    </section>
  );
}
