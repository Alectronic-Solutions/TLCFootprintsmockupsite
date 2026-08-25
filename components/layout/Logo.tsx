import Link from "next/link";
import { FootprintPairGlyph, PAIR_IN_ARCH } from "@/components/brand/Footprints";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * The T.L.C. Footprints mark, rebuilt from LaTrell's logo.
 *
 * Hybrid by design: the rainbow, footprints, and botanicals are pure SVG paths
 * (so they never depend on a webfont loading), while the wordmark is real HTML
 * text (so it stays selectable, searchable, and readable by a screen reader,
 * and scales with the user's font settings).
 */

/* -------------------------------------------------------------------------- */
/*  Mark                                                                      */
/* -------------------------------------------------------------------------- */

/** Where the mark's arcs stand, in viewBox units. */
const BASELINE = 56;

/**
 * Rainbow with the footprint pair nested inside it: the logo's core mark, and
 * the favicon.
 */
export function FootprintMark({
  className,
  draw = false,
  style,
}: {
  className?: string;
  draw?: boolean;
  style?: React.CSSProperties;
}) {
  const arcs = [
    { r: 46, cls: "stroke-pink" },
    { r: 35, cls: "stroke-amber" },
    { r: 24, cls: "stroke-leaf" },
  ];

  return (
    <svg
      viewBox="0 0 110 62"
      className={cn("block", className)}
      style={style}
      aria-hidden="true"
    >
      {arcs.map(({ r, cls }, i) => (
        <path
          key={r}
          d={`M ${55 - r} ${BASELINE} A ${r} ${r} 0 0 1 ${55 + r} ${BASELINE}`}
          fill="none"
          strokeWidth={8.5}
          strokeLinecap="round"
          pathLength={1}
          className={cn(cls, draw && "arc-draw")}
          style={draw ? { animationDelay: `${i * 0.12}s` } : undefined}
        />
      ))}

      {/* Footprints resting inside the arch opening, clear of the green band.
          Same group, same placement rule, as the hero's arch. */}
      <g
        transform={`translate(${PAIR_IN_ARCH.x},${(BASELINE + PAIR_IN_ARCH.dy).toFixed(2)}) scale(${PAIR_IN_ARCH.scale})`}
      >
        <FootprintPairGlyph />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wordmark                                                                  */
/* -------------------------------------------------------------------------- */

/** "T. L. C." with each initial in its own brand color, as in the logo. */
function Initials({ className }: { className?: string }) {
  const letters = [
    { ch: "T", cls: "text-pink" },
    { ch: "L", cls: "text-amber" },
    { ch: "C", cls: "text-leaf" },
  ];

  return (
    <span className={cn("font-display font-semibold tracking-[0.06em]", className)}>
      {letters.map(({ ch, cls }) => (
        <span key={ch} className={cls}>
          {ch}
          <span className="text-cocoa">.</span>{" "}
        </span>
      ))}
    </span>
  );
}

type LogoVariant = "full" | "compact";

interface LogoProps {
  variant?: LogoVariant;
  /** Wraps the lockup in a link home. Off for the homepage hero and footer. */
  asLink?: boolean;
  className?: string;
  /** Animates the rainbow drawing in. Used once, on first load. */
  draw?: boolean;
}

function Lockup({ variant, draw }: { variant: LogoVariant; draw: boolean }) {
  if (variant === "compact") {
    // Navbar lockup: mark beside the name, sized to fit inside the 72px bar.
    //
    // `whitespace-nowrap` is load-bearing. The wordmark is real text in a flex
    // row that has to share the bar with five nav links, a phone number, and a
    // button; without it the row squeezes the lockup until "C." drops to a
    // second line and the whole logo grows taller than the bar it sits in.
    return (
      <span className="flex items-center gap-2.5 whitespace-nowrap">
        <FootprintMark className="h-9 w-auto shrink-0" draw={draw} />
        <span className="flex flex-col leading-none">
          <span className="flex items-baseline">
            <Initials className="text-[1.05rem] sm:text-[1.15rem]" />
            <span className="ml-1 font-script text-[1.2rem] leading-none text-cocoa sm:text-[1.3rem]">
              Footprints
            </span>
          </span>
          <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-cocoa-mid">
            Home Daycare
          </span>
        </span>
      </span>
    );
  }

  // Full stacked lockup: mark over wordmark over tagline.
  return (
    <span className="flex flex-col items-center text-center">
      <FootprintMark className="h-16 w-auto sm:h-20" draw={draw} />

      <span className="mt-2 flex items-baseline justify-center">
        <Initials className="text-[1.75rem] sm:text-[2.25rem]" />
        <span className="font-script text-[2.4rem] leading-none text-cocoa sm:text-[3rem]">
          Footprints
        </span>
      </span>

      {/* Rules flanking "HOME DAYCARE", as in the logo */}
      <span className="mt-1.5 flex w-full items-center justify-center gap-3">
        <span className="h-px w-8 bg-leaf-dark/40 sm:w-12" />
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-cocoa sm:text-xs">
          Home Daycare
        </span>
        <span className="h-px w-8 bg-leaf-dark/40 sm:w-12" />
      </span>

      <span className="mt-2 font-display text-xs italic text-leaf-dark sm:text-sm">
        {BUSINESS.tagline}
      </span>
    </span>
  );
}

export function Logo({
  variant = "compact",
  asLink = true,
  className,
  draw = false,
}: LogoProps) {
  const content = <Lockup variant={variant} draw={draw} />;

  if (!asLink) {
    return (
      <span className={cn("inline-block", className)}>
        <span className="sr-only">{BUSINESS.name}</span>
        <span aria-hidden="true">{content}</span>
      </span>
    );
  }

  return (
    <Link
      href="/"
      className={cn("inline-block rounded-lg", className)}
      aria-label={`${BUSINESS.name}, home`}
    >
      <span aria-hidden="true">{content}</span>
    </Link>
  );
}
