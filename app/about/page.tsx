import { PageHero } from "@/components/sections/PageHero";
import { CTABand } from "@/components/sections/CTABand";
import { ThelmaStory } from "@/components/home/ThelmaStory";
import { Credentials } from "@/components/sections/Credentials";
import { AboutDayBand } from "@/components/about/AboutDayBand";
import { AboutHeroArtwork } from "@/components/about/AboutHeroArtwork";
import { PortraitFrame } from "@/components/about/PortraitFrame";
import { PhilosophyBlocks } from "@/components/about/PhilosophyBlocks";
import { PhilosophyTicTacToe } from "@/components/about/PhilosophyTicTacToe";
import { Photo } from "@/components/media/Photo";
import { ArcDivider } from "@/components/brand/ArcDivider";
import { Footprint } from "@/components/brand/Footprints";
import { HandwrittenLine } from "@/components/brand/SignatureName";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BUSINESS } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScript, pageMeta } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata = pageMeta({
  title: "About",
  description:
    "T.L.C. Footprints is a licensed family child care home in Elk Grove run by LaTrell Armstrong, named for her grandmother Thelma Louise Clark.",
  path: "/about",
  keywords: ["family childcare Elk Grove", "home daycare provider Elk Grove"],
});

/**
 * `tint` runs the same pink → amber → leaf → pink rotation the credential
 * discs and the enrollment rail use, so a footprint mark on each philosophy
 * card carries the same three inks as the rest of the page rather than
 * defaulting to pink on every card.
 *
 * The About page now uses ordinary prose wrapping in the hero and bio. These
 * narrower reading columns are more natural with normal paragraph flow than
 * with manually locked line fragments.
 */
const PHILOSOPHY = [
  {
    title: "Children learn through play",
    body: "Learning is woven into the day here. Building a tower, pretending, creating, exploring outside, and interacting with other children all give children opportunities to practice communication, problem-solving, coordination, patience, and confidence.",
    tint: "fill-pink",
    /** The one card whose own sentence is an invitation to try it. */
    withBlocks: true,
  },
  {
    title: "The day leaves room for the child",
    body: "Children develop at different rates and become interested in different things. When a child is deeply engaged in something meaningful, I want to give them room to explore it rather than rushing them from activity to activity.",
    tint: "fill-amber",
    /** The card that gets the second toy: a game that waits for its turn. */
    withGame: true,
  },
  {
    title: "Structure makes exploration possible",
    body: "Child-led care does not mean an unpredictable day. Consistent routines give children security and help them understand what comes next, while still leaving room for play, curiosity, and individual interests.",
    tint: "fill-leaf",
  },
  {
    title: "Small is intentional",
    body: "A small home daycare setting lets me notice the little things: when someone is quieter than usual, when a new skill is starting to appear, or when a child needs help joining a game. That individual attention is an important part of T.L.C. Footprints.",
    tint: "fill-pink",
  },
] as const;

