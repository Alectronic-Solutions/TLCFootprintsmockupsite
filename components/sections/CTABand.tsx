import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { FootprintField } from "@/components/brand/FootprintField";
import { HeartDots } from "@/components/brand/HeartDots";
import { SurfaceGrain } from "@/components/brand/Texture";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BUSINESS } from "@/lib/constants";

/**
 * One sentence per line, so a line never breaks on "just call / or text."
 *
 * The lowercase guard in the lookbehind is the whole trick: the character
 * before an abbreviation's dot is a capital ("T.L.C. Footprints"), the one
 * before a real sentence end is not. Splitting on ". " alone turns the
 * article-page copy into four lines, three of them a single letter.
 */
function sentences(text: string): string[] {
  return text.split(/(?<=[a-z0-9)][.!?])\s+/);
}

/**
 * The one saturated section on the site. Used once per page, at the bottom.
 */
export function CTABand({
  title = "Come see the space",
  body = "Tours are by appointment. Request a time online, or call or text me directly.",
  from = "bg-cream-deep",
  ctaHref = "/tour",
  ctaLabel = "Request a Tour",
  showPhoneButton = true,
  showEmailLink = true,
}: {
  title?: string;
  body?: string;
  /** Tailwind bg class of the section above, for the incoming seam. */
  from?: string;
  ctaHref?: string;
  ctaLabel?: string;
  showPhoneButton?: boolean;
  showEmailLink?: boolean;
}) {
  return (
    <>
      <ArcDivider variant="deep" from={from} to="fill-pink" rule />

      {/* Pink to pink-dark down the band. The top stays exactly #E23A5E, which
          is what the heading's extruded shadow and the invert button are tuned
          against, and what the incoming arc fills with.

          The ramp finishes at 55% rather than at the bottom edge so the copy
          lands on deep pink at every band height: on a phone the band is taller
          and the paragraph sits proportionally higher, which on a full-height
          ramp left it at 4.2:1 - under the 4.5:1 floor that flat pink was
          already failing. Finishing early makes the fix hold on the screens the
          audience actually reads this on. */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-pink to-pink-dark to-[55%]">
        <FootprintField />

        {/* Amber and leaf glows, screened so they add light rather than mix
            to mud on pink. Off below sm, where they would sit under the copy
            and drop contrast. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden mix-blend-screen sm:block print:hidden"
          style={{
            backgroundImage: [
              "radial-gradient(34% 38% at 98% 28%, rgba(242,166,59,0.44) 0%, rgba(242,166,59,0) 62%)",
              "radial-gradient(34% 38% at 2% 72%, rgba(111,168,60,0.48) 0%, rgba(111,168,60,0) 62%)",
            ].join(", "),
          }}
        />

        {/* The page's paper grain is fixed behind the app and never reaches a
            painted field, so this surface carries its own. */}
        <SurfaceGrain className="opacity-[0.12] mix-blend-soft-light print:hidden" />

        <div className="container-page relative py-12 text-center sm:py-14">
          <AnimatedSection>
            {/* Her flyers open a block with the dotted heart rather than
                interrupting one, and nothing should sit between the reason and
                the button that acts on it. */}
            <HeartDots className="mb-6 [&_span]:!bg-white [&_svg_path]:!fill-white" />

            <h2 className="text-h2 text-white">{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lead text-white">
              {sentences(body).map((sentence) => (
                <span key={sentence} className="block text-balance">
                  {sentence}{" "}
                </span>
              ))}
            </p>

            {/* Stacked and full-width on phones: a centered pill with dead space
                either side is the single most-missed CTA layout on mobile. */}
            <div className="mx-auto mt-8 flex max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
              <Button href={ctaHref} size="lg" variant="invert" block className="sm:w-auto">
                {ctaLabel}
              </Button>
              {showPhoneButton ? (
                <Button
                  href={BUSINESS.phoneHref}
                  size="lg"
                  variant="outlineLight"
                  block
                  className="sm:w-auto"
                >
                  Call {BUSINESS.phone}
                </Button>
              ) : null}
            </div>

            {showEmailLink ? (
              <p className="mt-6 text-sm text-white">
                Prefer email?{" "}
                <Link
                  href="/tour"
                  className="font-semibold text-white underline underline-offset-4"
                >
                  See every contact option
                </Link>
              </p>
            ) : null}
          </AnimatedSection>
        </div>
      </section>

      {/* -mt-px tucks the seam under the band. The band is composited (blend
          layers, animated prints) and snaps to a different pixel than the
          divider below it, which on some page heights left a 1px gap of page
          background between them. */}
      <ArcDivider variant="shallow" from="bg-pink-dark" to="fill-cream-deep" rule className="-mt-px" />
    </>
  );
}
