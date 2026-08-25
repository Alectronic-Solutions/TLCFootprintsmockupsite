import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

/**
 * Shared shell for the three policy pages, so they stay visually consistent
 * and none of them turns into a wall of undifferentiated text.
 *
 * The hero otherwise looks identical to every other interior page - cream,
 * PageHero's own watercolor washes and sprigs - so it reuses that decor
 * as-is.
 */
export function PolicyPage({
  label,
  title,
  subtitle,
  updated,
  children,
}: {
  label: string;
  title: string;
  subtitle: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="relative isolate overflow-hidden">
        <PageHero label={label} title={title} subtitle={subtitle} />
      </div>
      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <section className="section-y bg-cream-deep">
        <div className="container-prose">
          <AnimatedSection>
            <div
              className="rounded-2xl border-hair border-cocoa/10 bg-cream p-7 shadow-soft sm:p-10
                         [&_h2]:mt-8 [&_h2]:text-h3 [&_h2:first-child]:mt-0
                         [&_li]:[&_li]:text-ink
                         [&_p]:mt-4 [&_p]:[&_p]:text-ink
                         [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
                         [&_ul]:marker:text-leaf-dark
                         [&_a]:font-semibold [&_a]:text-cocoa [&_a]:underline
                         [&_a]:underline-offset-4 hover:[&_a]:text-pink-dark"
            >
              {children}
            </div>
            <p className="mt-6 text-sm text-cocoa-mid">Last updated {updated}.</p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
