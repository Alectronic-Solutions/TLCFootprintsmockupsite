import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet" | "invert" | "outlineLight";
type Size = "sm" | "md" | "lg";

/**
 * Pill radius throughout: the geometric expression of "home, not institution."
 * Minimum heights meet the 48px touch target on md and up.
 *
 * Depth: a hard 2px ledge in a darker shade of the pill's color, which
 * collapses to 1px when pressed.
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
  primary:
    "text-white bg-pink-dark shadow-[0_2px_0_0_#8A1A33] " +
    "hover:bg-[#AD2543] " +
    "active:translate-y-px active:shadow-[0_1px_0_0_#8A1A33]",

  secondary:
    "text-cocoa border-hair border-cocoa/20 bg-white " +
    "shadow-[0_2px_0_0_rgba(62,42,33,0.10)] " +
    "hover:border-cocoa/35 hover:bg-cream " +
    "active:translate-y-px active:shadow-[0_1px_0_0_rgba(62,42,33,0.10)]",

  // White pill for use on the pink CTA band.
  invert:
    "text-pink-dark bg-white shadow-[0_2px_0_0_rgba(154,31,59,0.55)] " +
    "hover:bg-pink-light " +
    "active:translate-y-px active:shadow-[0_1px_0_0_rgba(154,31,59,0.55)]",

  // Ghost pill for the pink band's secondary action.
  outlineLight:
    "border border-white/55 text-white bg-white/10 " +
    "shadow-[0_2px_0_0_rgba(154,31,59,0.35)] " +
    "hover:bg-white/20 hover:border-white/80 " +
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

  const label =
    variant === "quiet" ? (
      children
    ) : (
      <span className="inline-flex items-center gap-2">{children}</span>
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
