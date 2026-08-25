import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ScrollSprig } from "@/components/brand/ScrollSprig";
import { WatercolorWash } from "@/components/brand/Texture";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FaqHeroBackdrop } from "@/components/sections/FaqHeroBackdrop";

/**
 * Interior page header. Cream like every other surface, so the navbar never
 * has to invert.
 */
export function PageHero({
  label,
  title,
  subtitle,
  children,
  /**
   * Drops this hero's own washes and sprigs. For a caller placing its own
   * decoration behind the hero (About's EmbraceBranches, which wants a clear
   * frame rather than a second layer of sprigs fighting its arms), or for
   * `backdrop`, which supplies its own washes and would otherwise double up.
   */
  decor = true,
  /**
   * The section's own background.
   *
   * It has to be overridable, because `bg-cream` here is opaque and this
   * section is the last positioned element most callers render: anything a
   * caller paints *behind* the hero as a sibling - About's coloring scene -
   * is covered by it completely, and no amount of negative z-index on the
   * sibling helps. Negative z-index only lifts a child above the background
   * of its own stacking context, and that background belongs to this
   * section, not to the caller's wrapper. Hero.tsx does not need this only
   * because its photo lives inside the section rather than beside it.
   */
  surface = "bg-cream",
  /**
   * `"responsive"` (default) is every other page: centered on phones and
   * tablets, flush-left from `lg` - see the comment on the block below.
   * `"center"` keeps it centered at every width. `"xl-responsive"` delays the
   * left-aligned desktop treatment until a genuinely wide screen.
   */
  align = "responsive",
  contentClassName,
  topPaddingClassName = "pt-[var(--header-h)]",
  /**
   * Full-bleed backdrop with a scroll parallax drift, veiled under a cream
   * scrim so the copy stays legible over it and feathered top and bottom so
   * it sews into the navbar and the arc divider below rather than ending on
   * a hard edge. Off by default.
   *
   * `true` renders the shared watercolor-wash backdrop (FaqHeroBackdrop);
   * pass a node instead when a caller wants its own illustrated backdrop
   * (Resources' rainbow-arc-and-footprints one) under the same scrim rather
   * than building the wrapper div dance About uses.
   */
  backdrop = false,
  backdropScrimClassName = "bg-cream/40",
  responsiveBackdrop,
}: {
  label?: string;
  title: string;
  /**
   * ReactNode, not string, so a caller can hand this Clause / Phrase runs
   * (components/ui/Run.tsx) and control where the lines break rather than
   * letting the measure decide. About does; everyone else passes a string.
   */
  subtitle?: ReactNode;
  children?: ReactNode;
  decor?: boolean;
  surface?: string;
  align?: "responsive" | "xl-responsive" | "center";
  /** Optional visual treatment for this page's copy block. */
  contentClassName?: string;
  /** Lets a page reserve the fixed header only at the breakpoints it needs. */
  topPaddingClassName?: string;
  backdrop?: boolean | ReactNode;
  /** Opacity/color of the layer between a custom backdrop and the hero copy. */
  backdropScrimClassName?: string;
  /** One artwork node that sits before the copy on phones and behind it from sm up. */
  responsiveBackdrop?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        // `isolate` so a negative z-index backdrop actually paints above this
        // section's own background: without it, this browser's compositor
        // treats overflow-hidden + a negative-z child as fully occluded by
        // the section's own background instead of painting between them -
        // Hero.tsx's full-bleed photo carries the same class for the same
        // reason.
        backdrop || responsiveBackdrop ? "isolate" : null,
        // This section is a full-bleed, `relative` positioned box, so even
        // where `surface` leaves it visually transparent it still sits over
        // whatever a caller painted behind it (About's coloring artwork) and
        // swallows pointer events across its entire area - including the
        // empty sky far from the actual copy card. `pointer-events-none`
        // lets hover/touch reach that backdrop instead; the copy column
        // below opts back in with `pointer-events-auto` so its own links and
        // buttons keep working. Only applied when `surface` says this
        // section has no opaque background of its own to protect.
        surface.includes("transparent") ? "pointer-events-none" : null,
        topPaddingClassName,
        surface,
      )}
    >
      {responsiveBackdrop ? (
        <>
          <div className="relative h-[70vh] min-h-[26rem] pointer-events-auto sm:absolute sm:inset-0 sm:-z-10 sm:h-auto sm:min-h-0">
            {responsiveBackdrop}
          </div>
          <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0 -z-10 hidden sm:block", backdropScrimClassName)}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-20 bg-gradient-to-b from-cream to-transparent sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-20 bg-gradient-to-t from-cream to-transparent sm:block"
          />
        </>
      ) : backdrop ? (
        <>
          {backdrop === true ? <FaqHeroBackdrop /> : backdrop}
          {/* Cream scrim, uniform rather than directional: unlike Hero.tsx's
              photo, the backdrop has no side that needs to stay clear for a
              copy column, because the copy sits centered over the middle of
              it at every width. */}
          <div
            aria-hidden="true"
            className={cn("absolute inset-0 -z-10", backdropScrimClassName)}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-cream to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-cream to-transparent"
          />
        </>
      ) : null}

      {decor ? (
        <>
          <WatercolorWash tone="pink" className="-right-20 -top-20 h-80 w-80" strength={0.07} />
          <WatercolorWash
            tone="leaf"
            className="-bottom-24 left-1/3 hidden h-72 w-72 lg:block"
            strength={0.05}
          />
          <ScrollSprig
            side="left"
            tilt={12}
            windScale={1.2}
            distance={70}
            className="absolute -left-8 bottom-0 hidden h-28 opacity-50 sm:block"
          />
          {/* The facing sprig only appears at lg, where there is empty measure
              to the right of a 58ch subtitle for it to sit in. Sits at the
              same bottom-0 baseline as the left sprig so the two branches
              read as a matched pair rather than sitting at different
              heights. */}
          <ScrollSprig
            side="right"
            flip
            leavesOnly
            tilt={-6}
            windScale={0.9}
            distance={70}
            className="absolute -right-4 bottom-0 hidden h-24 opacity-40 lg:block"
          />
        </>
      ) : null}

      <div
        className={cn(
          "container-page relative py-10 sm:py-14",
          responsiveBackdrop ? "pointer-events-none" : "pointer-events-auto",
        )}
      >
        {/* Centered on phones and tablets, where a left-aligned block under a
            centered navbar reads as a misalignment rather than a choice. Back
            to flush-left at lg, the same flip the body sections use. */}
        <AnimatedSection
          className={cn(
            "mx-auto max-w-3xl text-center",
            align === "responsive" && "lg:mx-0 lg:text-left",
            align === "xl-responsive" && "xl:mx-0 xl:text-left",
            responsiveBackdrop ? "pointer-events-auto" : null,
            contentClassName,
          )}
        >
          {label ? (
            <SectionLabel
              className={cn(
                "text-center",
                align === "responsive" && "lg:text-left",
                align === "xl-responsive" && "xl:text-left",
              )}
            >
              {label}
            </SectionLabel>
          ) : null}
          <h1 className="text-3d mt-4 text-h1 text-cocoa">{title}</h1>
          {subtitle ? (
            <p
              className={cn(
                "mx-auto mt-5 max-w-[46ch] text-lead text-ink",
                align === "responsive" && "lg:mx-0 lg:max-w-[54ch]",
                align === "xl-responsive" && "xl:mx-0 xl:max-w-[54ch]",
                align === "center" && "lg:max-w-[52ch]",
              )}
            >
              {subtitle}
            </p>
          ) : null}
          {children ? (
            <div
              className={cn(
                "mt-8 flex justify-center",
                align === "responsive" && "lg:justify-start",
                align === "xl-responsive" && "xl:justify-start",
              )}
            >
              {children}
            </div>
          ) : null}
        </AnimatedSection>
      </div>
    </section>
  );
}