export default function AboutPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    /* Every vertical rhythm override for this page lives in one place:
       the `.about-tight` block at the foot of app/globals.css. The wrapper
       is a plain div with no box of its own, so the full-bleed sections
       inside it still span the viewport. */
    <div className="about-tight">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbs) }}
      />

      {/* Two compositions again, not one:

          Below lg - the illustration runs in normal flow as its own block,
          ABOVE the copy, at its native 2.2:1 ratio. Still colours in under a
          finger drag (AboutHeroArtwork's listener is pointer-type-agnostic),
          it just is not layered under text here - a phone has no spare
          width to hold both a legible card and enough of the scene to be
          worth colouring in. Copy sits below on plain cream, matching every
          other interior page's hero.

          From lg - the illustration is full-bleed behind the whole section,
          filling the viewport below the fixed header (min-h, not a fixed
          aspect-ratio, so a short screen never shows a cut-off scene). Copy
          sits in a corner card over open sky rather than centred over the
          scene's one focal point (the family figures). Grayscale at rest,
          colouring in under the cursor. */}
      <div className="relative isolate overflow-hidden bg-cream">
        <div className="relative aspect-[11/7] w-full lg:hidden">
          <AboutHeroArtwork
            imageSrc="/about-family-illustration-panoramic-blue.webp"
            width={1863}
            height={844}
            compact
          />
        </div>

        <div className="relative flex flex-col bg-[#dceffc] lg:min-h-[calc(100svh-var(--header-h))]">
          <div className="absolute inset-0 hidden lg:block">
            <AboutHeroArtwork
              imageSrc="/about-family-illustration-panoramic-blue.webp"
              width={1863}
              height={844}
            />
          </div>

          {/* The card is sized to its own text, not to a guessed box - a
              scrim independent of the actual copy never held up across
              widths. Left-aligned and up-top from lg, a corner card over
              sky rather than a centred block over the family figures.
              Below lg the copy sits on plain cream beneath the image, not
              over it, so there is nothing here to card. */}
          <PageHero
            decor={false}
            topPaddingClassName="pt-8 lg:pt-[calc(var(--header-h)_+_3rem)]"
            surface="bg-cream lg:bg-transparent"
            align="responsive"
            contentClassName="relative max-w-[30rem] lg:rounded-[2rem] lg:bg-cream/90 lg:px-8 lg:py-7 lg:shadow-[0_20px_50px_-30px_rgba(62,42,33,0.45)] lg:backdrop-blur-sm lg:[&_h1]:leading-[1.2] lg:[&_p]:mt-6 lg:max-w-[32rem] xl:max-w-[36rem]"
            label="About"
            title="A licensed home daycare in Elk Grove"
            subtitle={`${BUSINESS.shortName} is a licensed home daycare for children from birth through age five. Small-group care keeps each day personal, playful, and responsive to every child’s pace.`}
          />
        </div>
      </div>

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      {/* Meet LaTrell */}
      <section className="section-y bg-cream-deep">
        <div className="container-page">
          {/* Grid alignment stays at its `stretch` default so the photo
              column's grid AREA is as tall as the text column beside it.
              That area is the sticky element's containing block, and the
              height difference between it and the (much shorter) portrait
              is the pin's entire travel budget. `lg:items-start` here would
              collapse the area to the portrait's own height and disable the
              pin with no visible sign anything is wrong. */}
          <div className="about-stack grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            {/* The portrait pins under the header and holds there while the
                text column scrolls past, releasing once the section's
                bottom catches up to it.

                `lg:self-start` is load-bearing, not cosmetic: a stretched
                grid item fills its grid area exactly, leaving no slack to
                move inside its own containing block, so it never sticks.
                Opting this one item out of the stretch is what turns the
                full-height area above into a gap the portrait can slide
                through.

                Sticky lives on this plain div rather than on AnimatedSection:
                framer-motion leaves a `transform` on the elements it
                animates, and a transformed ancestor becomes the containing
                block for its own sticky descendants - silently breaking the
                pin the same way. The animated wrapper stays inside it.

                The 18rem cap on PortraitFrame below is the other half of the
                budget: uncapped, a 4/5 crop filling this ~456px column runs
                ~570px tall and leaves almost nothing to hold through. */}
            <div className="lg:sticky lg:top-[calc(var(--header-h)_+_2rem)] lg:self-start">
              <AnimatedSection>
                {/* Ratio, alt text, and shot spec all come from lib/photos.ts,
                    so dropping the real file in changes nothing here. The
                    frame is purely presentational - it never touches the
                    photo workflow. */}
                <PortraitFrame
                  className="mx-auto max-w-[22rem] lg:max-w-[18rem]"
                  caption={
                    <HandwrittenLine
                      words={[BUSINESS.owner]}
                      className="mt-5 text-center font-hand text-2xl text-cocoa lg:text-left"
                    />
                  }
                >
                  <Photo
                    name="portrait"
                    sizes="(min-width: 1024px) 18rem, 22rem"
                  />
                </PortraitFrame>
              </AnimatedSection>
            </div>

            {/* lg:pb-16 (up from lg:pb-10) lengthens this column, which is
                the other lever on the pin's hold - see the comments above.
                It works against `.about-tight`'s page-shortening trim
                (app/globals.css), which is a deliberate, accepted trade: if
                the page reads too long, drop this back to lg:pb-10 first. */}
            <AnimatedSection delay={0.08} className="text-center lg:pb-16 lg:text-left">
              <SectionLabel className="text-center lg:text-left">Meet LaTrell</SectionLabel>
              <h2 className="text-3d mt-3 text-h2">The person caring for your child each day</h2>

              {/* Copy approved with LaTrell's brief in hand. Everything here is
                  either a stated fact (name, role, license, CPR, mandated
                  reporter) or her own stated intent for the house. Nothing
                  invents biography: no career history, no numbers, and no
                  claim about her own childhood. */}
              <div className="mx-auto mt-6 max-w-[42ch] space-y-5 text-body leading-relaxed lg:mx-0">
                <p>
                  I&apos;m {BUSINESS.owner}, owner and provider at {BUSINESS.shortName}. I created
                  it so children have a place where they feel safe, comfortable, cared for, and
                  free to learn through play.
                </p>
                <p>
                  I am a licensed California Family Child Care Home provider, CPR certified, and
                  a mandated reporter.
                </p>
                <p>
                  Credentials are only part of the job. Most days are made up of the smaller
                  things: reading favorite books again, helping children work through
                  disagreements, noticing when someone needs extra reassurance, celebrating new
                  milestones, and making sure every child feels seen.
                </p>
                <p>
                  I also believe in open communication with families. At pickup, I want you to
                  know how your child&apos;s day went, what they enjoyed, and anything important you
                  should know. If your child had a challenging part of the day, I&apos;ll
                  communicate that openly too.
                </p>
              </div>

              <div className="mt-6 flex justify-center lg:justify-start">
                <Button href="/tour" variant="secondary">
                  Come meet me in person
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ArcDivider variant="deep" from="bg-cream-deep" to="fill-cream" />

      {/* Trust, made verifiable: the credentials that were buried mid-paragraph
          above, pulled into their own moment with the license number a click
          from the state's own record. */}
      <Credentials surface="bg-cream" />

      <ArcDivider variant="shallow" from="bg-cream" to="fill-cream-deep" />

      <ThelmaStory withLink={false} surface="bg-cream-deep" feature />

      <ArcDivider variant="scallop" from="bg-cream-deep" to="fill-cream" />

      {/* The day this house is open - hours only, nothing invented. See the
          hard constraint documented in AboutDayBand and in lib/constants.ts. */}
      <AboutDayBand />

      <ArcDivider variant="deep" from="bg-cream" to="fill-cream-deep" />

      {/* Philosophy */}
      <section className="section-y bg-cream-deep">
        <div className="container-page">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <SectionLabel className="text-center">How I work</SectionLabel>
            <h2 className="text-3d mt-3 text-h2">Play-based and child-led</h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-lead text-ink">
              Those two phrases get used loosely, so here is what they mean in this house.
            </p>
          </AnimatedSection>

          <AnimatedGroup
            as="ul"
            className="mx-auto mt-7 grid max-w-5xl gap-x-5 gap-y-6 sm:grid-cols-2 sm:gap-x-6"
          >
            {PHILOSOPHY.map((item) => (
              <AnimatedItem as="li" key={item.title}>
                <Card interactive className="flex h-full flex-col items-center text-center lg:p-8">
                  {/* The raised bubble matches the one HighlightsBar uses for
                      the day-rhythm marks - a neutral disc rather than a
                      tinted one, since the footprint itself carries the
                      pink/amber/leaf rotation and a tinted disc behind it
                      would stack two brand colours in one 48px circle. */}
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-hair border-cocoa/15 bg-gradient-to-b from-white to-cream-deep shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_2px_6px_-2px_rgba(62,42,33,0.15)]"
                  >
                    <Footprint className={cn("h-8 w-auto", item.tint)} />
                  </span>
                  <h3 className="mt-4 text-h3">{item.title}</h3>
                  <p className="mt-3 text-pretty">{item.body}</p>

                  {/* The one card whose sentence describes stacking and
                      toppling gets the toy that lets a parent try it - the
                      same physics pen the home page uses, sized for a card.
                      Aria-hidden: it says nothing the sentence above did not
                      already say. mt-auto pins it to the bottom of the card
                      so the shorter sibling cards do not gain empty space
                      matching its height. */}
                  {"withBlocks" in item && item.withBlocks ? (
                    <PhilosophyBlocks className="mt-auto pt-4" />
                  ) : null}

                  {/* The card about giving a child room to follow something
                      through gets the game that has to wait its turn: the
                      visitor plays, the house answers on its own a beat
                      later, and a finished board clears itself. Unlike the
                      pen this is operable, so it keeps its labels and its
                      live region rather than being aria-hidden. mt-auto
                      pins it to the bottom, matching the pen opposite. */}
                  {"withGame" in item && item.withGame ? (
                    <PhilosophyTicTacToe className="mt-auto pt-4" />
                  ) : null}
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* Tour logistics stay at what the brief actually states: by appointment,
          LaTrell confirms the time. The earlier "you are welcome to bring your
          child" was never confirmed by her, so it is not promised here. */}
      <CTABand
        title={`Come see if ${BUSINESS.shortName} is right for your family`}
        body="A website can tell you a lot, but visiting is the best way to get a feel for the place. Tours are by appointment. Call, text, or email LaTrell to request a time."
      />
    </div>
  );
}
