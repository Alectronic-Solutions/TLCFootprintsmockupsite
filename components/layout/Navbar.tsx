"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, MessageSquare, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { AnnouncementBar } from "./AnnouncementBar";
import { Button } from "@/components/ui/Button";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";
import { EASE } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/cn";

/**
 * Every page on this site is cream, so unlike the dark-hero pattern this
 * navbar has exactly one visual state: it gains a hairline, a shadow, and a
 * heavier blur once you scroll past the top.
 *
 * The rainbow rule along the bottom edge doubles as a read-progress bar. It is
 * the logo's own three arcs unrolled into a line, so it costs no new visual
 * vocabulary, and on a long page like /programs it is genuinely useful.
 */
export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 16);

      // Scrollable distance, not document height: on a short page the
      // denominator is 0 and the bar should simply stay empty.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };

    // Scroll fires far more often than a frame renders. Coalescing to one
    // measurement per frame is what keeps this off the main-thread budget.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll, trap focus, and restore focus to the toggle on close.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 transition-all duration-300",
        // lg:pointer-events-none lets hover/touch pass through the header's
        // own translucent background to whatever sits behind it - on the
        // About page that's the top strip of the hero artwork (sun,
        // rainbow), which otherwise could never be swept/coloured since it
        // sits directly under this fixed bar. Every actual control below
        // (announcement bar, logo, nav links, phone, CTA, mobile toggle)
        // opts back in with lg:pointer-events-auto, so nothing here loses
        // click/hover; only the empty chrome around them becomes see-through.
        "lg:pointer-events-none",
        scrolled
          ? "border-b-hair border-cocoa/10 bg-cream/90 shadow-soft backdrop-blur-md"
          : "bg-cream/70 backdrop-blur-sm",
      )}
    >
      {/* Collapses on scroll rather than riding along: it is an arrival
          message, and past the fold it is 36px of a phone screen spent on
          something already read. `scrolled` drives it and the header chrome
          together, so the two move as one. */}
      <div className="lg:pointer-events-auto">
        <AnnouncementBar collapsed={scrolled} />
      </div>

      {/* The bar is a fixed 72px, so nothing inside it may wrap: a wrapped nav
          label or wordmark grows taller than the bar and spills onto the page.
          Everything in this row is therefore `shrink-0` and `whitespace-nowrap`,
          and the widths are tuned to the 72rem container the row lives in. */}
      <div className="container-page flex h-[72px] items-center justify-between gap-3 lg:pointer-events-auto">
        <Logo variant="compact" className="shrink-0" />

        <nav aria-label="Main" className="hidden shrink-0 items-center gap-0.5 lg:flex xl:gap-1">
          {NAV_LINKS.filter((l) => l.href !== "/tour").map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:px-3.5 xl:text-base",
                  active
                    ? "bg-cream-deep text-cocoa"
                    : "text-cocoa-mid hover:bg-cream-deep hover:text-cocoa",
                )}
              >
                {link.label}
                {/* A 2px pink tick under the current section. The background
                    pill alone is too quiet against cream-deep sections. */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-pink xl:inset-x-3.5"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {/* Between lg and xl the five nav labels leave no room for a ten
              character phone number, so it appears as an icon-only call button
              there and as the full number once there is space for it. The
              number is never the only way to reach the phone: the footer and
              the mobile action bar both carry it. */}
          <a
            href={BUSINESS.phoneHref}
            aria-label={`Call ${BUSINESS.phone}`}
            className="flex items-center gap-2 whitespace-nowrap rounded-full px-1 text-base font-semibold text-cocoa transition-colors hover:text-pink-dark"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">{BUSINESS.phone}</span>
          </a>
          <Button href="/tour" size="sm" className="whitespace-nowrap">
            Request a Tour
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 grid h-12 w-12 place-items-center rounded-full text-cocoa transition-colors hover:bg-cream-deep active:bg-cream-deep lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Read progress. Hidden until you have actually started reading, so it
          is never a stray coloured line sitting under the logo at rest. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
      >
        {/* Opacity is a class, not an inline style, on purpose: the
            reduced-motion and print rules both force `[style*="opacity"]` to
            1, which would strand a coloured stub under the logo at rest. */}
        <div
          className={cn(
            "rule-rainbow scroll-rule h-full origin-left transition-opacity duration-300",
            progress > 0.01 ? "opacity-100" : "opacity-0",
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            key="mobile-menu"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden border-t-hair border-cocoa/10 bg-cream lg:hidden lg:pointer-events-auto"
          >
            {/* dvh, not vh: on iOS Safari the address bar makes vh taller than
                the visible viewport, which would push the tour button off the
                bottom of the panel with no way to reach it. */}
            <nav
              aria-label="Mobile"
              className="container-page flex max-h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto py-3"
            >
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 border-b-hair border-cocoa/10 py-3.5 text-lg font-semibold transition-colors",
                      active ? "text-pink-dark" : "text-cocoa active:text-pink-dark",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                        active ? "bg-pink" : "bg-cocoa/15",
                      )}
                    />
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href={BUSINESS.phoneHref}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border-hair border-cocoa/20 bg-gradient-to-b from-white to-cream-deep text-base font-semibold text-cocoa shadow-[0_2px_0_0_rgba(62,42,33,0.10)]"
                >
                  <Phone className="h-4 w-4 text-pink-dark" aria-hidden="true" />
                  Call
                </a>
                <a
                  href={BUSINESS.smsHref}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border-hair border-cocoa/20 bg-gradient-to-b from-white to-cream-deep text-base font-semibold text-cocoa shadow-[0_2px_0_0_rgba(62,42,33,0.10)]"
                >
                  <MessageSquare className="h-4 w-4 text-pink-dark" aria-hidden="true" />
                  Text
                </a>
              </div>

              <Button href="/tour" size="md" block className="mb-4 mt-3">
                Request a Tour
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
