import {
  HighlightIcon,
  type HighlightIconName,
} from "@/components/brand/HighlightIcon";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CurrentMonth } from "@/components/ui/CurrentMonth";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/constants";

/**
 * The four practical facts, seamed straight under the hero.
 *
 * A parent who has just read the headline is asking four questions before they
 * are willing to scroll: when are you open, is there room, do I pack food, and
 * can I get help paying. Every one of those is answered somewhere on this site,
 * and every one of them was previously a scroll away.
 *
 * Every item carries a label and a detail, which is what separates this bar
 * from a row of chips: the label is the fact and the detail is the specific
 * behind it. The hero used to run its own chip row two hundred pixels above
 * this one, repeating three of these four as bare labels with nothing added.
 * It is gone, and this bar is now the only glanceable summary on the page.
 *
 * Everything traces to constants.ts. Nothing about capacity, ratios, or a
 * per-age price goes in this bar: that is exactly the set of facts the brief
 * does not give. See README.
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
    /* "6:00 PM" trimmed to "6 PM", which is the same time and eleven pixels
       shorter. At the lg breakpoint the column is 146px wide and the untrimmed
       range needs 156, so it wrapped to two lines on exactly the laptops most
       likely to be looking at this. */
    icon: "hours",
    label: `${BUSINESS.hours.open} – ${BUSINESS.hours.close.replace(":00", "")}`,
    detail: BUSINESS.hours.days,
    tabular: true,
  },
  {
    /* The enrolling status, and the date it was last true.

       This tile used to read "Birth to 5 years". The age range is now stated
       once in the hero lead and once in the ages FAQ, which is where a parent
       acts on it; a third statement one line under the hero was the most
       visible of the five the page used to carry.

       What took the slot is the freshness stamp. It is the only thing lost when
       the "Current openings" section was deleted that has nowhere else to live,
       and it is the honesty signal on the one fact a parent most needs to
       trust: a status with a date on it is a status someone maintains. LaTrell
       stays current automatically, using the daycare's California month. */
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
    /* Cream at the top, so the hero's own bottom scrim lands on the colour it
       fades to; cream-deep at the bottom, which is where the arc divider below
       picks the page back up. The bar is the seam under the hero, not an object
       dropped in the gap. It used to hand off to a cream-deep availability
       section; that section is gone and the divider took the handoff, which is
       why the gradient still ends where it does. */
    <section
      aria-labelledby="good-to-know"
      className="bg-gradient-to-b from-cream to-cream-deep pb-4 pt-2 sm:pb-6"
    >
      <h2 id="good-to-know" className="sr-only">
        Good to know
      </h2>

      <div className="container-page">
        <AnimatedSection className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream shadow-soft">
          {/* The brand rule along the top edge, inset the way .card-rule's is,
              so the bar reads as one deliberate object rather than as four
              tiles that happen to be touching. */}
          <span
            aria-hidden="true"
            className="rule-rainbow absolute inset-x-6 top-0 h-[3px] rounded-full opacity-70"
          />

          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.label}
                /* One hairline between every pair of neighbours, at each of
                     the three column counts: under the item when stacked,
                     under and beside it in the 2x2, beside it only in the
                     single row. */
                className={cn(
                  "flex items-center gap-3.5 px-5 py-5 sm:px-6 lg:px-4",
                  /* Stacked on a phone, the row is icon + two short lines in a
                       320px card, and left-aligning it leaves a third of the
                       card empty on the right - the bar reads as four items
                       pushed against a wall rather than as one centred object.
                       Centred here, left-aligned from sm where the columns
                       give the rows an edge to sit on. The text block below
                       carries a fixed width at this size so all four icons
                       still line up in one column while the group is centred;
                       without it each row would centre on its own text width
                       and the icons would stagger. */
                  "justify-center sm:justify-start",
                  "border-t-hair border-cocoa/10 first:border-t-0",
                  "sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(even)]:border-l-hair",
                  "lg:border-l-hair lg:border-t-0 lg:first:border-l-0",
                )}
              >
                {/* The raised bubble the day-rhythm times sit in. It stays
                    neutral rather than tinted per item: the marks carry two
                    and three brand colours of their own, and a tinted disc
                    behind them would put one more in a 48px circle. */}
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-hair border-cocoa/15 bg-gradient-to-b from-white to-cream-deep shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_2px_6px_-2px_rgba(62,42,33,0.15)]"
                >
                  <HighlightIcon name={item.icon} className="h-8 w-8" />
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
