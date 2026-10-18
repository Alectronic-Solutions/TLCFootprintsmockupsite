import {
  HighlightIcon,
  type HighlightIconName,
} from "@/components/brand/HighlightIcon";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CurrentMonth } from "@/components/ui/CurrentMonth";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/constants";

/**
 * The four practical facts, directly under the hero. Everything traces to
 * constants.ts; nothing about capacity, ratios, or per-age prices goes here.
 */

interface Highlight {
  icon: HighlightIconName;
  label: string;
  detail: string;
  /** Aligns the digits in the hours against the rest of the site's numbers. */
  tabular?: boolean;
}

const HIGHLIGHTS: Highlight[] = [
  {
    // "6 PM" rather than "6:00 PM" keeps the range on one line at lg.
    icon: "hours",
    label: `${BUSINESS.hours.open} – ${BUSINESS.hours.close.replace(":00", "")}`,
    detail: BUSINESS.hours.days,
    tabular: true,
  },
  {
    icon: "openings",
    label: "Now enrolling",
    detail: "Updated this month",
  },
  {
    icon: "meals",
    label: "Meals provided",
    detail: "Breakfast, 2 snacks",
  },
  {
    icon: "subsidy",
    label: "Child Action",
    detail: "Subsidy accepted",
  },
];

export function HighlightsBar() {
  return (
    <section
      aria-labelledby="good-to-know"
      className="bg-gradient-to-b from-cream to-cream-deep pb-4 pt-2 sm:pb-6"
    >
      <h2 id="good-to-know" className="sr-only">
        Good to know
      </h2>

      <div className="container-page">
        <AnimatedSection className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-white">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.label}
                className={cn(
                  "flex items-center gap-3.5 px-5 py-5 sm:px-6 lg:px-4",
                  // Centered when stacked; the fixed text width keeps icons aligned.
                  "justify-center sm:justify-start",
                  "border-t-hair border-cocoa/10 first:border-t-0",
                  "sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(even)]:border-l-hair",
                  "lg:border-l-hair lg:border-t-0 lg:first:border-l-0",
                )}
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center"
                >
                  <HighlightIcon name={item.icon} className="h-12 w-12" />
                </span>

                <div className="w-[9.5rem] min-w-0 sm:w-auto">
                  <p
                    className={cn(
                      "text-base font-semibold leading-snug text-cocoa",
                      item.tabular && "tabular",
                    )}
                  >
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-cocoa-mid">
                    {item.label === "Now enrolling" ? (
                      <>Updated <CurrentMonth /></>
                    ) : (
                      item.detail
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>
  );
}
