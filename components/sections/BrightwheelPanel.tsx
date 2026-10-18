import { ArrowUpRight, CreditCard, FileText, MessageCircle } from "lucide-react";
import { Footprint } from "@/components/brand/Footprints";
import { WatercolorWash } from "@/components/brand/Texture";
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

const HEART_PATH =
  "M12 21 C 4 14.5, 1 11, 1 7.2 C 1 3.8, 3.6 1, 7 1 C 9.1 1, 10.9 2.1, 12 3.8 C 13.1 2.1, 14.9 1, 17 1 C 20.4 1, 23 3.8, 23 7.2 C 23 11, 20 14.5, 12 21 Z";

/**
 * Three prints in the brand triad, walking up and to the right like the trail
 * in the hero: a family on its way in. They light up one at a time on a loop
 * (`print-light` in globals.css). The pose lives on the outer span and the
 * animation on the print itself, so the two transforms never overwrite each
 * other.
 */
const STEPS = [
  { tint: "fill-pink", left: true, pose: "rotate(-14deg) translateY(10px)", delay: "0s" },
  { tint: "fill-leaf", left: false, pose: "rotate(-4deg) translateY(2px)", delay: "0.45s" },
  { tint: "fill-amber", left: true, pose: "rotate(8deg) translateY(-6px)", delay: "0.9s" },
];

function WalkingPrints() {
  return (
    <div aria-hidden="true" className="relative mb-6 flex items-end justify-center gap-3">
      {STEPS.map((step) => (
        <span key={step.tint} className="block" style={{ transform: step.pose }}>
          <Footprint
            left={step.left}
            className={cn("print-light h-10 w-auto sm:h-12", step.tint)}
            style={{ animationDelay: step.delay }}
          />
        </span>
      ))}
    </div>
  );
}

/**
 * The current-families mark: one big heart on a soft pink halo, with a darker
 * offset underneath for the same pressed-paper depth as the buttons. It beats
 * on a slow loop, and a ring leaves the halo on each beat.
 */
function BigHeart() {
  return (
    <div aria-hidden="true" className="relative mb-4 grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
      <span className="heart-ripple absolute inset-0 rounded-full border-2 border-pink/40" />
      <span className="absolute inset-0 rounded-full bg-pink-light shadow-[inset_0_2px_10px_rgba(226,58,94,0.12)]" />
      <svg
        viewBox="0 0 24 23"
        className="heart-beat relative h-16 w-16 drop-shadow-[0_8px_14px_rgba(194,43,75,0.25)] sm:h-[4.5rem] sm:w-[4.5rem]"
      >
        <path d={HEART_PATH} transform="translate(0 1.4)" className="fill-pink-dark" />
        <path d={HEART_PATH} className="fill-pink" />
        {/* A soft highlight on the upper left lobe, so the heart reads as a
            rounded object at this size rather than a flat icon blown up. */}
        <ellipse cx="6.6" cy="5.6" rx="2.4" ry="1.5" transform="rotate(-35 6.6 5.6)" className="fill-white/35" />
      </svg>
    </div>
  );
}

/** What the family portal is for, as three small marks rather than a list. */
const PORTAL_USES = [
  { label: "Forms", Icon: FileText },
  { label: "Messages", Icon: MessageCircle },
  { label: "Payments", Icon: CreditCard },
];

/**
 * Two doors into the family portal, deliberately unequal. The interest list is
 * for families still deciding, so it is the loud half. Current families
 * already know the portal and only need the way in, so theirs is the quiet
 * half and never competes with the enrollment path.
 *
 * `full` is the home-page band, marked with walking prints on the interest
 * side and a big heart on the families side. `compact` stacks both halves into a single
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
            compact ? "p-6" : "relative isolate overflow-hidden px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12",
          )}
        >
          {compact ? null : (
            <>
              <WatercolorWash tone="leaf" strength={0.09} className="-bottom-24 -left-24 -z-10 h-72 w-72" />
              <WatercolorWash tone="amber" strength={0.08} className="-right-20 -top-24 -z-10 h-64 w-64" />
              <WalkingPrints />
            </>
          )}
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
              compact ? "text-base text-cocoa-mid" : "relative max-w-[46ch] text-lead text-ink sm:mt-4",
            )}
          >
            {/* Two sentences, two lines, where the card is wide enough to give
                each its own; below that they run on and balance. */}
            <span className="sm:block">
              Thinking about care at{" "}
              <span className="whitespace-nowrap">T.L.C. Footprints</span>?
            </span>{" "}
            <span className="sm:block">
              Add your family to the interest list through Brightwheel.
            </span>
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
              : "relative isolate overflow-hidden border-t-hair px-5 py-10 sm:px-10 lg:border-l-hair lg:border-t-0 lg:px-10",
          )}
        >
          {compact ? null : (
            <>
              <WatercolorWash tone="pink" strength={0.1} className="-top-10 left-1/2 -z-10 h-80 w-80 -translate-x-1/2" />
              <BigHeart />
            </>
          )}
          <SectionLabel className="text-center">Current families</SectionLabel>
          <FamiliesHeading
            className={cn(
              "mt-3 font-display font-semibold leading-tight text-cocoa",
              compact ? "text-h3" : "text-2xl sm:text-3xl",
            )}
          >
            Already enrolled?
          </FamiliesHeading>
          {compact ? (
            <p className="mx-auto mt-2 max-w-[30ch] text-balance text-base text-cocoa-mid">
              Sign in to Brightwheel for forms, messages, and payments.
            </p>
          ) : (
            <>
              <p className="mx-auto mt-2 text-base text-cocoa-mid">Sign in to Brightwheel for</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {PORTAL_USES.map(({ label, Icon }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border-hair border-cocoa/10 bg-white px-3 py-1.5 text-sm font-semibold text-cocoa shadow-soft"
                  >
                    <Icon className="h-4 w-4 text-pink-dark" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </>
          )}

          <Button
            href={BRIGHTWHEEL.familySignInUrl}
            {...EXTERNAL}
            variant="secondary"
            size={compact ? "sm" : "md"}
            block
            className={cn("group sm:w-auto", compact ? "mt-5" : "mt-6")}
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
