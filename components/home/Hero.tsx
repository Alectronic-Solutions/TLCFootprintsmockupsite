"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footprint } from "@/components/brand/Footprints";
import { HandwrittenLine } from "@/components/brand/SignatureName";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { EmbraceBranches } from "@/components/brand/EmbraceBranches";
import { RainbowArc } from "@/components/brand/RainbowArc";
import { WatercolorWash } from "@/components/brand/Texture";
import { Photo } from "@/components/media/Photo";
import { BUSINESS } from "@/lib/constants";
import { EASE } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/cn";

/*
 * The chip row that used to sit under the CTAs - "Licensed", "Birth to 5",
 * "CPR certified", "Child Action accepted" - is gone, and so is the amber
 * availability pill that replaced it.
 *
 * Three of the four chips repeated something within two hundred pixels of
 * themselves: "Licensed" sat directly under the licence pill above the
 * headline, "Birth to 5" directly under a lead that says *birth through five*,
 * and "Child Action accepted" directly above the highlights-bar tile that says
 * the same thing with a detail line attached. Only "CPR certified" was new
 * information, and it is on /what-to-expect under Safety, where a parent
 * looking for credentials goes.
 *
 * The enrolling status is still above the fold - it is in the announcement bar
 * at the very top of every page and in the "Now enrolling" highlights tile
 * directly below this section, both driven by the same AVAILABILITY.status
 * LaTrell edits. Saying it a third time between the copy and the CTAs was the
 * one thing standing between a parent reading the hero and acting on it.
 */

/**
 * Three prints walking in along the bottom of the hero, climbing toward the
 * foot of the arch on the right.
 *
 * Coordinates are percentages of the *section* now that the photo is the
 * section background rather than a card in a right-hand column. The old rule
 * here was "keep them off the photo", which no longer means anything when the
 * photo is the whole hero; what matters instead is that they stay clear of the
 * copy, which is why the trail starts past the middle.
 *
 * sm and up only. Percent-of-section is a safe frame at those widths because
 * the copy sits in its own column and the band below it is empty by
 * construction. It is not safe on a phone, where the section is a single
 * stack and every horizontal band it could name already has type in it - see
 * PHONE_TRAIL.
 *
 * Colors run pink -> leaf -> amber rather than alternating two, so the three
 * prints carry the same three inks as the arch above them.
 */
const TRAIL = [
  { pos: "left-[40%] bottom-[4%]", r: -22, left: false, tint: "fill-pink" },
  { pos: "left-[49%] bottom-[9%]", r: -14, left: true, tint: "fill-leaf" },
  { pos: "left-[58%] bottom-[15%]", r: -8, left: false, tint: "fill-amber" },
];

/**
 * The phone set: a different idea, not a rescaled version of the same one.
 *
 * These used to climb the ragged right edge of the headline, on the theory
 * that a stacked hero has no other white space. It does not hold up. The
 * headline is the one block on the page whose width is set by its own glyphs,
 * so the "edge" the trail was aiming at moves with the font, the viewport and
 * the wrap, and on a 360px screen it moves straight through "Everlasting" -
 * three prints sitting on the largest type on the site.
 *
 * So they are anchored to the arch instead, in its right-hand gutter, and the
 * frame is the arch's own box rather than the section: the arch is `w-[58%]`
 * of the copy column and centred, which leaves a fifth of the column empty on
 * each side, and a box whose width the layout states outright cannot drift
 * onto type the way a percentage of the section can.
 *
 * They climb toward the arch's right foot, which is the same sentence the
 * sm-and-up trail tells, mirrored: the prints there walk in from the left and
 * up, so here they walk in from the right and up, and the rotations flip sign
 * with them. Smaller than the desktop set (h-6, not h-7) because next to a
 * 185px arch they are a detail beside the mark, not a third element.
 *
 * The lowest print overhangs the arch's box by a few pixels, into the `mb-5`
 * above the licence pill. That margin is why the overhang is safe, and why
 * the vertical stops short of the arch's feet rather than sitting on them.
 */
const PHONE_TRAIL = [
  { pos: "right-[-36%] top-[78%]", r: 20, left: true, tint: "fill-pink" },
  { pos: "right-[-23%] top-[64%]", r: 13, left: false, tint: "fill-leaf" },
  { pos: "right-[-11%] top-[50%]", r: 7, left: true, tint: "fill-amber" },
];

