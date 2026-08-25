import { ProgramIcon } from "@/components/brand/ProgramIcon";
import { Footprint } from "@/components/brand/Footprints";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { PROGRAMS } from "@/lib/constants";

/**
 * Rates are made clear above. This short overview shows how care changes as a
 * child grows, without asking families to compare separate program cards.
 */
export function ProgramPanels() {
  return (
    <section className="section-y bg-cream">
      <div className="container-page">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <SectionLabel className="text-center">Care for every stage</SectionLabel>
          <h2 className="text-3d mt-4 text-h2">Find your child&apos;s stage</h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-lead text-ink">
            A warm home setting, shaped around the rhythm of each age.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.06} className="mx-auto mt-9 max-w-5xl">
          <article className="overflow-hidden rounded-3xl border-hair border-cocoa/10 bg-cream-deep shadow-lift">
            <div className="border-b border-cocoa/10 bg-white/45 px-7 py-6 sm:px-9">
              <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-ink">
                Every child is cared for in the same small, nurturing home environment while
                their days, activities, and support naturally grow with them.
              </p>
            </div>

            <div className="grid lg:grid-cols-2">
              {PROGRAMS.map((program, programIndex) => (
                <section
                  key={program.slug}
                  className={
                    programIndex === 0
                      ? "flex min-h-72 flex-col p-7 sm:p-9 lg:border-r lg:border-cocoa/10"
                      : "flex min-h-72 flex-col border-t border-cocoa/10 p-7 sm:p-9 lg:border-t-0"
                  }
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_3px_0_rgba(62,42,33,0.10)]">
                      <ProgramIcon name={program.icon} className="h-9 w-9" />
                    </div>
                    <div className="mt-4">
                      <p className="text-eyebrow font-bold uppercase text-leaf-dark">{programIndex === 0 ? "The early days" : "As they grow"}</p>
                      <h3 className="mt-1 font-display text-h3 text-cocoa">{program.name}</h3>
                    </div>
                  </div>

                  <p className="mt-5 text-center leading-relaxed text-ink">
                    {program.summary}
                  </p>

                  <ul className="mt-auto grid gap-2.5 pt-6 text-center">
                    {program.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                      <li key={highlight} className="flex items-start justify-center gap-2.5 text-ink">
                        <Footprint
                          left={(programIndex + highlightIndex) % 2 === 0}
                          className={
                            (programIndex + highlightIndex) % 2 === 0
                              ? "mt-0.5 h-4 w-auto shrink-0 fill-leaf-dark"
                              : "mt-0.5 h-4 w-auto shrink-0 fill-pink"
                          }
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </AnimatedSection>
      </div>
    </section>
  );
}
