import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AVAILABILITY, BUSINESS, type AvailabilityStatus } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * The strip above the navbar. One line, one job: tell a parent landing on any
 * page whether this home is taking children right now, and give them a single
 * tap to the availability form.
 *
 * It is driven by `AVAILABILITY.status`, the same value the home page pill
 * reads, so LaTrell keeps both current by editing one field in constants.ts.
 * No count is published here for the same reason it is not published there -
 * the brief supports "limited openings", not a number.
 *
 * Green is the exception to the "color lives in marks, never in large fields"
 * rule in tailwind.config.ts, and it is deliberate: the bar is 36px of a
 * ~900px viewport, and a cream strip above a cream navbar would not read as an
 * announcement at all. `leaf-dark` is the one green that clears AA against
 * cream text (4.7:1); `leaf` DEFAULT does not.
 *
 * `collapsed` is owned by the navbar, so the strip and the navbar's own
 * scrolled state change together as one movement rather than on two clocks.
 */
const STYLES: Record<
  AvailabilityStatus,
  { bar: string; dot: string; lead: string; detail: string | null; href: string | null }
> = {
  open: {
    bar: "bg-leaf-dark text-cream",
    dot: "bg-leaf-light",
    lead: "Now enrolling",
    detail: "openings available",
    href: "/availability",
  },
  limited: {
    bar: "bg-leaf-dark text-cream",
    dot: "bg-amber",
    lead: "Now enrolling",
    detail: "limited openings",
    href: "/availability",
  },
  /* No link and no green when the home is full: a bar that announces there is
     no room and then invites a tour is a bait. It states the fact and stops. */
  full: {
    bar: "bg-cocoa text-cream",
    dot: "bg-cream/60",
    lead: "Currently full",
    detail: null,
    href: null,
  },
};

const Separator = () => (
  <span aria-hidden="true" className="opacity-40">
    &middot;
  </span>
);

export function AnnouncementBar({ collapsed = false }: { collapsed?: boolean }) {
  const s = STYLES[AVAILABILITY.status];
  const place = `${BUSINESS.city}, ${BUSINESS.state}`;

  const line = (
    <>
      {/* The dot is decoration only - every word of the status is in the text,
          so nothing here depends on color perception. */}
      <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", s.dot)} />
      <span className="font-semibold">{s.lead}</span>
      {s.detail && (
        <>
          <Separator />
          <span>{s.detail}</span>
        </>
      )}
      {/* The city is the first thing to go below sm: at 320px the three
          segments plus the arrow wrap onto a second line, and a two-line
          announcement bar reads as a page error. */}
      <Separator />
      <span className="max-sm:hidden">{place}</span>
    </>
  );

  return (
    /* Height, not display, so the strip slides away under the navbar rather
       than snapping the page. `visibility` is in the transition list on
       purpose: it flips at the end of the collapse, which both keeps the text
       visible while it slides and takes the link out of the tab order once it
       is gone. */
    <div
      className={cn(
        "overflow-hidden transition-[height,visibility] duration-300 ease-out",
        collapsed ? "invisible h-0" : "visible h-[var(--announce-h)]",
        s.bar,
      )}
    >
      <div className="container-page flex h-[var(--announce-h)] items-center justify-center">
        {s.href ? (
          <Link
            href={s.href}
            className="group flex items-center gap-2 whitespace-nowrap text-xs transition-opacity hover:opacity-90"
          >
            {line}
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 max-sm:hidden"
            />
            <span className="sr-only">Check current availability</span>
          </Link>
        ) : (
          <p className="flex items-center gap-2 whitespace-nowrap text-xs">{line}</p>
        )}
      </div>
    </div>
  );
}
