import { Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { TourRequestForm } from "@/components/tour/TourRequestForm";
import { TourHeroBackdrop } from "@/components/tour/TourHeroBackdrop";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BUSINESS, ENROLLMENT_STEPS } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Request a Tour",
  description:
    "Request a private tour of T.L.C. Footprints Home Daycare in Elk Grove, CA. See the space, ask questions, and decide whether it feels right for your family.",
  path: "/tour",
  keywords: ["daycare tour Elk Grove", "home daycare near me Elk Grove"],
});

const CONTACT_METHODS = [
  {
    label: "Call",
    value: BUSINESS.phone,
    href: BUSINESS.phoneHref,
    Icon: Phone,
    note: "Best for a quick conversation",
  },
  {
    label: "Text",
    value: BUSINESS.phone,
    href: BUSINESS.smsHref,
    Icon: MessageSquare,
    note: "Easy for a quick question",
  },
  {
    label: "Email",
    value: BUSINESS.email,
    href: BUSINESS.emailHref,
    Icon: Mail,
    note: "Best when you want to share details",
  },
];


export default function TourPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Request a Tour", path: "/tour" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      {/* The map backdrop spans both the PageHero copy and the contact
          cards below it, so the illustration stays visible behind the
          cards instead of stopping at the hero's own bottom edge. */}
      <div className="relative isolate overflow-hidden">
        <TourHeroBackdrop />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cream/35 lg:bg-gradient-to-r lg:from-cream/85 lg:via-cream/25 lg:to-cream/85"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-cream to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-cream/90 to-transparent"
        />

        <PageHero
          label="Request a tour"
          title="Come see the space"
          subtitle="A tour gives you time to see the environment, ask questions, and decide whether it feels right for your child. The online form is a preview, so call, text, or email to arrange a visit."
          align="center"
          decor={false}
          surface="bg-transparent"
          contentClassName="rounded-2xl border-hair border-cocoa/10 bg-cream/90 px-6 py-8 shadow-soft backdrop-blur-sm sm:px-10 sm:py-10"
        />

        {/* Three equally prominent direct contact paths. She explicitly does not want
            parents funnelled into a single channel. */}
        <section className="relative bg-transparent pb-4">
          <div className="container-page">
            <ul className="grid gap-4 sm:grid-cols-3">
              {CONTACT_METHODS.map((m, i) => (
                <AnimatedSection as="li" key={m.label} delay={i * 0.06}>
                  <a
                    href={m.href}
                    className="card-lift card-rule flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream-deep p-5 text-center shadow-soft"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-b from-white to-cream shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_2px_6px_-2px_rgba(62,42,33,0.18)]">
                      <m.Icon className="h-5 w-5 text-pink-dark" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-cocoa">{m.label}</span>{" "}
                      <span className="block break-all text-base text-cocoa">
                        {m.value}
                      </span>{" "}
                      <span className="mt-0.5 block text-xs text-cocoa-mid">{m.note}</span>
                    </span>
                  </a>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      {/* Form plus practical details */}
      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <AnimatedSection>
              <h2 className="text-h2 text-center">Request a tour</h2>
              <div className="mt-6">
                <TourRequestForm />
              </div>
            </AnimatedSection>

            <AnimatedSection
              delay={0.08}
              className="space-y-6 lg:sticky lg:top-24 lg:mt-8"
            >
              <div className="rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <Clock className="mx-auto h-6 w-6 text-leaf-dark" aria-hidden="true" />
                <h2 className="mt-3 text-h3">Hours</h2>
                <p className="tabular mt-2 text-base">
                  {BUSINESS.hours.days}
                  <br />
                  {BUSINESS.hours.open} to {BUSINESS.hours.close}
                </p>
                <p className="mt-2 text-sm text-cocoa-mid">{BUSINESS.hours.closed}</p>
              </div>

              <div className="rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <MapPin className="mx-auto h-6 w-6 text-leaf-dark" aria-hidden="true" />
                <h2 className="mt-3 text-h3">Location</h2>
                <p className="mt-2 text-base">
                  {BUSINESS.city}, {BUSINESS.state}
                </p>
                <p className="mt-2 text-sm text-cocoa-mid">
                  To protect the privacy of the children and families in care, I share the
                  exact address when we confirm your tour.
                </p>
              </div>

              <div className="rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <SectionLabel>What happens next</SectionLabel>
                <ol className="mt-4 space-y-3 text-left">
                  {ENROLLMENT_STEPS.map((s) => (
                    <li key={s.n} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#EA4A6B] to-[#D22F51] text-xs font-semibold text-white shadow-[0_1px_0_0_#9E1F3B]"
                      >
                        {s.n}
                      </span>
                      <span className="text-base font-medium text-cocoa">
                        {s.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTABand
        title="Still deciding?"
        body="Take your time. You can review the programs and rates now, or contact me whenever you are ready."
        ctaHref="/programs"
        ctaLabel="View Programs & Rates"
        showPhoneButton={false}
        showEmailLink={false}
      />
    </>
  );
}
