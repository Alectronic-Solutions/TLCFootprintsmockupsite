import {
  Baby,
  CalendarCheck,
  Clock,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { AvailabilityRequestForm } from "@/components/availability/AvailabilityRequestForm";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/sections/PageHero";
import { TourHeroBackdrop } from "@/components/tour/TourHeroBackdrop";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AVAILABILITY, BUSINESS, PROGRAMS } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Check Child Care Availability",
  description:
    "Check current infant, toddler, and preschool-age child care availability at T.L.C. Footprints Home Daycare in Elk Grove, CA.",
  path: "/availability",
  keywords: [
    "daycare availability Elk Grove",
    "child care openings Elk Grove",
    "infant care openings Elk Grove",
  ],
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

const AVAILABILITY_COPY = {
  open: {
    title: "Openings available",
    detail: "Now enrolling",
  },
  limited: {
    title: "Limited openings",
    detail: "Now enrolling",
  },
  full: {
    title: "Currently full",
    detail: "Please check back for future updates",
  },
} as const;

const NEXT_STEPS = [
  "Share your child’s age and schedule",
  "I confirm whether an opening may fit",
  "If it feels right, we schedule a tour",
] as const;

export default function AvailabilityPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Check Availability", path: "/availability" },
  ]);
  const status = AVAILABILITY_COPY[AVAILABILITY.status];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

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
          label="Check availability"
          title="Is there a place for your little one?"
          subtitle="Openings depend on your child’s age, the schedule you need, and your preferred start date. Share a few details and I’ll let you know what may fit."
          align="center"
          decor={false}
          surface="bg-transparent"
          contentClassName="rounded-2xl border-hair border-cocoa/10 bg-cream/90 px-6 py-8 shadow-soft backdrop-blur-sm sm:px-10 sm:py-10"
        />

        <section className="relative bg-transparent pb-4">
          <div className="container-page">
            <ul className="grid gap-4 sm:grid-cols-3">
              {CONTACT_METHODS.map((method, index) => (
                <AnimatedSection as="li" key={method.label} delay={index * 0.06}>
                  <a
                    href={method.href}
                    className="card-lift card-rule flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream-deep p-5 text-center shadow-soft"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-b from-white to-cream shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_2px_6px_-2px_rgba(62,42,33,0.18)]">
                      <method.Icon className="h-5 w-5 text-pink-dark" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-cocoa">{method.label}</span>
                      <span className="block break-all text-base text-cocoa">{method.value}</span>
                      <span className="mt-0.5 block text-xs text-cocoa-mid">{method.note}</span>
                    </span>
                  </a>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <AnimatedSection>
              <h2 className="text-center text-h2">Check current availability</h2>
              <div className="mt-6">
                <AvailabilityRequestForm />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.08} className="space-y-6 lg:sticky lg:top-24 lg:mt-8">
              <div className="rounded-2xl border-hair border-leaf/20 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <CalendarCheck className="mx-auto h-6 w-6 text-leaf-dark" aria-hidden="true" />
                <h2 className="mt-3 text-h3">{status.title}</h2>
                <p className="mt-2 text-base font-semibold text-leaf-dark">{status.detail}</p>
                <p className="mt-2 text-sm text-cocoa-mid">
                  Updated {AVAILABILITY.updated}. Exact availability varies by age and schedule.
                </p>
              </div>

              <div className="rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <Baby className="mx-auto h-6 w-6 text-leaf-dark" aria-hidden="true" />
                <h2 className="mt-3 text-h3">Care offered</h2>
                <ul className="mt-3 space-y-2 text-sm text-cocoa-mid">
                  {PROGRAMS.map((program) => (
                    <li key={program.slug}>
                      <span className="font-semibold text-cocoa">{program.name}</span>
                      {program.ageRange ? ` · ${program.ageRange}` : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-cocoa-mid">Full-time and part-time care</p>
              </div>

              <div className="rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <Clock className="mx-auto h-6 w-6 text-leaf-dark" aria-hidden="true" />
                <h2 className="mt-3 text-h3">Hours</h2>
                <p className="tabular mt-2 text-base">
                  {BUSINESS.hours.days}
                  <br />
                  {BUSINESS.hours.open} to {BUSINESS.hours.close}
                </p>
              </div>

              <div className="rounded-2xl border-hair border-cocoa/10 bg-gradient-to-b from-white to-cream p-6 text-center shadow-soft">
                <SectionLabel>What happens next</SectionLabel>
                <ol className="mt-4 space-y-3 text-left">
                  {NEXT_STEPS.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#EA4A6B] to-[#D22F51] text-xs font-semibold text-white shadow-[0_1px_0_0_#9E1F3B]"
                      >
                        {index + 1}
                      </span>
                      <span className="text-base font-medium text-cocoa">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTABand
        title="Want to see the space?"
        body="If the care you need may be a fit, the next step is a private tour where you can see the home and ask questions."
        ctaHref="/tour"
        ctaLabel="Request a Tour"
        showPhoneButton={false}
        showEmailLink={false}
      />
    </>
  );
}
