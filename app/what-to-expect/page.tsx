import { Apple, Cookie, Croissant, MessageCircleHeart, UtensilsCrossed } from "lucide-react";
import { CTABand } from "@/components/sections/CTABand";
import { DayBand } from "@/components/sections/DayBand";
import { PageHero } from "@/components/sections/PageHero";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { ExpectBook } from "@/components/what-to-expect/ExpectBook";
import { ExpectHeroArtwork } from "@/components/what-to-expect/ExpectHeroArtwork";
import { Photo } from "@/components/media/Photo";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BUSINESS, MEALS } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "What Families Can Expect",
  description:
    "Daily routine, meals, safety practices, and communication at T.L.C. Footprints, a licensed family child care home in Elk Grove, CA.",
  path: "/what-to-expect",
  keywords: ["home daycare daily routine", "licensed daycare Elk Grove"],
});

export default function WhatToExpectPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "What Families Can Expect", path: "/what-to-expect" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      {/* The classroom photo behind the copy, sized to the photo's own 16:9
          crop (capped so an ultrawide monitor does not get an absurd hero)
          so this fills a normal first screen the way About's hero does,
          rather than fighting a short min-height against the copy's real
          content height. The full-bleed treatment starts at `lg` rather
          than `xl` so it covers ordinary laptop widths (1024-1279px), not
          just very wide screens - below that the photo runs in normal flow
          above the copy instead of full-bleed behind it, since this much
          subtitle has nowhere to go inside a 16:9 box at phone width
          without clipping. Both slots render the same interactive artwork
          (components/what-to-expect/ExpectHeroArtwork.tsx): grayscale at
          rest, colouring in under the cursor, drifting gently on scroll.

          Height is set via `min(56.25vw, 44rem)` rather than Tailwind's
          `aspect-[16/9]` + `max-h-[44rem]`: with those two together, once a
          screen is wide enough that a full-width 16:9 box would exceed
          44rem tall, the CSS aspect-ratio sizing algorithm shrinks the
          box's *width* to keep the ratio at the capped height instead of
          just clipping the height - leaving a blank strip beside the photo
          on any screen wider than ~1251px. Driving height off viewport
          width directly keeps the box always full width and only caps how
          tall it gets. */}
      <div className="relative isolate flex flex-col overflow-hidden bg-cream lg:h-[min(56.25vw,44rem)] lg:justify-center">
        <div className="relative aspect-video w-full shrink-0 lg:hidden">
          <ExpectHeroArtwork imageSrc="/what-to-expect-hero-classroom.webp" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-cream via-cream/5 to-transparent"
          />
        </div>

        <ExpectHeroArtwork imageSrc="/what-to-expect-hero-classroom.webp" className="hidden lg:block" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-cream/35 lg:block" />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-b from-cream/80 via-cream/10 to-cream/60 lg:block"
        />

        <PageHero
          decor={false}
          topPaddingClassName="pt-0 lg:pt-[var(--header-h)]"
          surface="bg-cream lg:bg-transparent"
          align="center"
          label="A look inside T.L.C. Footprints"
          title="What Families Can Expect"
          subtitle="Choosing childcare is easier when you know what everyday care feels like. T.L.C. Footprints is a small, welcoming home program where children are known, supported, and free to be children."
        />
      </div>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      {/* The distinct care, learning, and safety promises, as a three-page
          book. Practical details live in the sections below. */}
      <ExpectBook />

      <ArcDivider variant="deep" from="bg-cream-deep" to="fill-cream" />

      <DayBand
        photo="outdoor"
        side="clock-left"
        label="The day"
        title="A consistent rhythm to the day"
        lead={
          "A dependable flow helps children settle in and feel secure, while still leaving room for play, exploration, creativity, and age-appropriate experiences."
        }
        body={
          <>
            <span className="block text-balance">
              {BUSINESS.hours.days}, {BUSINESS.hours.open} to {BUSINESS.hours.close}.
            </span>
            <span className="mt-1 block text-balance">The program is closed on weekends and designated holidays.</span>
          </>
        }
        copyAlign="text-center"
      />

      <ArcDivider variant="scallop" from="bg-cream" to="fill-cream-deep" />

      {/* Food has one home on the page: what is provided and what families
          pack. Hours and closures belong solely to the day band above. */}
      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
            <AnimatedSection>
              <Photo
                name="meals"
                className="mx-auto max-w-md lg:max-w-none"
                sizes="(min-width: 1024px) 34rem, (min-width: 640px) 32rem, 24rem"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="card-rule rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-7 text-center shadow-soft sm:p-8">
                <UtensilsCrossed className="mx-auto h-8 w-8 text-leaf-dark" aria-hidden="true" />
                <p className="mt-5 text-eyebrow font-semibold uppercase tracking-[0.12em] text-leaf-dark">Meals and snacks</p>
                <h2 className="text-3d mt-3 text-h2">Simple planning for the day</h2>
                <p className="mt-4 text-lead text-ink">T.L.C. Footprints provides:</p>
                <ul className="mx-auto mt-5 w-fit space-y-4 text-left">
                  {[
                    { label: MEALS.provided[0], Icon: Croissant },
                    { label: MEALS.provided[1], Icon: Apple },
                    { label: MEALS.provided[2], Icon: Cookie },
                  ].map(({ label, Icon }) => (
                    <li key={label} className="flex items-center gap-3.5">
                      <Icon className="h-6 w-6 shrink-0 text-leaf-dark" aria-hidden="true" />
                      <span className="text-lg font-semibold text-cocoa">{label}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl bg-cream p-4 text-base font-semibold text-cocoa">
                  {MEALS.parentProvides}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ArcDivider variant="shallow" from="bg-cream-deep" to="fill-cream" />

      <section className="section-y bg-cream">
        <div className="container-page">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <MessageCircleHeart className="mx-auto h-8 w-8 text-leaf-dark" aria-hidden="true" />
            <p className="mt-5 text-eyebrow font-semibold uppercase tracking-[0.12em] text-leaf-dark">
              Open communication
            </p>
            <h2 className="text-3d mt-3 text-h2">A partnership with your family</h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-lead text-ink">
              Questions are welcome. LaTrell is available by phone, text, email, and in person so families can stay informed about their child&apos;s care. When something important comes up, you will hear it clearly and have a partner in figuring out what comes next.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTABand
        from="bg-cream"
        title="Come See T.L.C. Footprints"
        body="The best way to decide whether a home daycare feels right for your family is to see the environment and ask your questions. Tours are available by appointment."
      />
    </>
  );
}
