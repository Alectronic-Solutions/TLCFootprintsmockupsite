"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, MessageSquare, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

/**
 * Persistent Call / Text / Tour bar under 768px.
 *
 * This business is phone-forward and parents browse one-handed, so it is the
 * highest-leverage conversion element on the site. It hides itself whenever a
 * form is on screen so it can never cover a submit button.
 *
 * The space it occupies is reserved by a `padding-bottom` on `body` in
 * globals.css, so the last rows of the footer are never trapped underneath it.
 */
export function MobileActionBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;

    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  if (hidden) return null;

  const items = [
    { href: BUSINESS.phoneHref, label: "Call", Icon: Phone },
    { href: BUSINESS.smsHref, label: "Text", Icon: MessageSquare },
    { href: "/tour", label: "Tour", Icon: CalendarCheck, primary: true },
  ];

  return (
    <div
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t-hair border-cocoa/10 bg-cream/95 backdrop-blur-md md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        // Lifts the bar off the page rather than letting it sit flush, which is
        // what stops it reading as part of the footer as you scroll past.
        boxShadow: "0 -1px 0 rgba(62,42,33,0.05), 0 -8px 24px rgba(62,42,33,0.07)",
      }}
    >
      {/* Rainbow hairline along the top edge, matching the navbar's. */}
      <span
        aria-hidden="true"
        className="rule-rainbow absolute inset-x-0 top-0 block h-[2px] opacity-70"
      />

      <nav aria-label="Quick contact" className="grid grid-cols-3">
        {items.map(({ href, label, Icon, primary }) => {
          const content = (
            <>
            <Icon
              className={
                primary
                  ? "h-5 w-5 text-pink-dark"
                  : "h-5 w-5 text-cocoa-mid transition-colors"
              }
              aria-hidden="true"
            />
            {label}
            {/* Tour is the goal, so it gets the one dot of colour. */}
            {primary && (
              <span
                aria-hidden="true"
                className="absolute bottom-1.5 h-1 w-1 rounded-full bg-pink"
              />
            )}
            </>
          );
          const className =
            "relative flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs font-semibold text-cocoa transition-colors active:bg-cream-deep";

          return href.startsWith("/") ? (
            <Link key={label} href={href} className={className}>
              {content}
            </Link>
          ) : (
            <a key={label} href={href} className={className}>
              {content}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
