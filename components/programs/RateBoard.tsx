import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { PROGRAMS, TUITION, MEALS } from "@/lib/constants";

/**
 * The rate board: the one place on the page the big numbers live.
 *
 * A single card split by a dotted centre rule rather than the old table, with
 * each tier's age range set in `font-hand` above its name the way a parent's
 * own note in a planner would read. Full-time and part-time sit as two rows
 * of dotted leaders under each tier, so the eye lands on the price without a
 * grid of borders to cross first.
 *
 * The footer line under the card is the other thing every rate page owes a
 * parent: what the price includes (meals), what it costs to hold a spot
 * (deposit), and whether subsidy is accepted - three facts that otherwise
 * live in three different FAQ answers, gathered into one line here so the
 * numbers above are never read without them.
 */
export function RateBoard() {
  return (
    <AnimatedSection>
      <div className="relative rounded-3xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream px-5 py-8 shadow-lift sm:px-10 sm:py-10">
        {/* A strip of washi tape holding the card down, the way a parent
            would actually pin a rate sheet to a fridge. Sized in px, not
            clipped by the card, so it reads as tape overlapping the edge
            rather than a bar painted onto it. */}
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-amber/50 shadow-sm"
        />

        <div className="relative grid gap-8 sm:grid-cols-2 sm:gap-10">
          {PROGRAMS.map((program) => (
            <div key={program.slug} className="text-left">
              {program.ageRange ? (
                <p
                  className={
                    "font-hand text-lg " +
                    (program.slug === "infant" ? "text-pink-dark" : "text-leaf-dark")
                  }
                >
                  {program.ageRange}
                </p>
              ) : null}
              <h3 className="mt-1 font-display text-h4 font-semibold text-cocoa first:mt-0">
                {program.name}
              </h3>

              <dl className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between gap-2 border-b border-dotted border-cocoa/25 pb-1">
                  <dt className="text-sm text-cocoa-mid">Full-Time</dt>
                  <dd className="tabular font-display text-3xl font-semibold text-cocoa">
                    ${program.fullTime}
                    <span className="ml-1 text-sm font-normal text-cocoa-mid">
                      /week
                    </span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-2 border-b border-dotted border-cocoa/25 pb-1">
                  <dt className="text-sm text-cocoa-mid">Part-Time</dt>
                  <dd className="tabular font-display text-3xl font-semibold text-cocoa">
                    ${program.partTime}
                    <span className="ml-1 text-sm font-normal text-cocoa-mid">
                      /week
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-8 text-balance border-t-hair border-cocoa/10 pt-5 text-center text-sm text-cocoa-mid">
          {MEALS.providedSummary} {MEALS.parentProvides} &middot; {TUITION.depositNote}{" "}
          &middot; {TUITION.subsidy}
        </p>
        <p className="mt-2 text-balance text-center text-sm text-cocoa-mid">
          {TUITION.partTimeNote}
        </p>
        <p className="mt-2 text-balance text-center text-sm text-cocoa-mid">
          {TUITION.availabilityNote}
        </p>
      </div>

      {/* The single biggest source of misunderstanding, given its own note. */}
      <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-l-4 border-l-amber-dark bg-amber-light/50 p-4 text-center sm:gap-3 sm:p-7">
        <h2 className="font-display text-lg font-semibold text-cocoa">
          {TUITION.basisHeadline}
        </h2>
        <p className="mx-auto max-w-measure">{TUITION.basisDetail}</p>
      </div>
    </AnimatedSection>
  );
}
