import { cn } from "@/lib/cn";
import { ScrollSprig } from "@/components/brand/ScrollSprig";
import { HeartDots } from "@/components/brand/HeartDots";
import { SignatureName } from "@/components/brand/SignatureName";
import { WatercolorWash } from "@/components/brand/Texture";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Clause, Phrase } from "@/components/ui/Run";
import { BUSINESS } from "@/lib/constants";

/**
 * The emotional centre of the brand, and the one thing no competitor can copy.
 * It gets the best typography on the site and nothing competing for attention.
 */
/**
 * `surface` exists because these sections are reused in different positions on
 * different pages, and the cream / cream-deep alternation has to keep working
 * wherever they land. Hardcoding a background here is what forces a caller to
 * bend its arc dividers around the component instead of the other way round.
 */
export function ThelmaStory({
  withLink = true,
  surface = "bg-cream",
  /**
   * The About page's cinematic treatment: a held, near-full-height beat
   * instead of a passing block. Everything else on that page moves; this is
   * the one place a slow, almost-still moment is correct. Additive and
   * default-off so the Home page rendering is untouched.
   */
  feature = false,
}: {
  withLink?: boolean;
  surface?: "bg-cream" | "bg-cream-deep";
  feature?: boolean;
}) {
  return (
    <section
      className={cn(
        "section-y relative overflow-hidden",
        feature && "flex items-center",
        surface,
      )}
      style={feature ? { minHeight: "75svh" } : undefined}
    >
      <WatercolorWash
        tone="pink"
        className={cn(
          "-left-24 top-10 h-96 w-96",
          feature && "wash-drift",
        )}
        strength={0.07}
      />
      {/* Four corners, one matched set: the same branch asset (flipped for
          the right side) at the same size and distance in every corner, so
          all four read as one consistent frame rather than mismatched
          pieces. The windScale is deliberately not matched across a
          left/right pair, because two sprigs swaying on the same beat read
          as one asset flipped rather than as two branches. The sprig's own
          stem base sits at the bottom of its viewBox with the leafy tip
          reaching up and out, which is what the bottom pair wants as-is. The
          top pair takes `flipY` to move that stem base to the top edge so the
          tip hangs down into the frame instead. That has to be the prop and
          not a `scale-y-[-1]` class: ScrollSprig writes an inline `transform`
          for its scroll animation, which silently beats a Tailwind transform
          utility - which is why the class version never actually flipped. */}
      <ScrollSprig
        side="left"
        flipY
        tilt={4}
        windScale={1.1}
        distance={110}
        className="absolute -left-6 top-8 hidden h-36 opacity-50 sm:block"
      />
      <ScrollSprig
        side="right"
        flip
        flipY
        tilt={-4}
        windScale={1.3}
        distance={110}
        className="absolute -right-6 top-8 hidden h-36 opacity-50 sm:block"
      />
      <ScrollSprig
        side="left"
        tilt={4}
        windScale={1.1}
        distance={110}
        className="absolute -left-6 bottom-8 hidden h-36 opacity-50 sm:block"
      />
      <ScrollSprig
        side="right"
        flip
        tilt={-4}
        windScale={1.3}
        distance={110}
        className="absolute -right-6 bottom-8 hidden h-36 opacity-50 sm:block"
      />

      <div className="container-prose relative w-full text-center">
        <AnimatedSection>
          <SectionLabel className="text-center">The name</SectionLabel>
          <h2 className={cn("text-3d mt-4", feature ? "text-h1" : "text-h2")}>
            T.L.C. is my grandmother
          </h2>

          {/* Great Vibes has very wide glyphs, so this line is sized off the
              viewport rather than off a ch measure: at a fixed 2.75rem it
              overflows a 320px screen. Held a touch larger and slower in the
              featured treatment, where the reveal is the point rather than a
              beat in a page that is otherwise moving past it. */}
          <SignatureName
            name="Thelma Louise Clark"
            perChar={feature ? 0.13 : undefined}
            className={cn(
              "mx-auto mt-8 max-w-[26ch] font-script leading-[1.2] text-pink-dark",
              feature
                ? "text-[clamp(2.25rem,11vw,4.5rem)]"
                : "text-[clamp(2rem,9vw,3.5rem)]",
            )}
          />

          <HeartDots className="mt-6" dots={4} />

          <div className="mx-auto mt-8 max-w-[60ch] space-y-5 text-body text-ink">
            <p>
              <Clause>
                <Phrase>The T.L.C. in T.L.C. Footprints</Phrase>{" "}
                <Phrase>is not a tagline</Phrase>{" "}
                <Phrase>about tender loving care.</Phrase>
              </Clause>{" "}
              <Clause>It is my grandmother&apos;s name.</Clause>
            </p>
            <p>
              <Clause>
                <Phrase>Her name became part of the daycare</Phrase>{" "}
                <Phrase>because I wanted this place</Phrase>{" "}
                <Phrase>to stand for something</Phrase>{" "}
                <Phrase>personal and lasting.</Phrase>
              </Clause>
            </p>
            <p>
              <Clause>
                <Phrase>My goal is to create a place</Phrase>{" "}
                <Phrase>where children feel safe,</Phrase>
              </Clause>{" "}
              <Clause>comfortable, cared for,</Clause>{" "}
              <Clause>
                <Phrase>and loved,</Phrase> <Phrase>with room to play,</Phrase>
              </Clause>{" "}
              <Clause>explore, learn,</Clause>{" "}
              <Clause>and grow at their own pace.</Clause>
            </p>
            <p>
              <Clause>
                <Phrase>That idea is also</Phrase>{" "}
                <Phrase>behind the tagline:</Phrase>
              </Clause>{" "}
              <span className="inline-block font-hand text-[1.2em] text-pink-dark">
                &ldquo;{BUSINESS.tagline}.&rdquo;
              </span>
            </p>
          </div>

          {withLink ? (
            <div className="mt-7">
              <Button href="/about" variant="secondary">
                More about T.L.C. Footprints
              </Button>
            </div>
          ) : null}
        </AnimatedSection>
      </div>
    </section>
  );
}
