import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet" | "invert" | "outlineLight";
type Size = "sm" | "md" | "lg";

/**
 * Pill radius throughout: the geometric expression of "home, not institution."
 * Minimum heights meet the 48px touch target on md and up.
 *
 * Depth model, so the whole set stays physically consistent:
 *
 *   rest    a hard 2px shadow directly beneath the pill, in a darker shade of
 *           the pill's own color. That flat offset is what reads as an edge;
 *           a blurred shadow alone just reads as a glow.
 *   hover   the pill lifts 2px, and the hard edge grows to 3px to match, so
 *           the object appears to rise off the page rather than to stretch.
 *           A sheen sweeps across (`.btn-shine`, globals.css).
 *   active  the pill drops to 1px above the page and the edge collapses to
 *           1px: it is being pressed into the paper.
 *
 * Hover states are gated behind `@media (hover: hover)` inside `.btn-shine`,
 * because a phone that fires :hover on tap leaves the sheen frozen mid-sweep.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  // Wraps on phones, holds one line from sm up. A long label like "See full
  // rates and what is included" is wider than a 320px screen, and with
  // `overflow-x: hidden` on html an overflowing pill is clipped rather than
  // scrollable: the end of the label would simply be gone.
  "whitespace-normal text-center sm:whitespace-nowrap select-none " +
  "transition-[transform,box-shadow,background-color,border-color] duration-200 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:opacity-60 disabled:pointer-events-none " +
  "motion-reduce:transform-none motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  // The one saturated control on the page. Gradient runs light-to-dark top to
  // bottom, which is the direction light actually falls.
  primary:
    "btn-shine text-white bg-gradient-to-b from-[#EA4A6B] to-[#D22F51] " +
    "shadow-[0_2px_0_0_#9E1F3B,0_6px_16px_-4px_rgba(226,58,94,0.45)] " +
    "hover:from-[#ED5776] hover:to-[#D93758] hover:-translate-y-0.5 " +
    "hover:shadow-[0_3px_0_0_#9E1F3B,0_12px_26px_-6px_rgba(226,58,94,0.55)] " +
    "active:translate-y-px active:shadow-[0_1px_0_0_#9E1F3B,0_3px_8px_-2px_rgba(226,58,94,0.4)]",

  // Paper, not plastic: a cream pill raised off a cream page. Its edge is a
  // cocoa tint rather than a color, so it never competes with primary.
  secondary:
    "btn-shine btn-shine-soft text-cocoa border-hair border-cocoa/20 " +
    "bg-gradient-to-b from-white to-cream-deep " +
    "shadow-[0_2px_0_0_rgba(62,42,33,0.10),0_6px_14px_-6px_rgba(62,42,33,0.18)] " +
    "hover:border-cocoa/35 hover:-translate-y-0.5 " +
    "hover:shadow-[0_3px_0_0_rgba(62,42,33,0.12),0_12px_22px_-8px_rgba(62,42,33,0.22)] " +
    "active:translate-y-px active:shadow-[0_1px_0_0_rgba(62,42,33,0.10)]",

  // White pill for use on the pink CTA band. Same physics, inverted palette.
  invert:
    "btn-shine btn-shine-soft text-pink-dark bg-gradient-to-b from-white to-[#FDEFF2] " +
    "shadow-[0_2px_0_0_rgba(154,31,59,0.55),0_8px_20px_-6px_rgba(90,10,28,0.35)] " +
    "hover:-translate-y-0.5 " +
    "hover:shadow-[0_3px_0_0_rgba(154,31,59,0.55),0_14px_30px_-8px_rgba(90,10,28,0.45)] " +
    "active:translate-y-px active:shadow-[0_1px_0_0_rgba(154,31,59,0.55)]",

  // Ghost pill for the pink band's secondary action.
  outlineLight:
    "btn-shine border border-white/55 text-white bg-white/10 backdrop-blur-[2px] " +
    "shadow-[0_2px_0_0_rgba(154,31,59,0.35)] " +
    "hover:bg-white/20 hover:border-white/80 hover:-translate-y-0.5 " +
    "hover:shadow-[0_3px_0_0_rgba(154,31,59,0.35)] " +
    "active:translate-y-px active:shadow-none",

  // Text link. Deliberately flat: giving it depth would make every inline
  // action shout as loud as the CTA.
  quiet:
    "text-cocoa underline-offset-4 hover:text-pink-dark hover:underline bg-transparent px-0",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2.5 min-h-[42px]",
  md: "text-base px-6 py-3 min-h-[48px]",
  lg: "text-base px-7 py-4 min-h-[54px] sm:px-8 sm:min-h-[56px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Stretches to the container. The default on phones for any primary CTA. */
  block?: boolean;
}

type AsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };

type AsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
  };

export function Button(props: AsButton | AsLink) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    block,
    ...rest
  } = props;

  const classes = cn(
    base,
    variants[variant],
    variant === "quiet" ? sizes[size].replace(/px-\d+/, "") : sizes[size],
    block && "w-full",
    className,
  );

  // The label sits above the gloss layers so the sheen passes over the text
  // rather than under it, which is where the highlight actually belongs.
  const label =
    variant === "quiet" ? (
      children
    ) : (
      <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
    );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as AsLink;
    // tel:, sms:, mailto:, #anchors, and external URLs need a plain anchor.
    const isInternal = href.startsWith("/") && !href.startsWith("//");

    if (isInternal) {
      return (
        <Link href={href} className={classes} {...(linkRest as object)}>
          {label}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...(linkRest as object)}>
        {label}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {label}
    </button>
  );
}