export function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="relative isolate overflow-hidden bg-cream pt-[var(--header-h)]">
      {/* ------------------------------------------------------------------
          The photo, full-bleed behind everything.

          At -z-10 so the section's own cream still paints beneath it: the
          placeholder state, and any photo that is still loading, then resolve
          against cream rather than against the page.
          ------------------------------------------------------------------ */}
      <div className="absolute inset-0 -z-10">
        <Photo name="heroRoom" fill fillLabel="none" priority sizes="100vw" />

        {/* Three scrims, each doing a different job.

            1. A cream veil over the whole frame. The rest of the site is cocoa
               on cream; an untreated photograph reads as another site's hero
               pasted in above the fold.
            2. The reading scrim under the copy. Vertical on phones, where the
               copy sits over the top of the frame, horizontal from lg, where it
               sits in the left half - a vertical gradient at desktop widths
               washes out the top of the arch for nothing.
            3. Seams. The navbar is translucent cream and the section below the
               hero is cream, so both edges have to land on cream or the
               full-bleed photo ends in a hard line. */}
        <div aria-hidden="true" className="absolute inset-0 bg-cream/70 lg:bg-cream/40" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-cream via-cream/85 to-cream/30 lg:bg-gradient-to-r lg:from-cream lg:via-cream/80 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent"
        />
      </div>

      <WatercolorWash
        tone="pink"
        className="-right-24 -top-16 h-[26rem] w-[26rem]"
        strength={0.08}
      />
      <WatercolorWash
        tone="leaf"
        className="-bottom-32 -left-24 h-[28rem] w-[28rem]"
        strength={0.06}
      />

      {/* The four arms that reach around the copy and close as the page
          scrolls. Anchored to the section, which is full-bleed, so the arms
          hinge off the page edges rather than off the 72rem container. */}
      <EmbraceBranches />

      {/* ------------------------------------------------------------------
          The arch, whole, from sm up.

          It used to rise from behind the photo card, and only the top of it
          cleared the frame - a pink dome on the page rather than the logo's
          mark. With the photo behind everything there is nothing left to hide
          it, so it stands at full height on the right and the footprint trail
          walks in toward its foot.

          Off on phones, where the in-flow arch at the head of the copy stands
          in for it. A 76%-wide arch pinned to the bottom of a stacked hero
          lands under the fixed Call / Text / Tour bar, which cuts its feet off
          and reads as a broken graphic wedged behind the bar.
          ------------------------------------------------------------------ */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 hidden max-w-[38rem] sm:bottom-10 sm:right-0 sm:block sm:w-[58%] lg:bottom-[14%] lg:right-[4%] lg:w-[42%]"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      >
        <div className={cn(!reduce && "float-slow")}>
          <RainbowArc feet draw={!reduce} className="w-full opacity-90" />
        </div>
      </motion.div>

      {TRAIL.map((step, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={cn("absolute z-0 hidden sm:block", step.pos)}
          style={{ rotate: `${step.r}deg` }}
          initial={reduce ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.8 + i * 0.14,
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
        >
          <Footprint
            left={step.left}
            className={cn("h-7 w-auto sm:h-8", step.tint)}
          />
        </motion.span>
      ))}

      {/* Standing at the arch's right foot, so it reads as a plant beside the
          arch rather than as one more piece of the page border. Off below sm,
          where the arch already runs out past the edge of the screen. */}
      <BotanicalSprig
        flip
        windScale={0.85}
        className="pointer-events-none absolute -right-4 bottom-[6%] z-0 hidden h-28 w-auto opacity-70 sm:block lg:h-36"
      />

      {/* Mirrored sprig at the arch's left foot, so the pair flanks the arch
          the way the two sprigs flank the rainbow in the logo mark rather
          than standing alone on one side of it. Unflipped, so its lean
          answers the right-hand sprig's rather than repeating it. */}
      <BotanicalSprig
        windScale={0.95}
        className="pointer-events-none absolute bottom-[2%] right-[38%] z-0 hidden h-20 w-auto opacity-60 sm:block lg:right-[40%] lg:h-28"
      />

      {/* The copy holds the left half from lg and the photo carries the right.

          The bottom padding below lg is the band the trail walks through -
          and, from sm to lg, the band the arch stands in. On a phone neither
          is down there: the arch has moved to the head of the copy and the
          prints climb the right edge of the headline, so the reserve is only
          the seam into the highlights bar. It was a full 6rem of empty cream
          between the last chip and the bar below it, which on a 360px screen
          is most of what is left above the fold.

          `min-h` from lg is what makes the background read as a hero image
          rather than as a texture behind three paragraphs: on a short viewport
          the section would otherwise be only as tall as the copy, and there
          would be no photo left to see. */}
      <div className="container-page relative flex items-center pb-8 pt-6 sm:pb-36 sm:pt-14 lg:min-h-[38rem] lg:py-16">
        <motion.div
          // Critical copy is visible in the server-rendered first paint. The
          // decorative marks below can still animate independently.
          initial={false}
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          /* Held to 32rem at lg so the copy clears the arch's left foot at
             exactly 1024, where the container is narrow and the arch is not.

             Centred on phones, where the arch above it is already centred and
             the copy is the whole column; left-aligned from sm, where it sits
             in the left half against the photo and a ragged left edge would
             have nothing to line up with. */
          className="w-full max-w-[34rem] text-center sm:text-left lg:max-w-[32rem] xl:max-w-[36rem]"
        >
          {/* ----------------------------------------------------------
              The arch, on a phone.

              Stacked, there is no right-hand column for it to stand in, so
              here it leads the hero the way the rainbow sits over the
              wordmark in the logo, and the foot of the section is handed
              back to the copy. Capped in rem as well as in percent: on a
              430px phone a flat percentage grows the arch faster than the
              type beside it and it stops reading as a mark.
              ---------------------------------------------------------- */}
          <motion.div
            aria-hidden="true"
            variants={fadeUp}
            className="relative mx-auto mb-5 w-[58%] min-w-[9rem] max-w-[13.5rem] sm:hidden"
          >
            <div className={cn(!reduce && "float-slow")}>
              <RainbowArc feet draw={!reduce} className="w-full opacity-90" />
            </div>

            {/* A small sprig at each foot of the phone arch, echoing the pair
                that flanks the rainbow in the logo. Quieter and smaller than
                the sm-and-up pair: this arch is already sharing a tight
                column with the headline, so the sprigs sit tucked at its
                feet rather than spreading past its edges. */}
            <BotanicalSprig
              windScale={1.1}
              className="pointer-events-none absolute -left-3 bottom-0 z-0 h-10 w-auto opacity-60"
            />
            <BotanicalSprig
              flip
              windScale={1.1}
              className="pointer-events-none absolute -right-3 bottom-0 z-0 h-10 w-auto opacity-60"
            />

            {/* Outside the floating wrapper, not inside it: the prints are on
                the ground the arch stands on, so they hold still while it
                drifts. */}
            {PHONE_TRAIL.map((step, i) => (
              <motion.span
                key={i}
                className={cn("absolute block", step.pos)}
                style={{ rotate: `${step.r}deg` }}
                initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + i * 0.14,
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
              >
                <Footprint
                  left={step.left}
                  className={cn("h-6 w-auto", step.tint)}
                />
              </motion.span>
            ))}
          </motion.div>

          {/* The licence line, written on rather than faded in, by the same
              mechanism as her signature further down the page. It carries what
              the licence pill used to: the word "licensed" is the link to the
              state's own record for this facility, with the facility number
              riding behind it inside the same link.

              Caveat and not Great Vibes. The signature's face was tried here
              first and was unreadable: copperplate hairlines need size, and an
              eyebrow does not have any to give. The number stays in the sans
              face for the same reason - it is nine digits a parent might
              actually check against the state's site, so it has to be digits
              first and decoration second. */}
          <motion.div variants={fadeUp}>
            <HandwrittenLine
              /* Half the signature's pen speed. That line is three words and
                 the point of it; this one is nine words of scene-setting at the
                 top of the page, and at signature speed it is still being
                 written five seconds after a parent has started reading the
                 headline below it. */
              perChar={0.05}
              /* Caveat sits lower in its line box than Great Vibes does. */
              nibTop="76%"
              className="font-hand text-[clamp(1.35rem,3.2vw,1.7rem)] font-semibold leading-[1.4] text-leaf-dark"
              words={[
                "a",
                {
                  text: "licensed",
                  href: BUSINESS.licenseRecordUrl,
                  ariaLabel: `${BUSINESS.licenseType}, license number ${BUSINESS.license}. View the state record`,
                  after: (
                    <span className="ml-2 align-baseline font-sans text-[0.55em] font-semibold tracking-wide underline decoration-leaf-dark/40 underline-offset-2">
                      #{BUSINESS.license}
                    </span>
                  ),
                },
                "home",
                "daycare",
                /* Glued to the city, so a wrapped line breaks after "daycare"
                   rather than stranding "in" at the end of the first line. */
                { text: "in", joinNext: true },
                `${BUSINESS.city},`,
                BUSINESS.stateFull,
              ]}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3d-hero mx-auto mt-4 max-w-[16ch] text-display text-cocoa sm:mx-0 sm:mt-6"
          >
            Where little feet leave{" "}
            <span className="italic text-pink-dark">
              {/* The rule is absolutely positioned, so it can only sit on a
                  single word that cannot wrap mid-span. */}
              <span className="relative inline-block">
                everlasting
                {/* The rule wipes in from the left after the headline settles,
                    so the eye is already on the word when it underlines. */}
                <motion.span
                  aria-hidden="true"
                  className="rule-rainbow absolute -bottom-1 left-0 h-[4px] w-full origin-left rounded-full"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.75, duration: 0.7, ease: EASE }}
                />
              </span>{" "}
              footprints.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[48ch] text-lead text-ink sm:mx-0 sm:mt-7"
          >
            <strong className="font-bold text-cocoa">{BUSINESS.shortName}</strong> is a small,
            licensed family child care home in {BUSINESS.city}. Children from birth
            through age 5 spend their days playing, exploring, and growing in a home where
            they are known, cared for, and encouraged to be themselves.
          </motion.p>

          {/* Full-width stacked on phones, inline from sm. A pill floating in
              the middle of a 360px screen is the classic missed mobile CTA. */}
          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
          >
            <Button href="/tour" size="lg" block className="group sm:w-auto">
              Request a Tour
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
            {/* Was "Call {phone}". The phone number stays reachable in the
                contact strip on /tour and in the footer; this slot now carries
                the second thing a parent on the fence actually wants, which is
                to know whether there is room before they commit to a tour. */}
            <Button href="/availability" size="lg" variant="secondary" block className="sm:w-auto">
              Check Availability
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
