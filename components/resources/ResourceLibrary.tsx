"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Hand } from "lucide-react";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ResourceBadge } from "@/components/brand/ResourceBadge";
import { EASE } from "@/components/ui/AnimatedSection";
import { FlipCorner, FlipOverlay, useBookFlip, type FlipTurn } from "@/components/ui/PageFlip";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ArticleTopic } from "@/lib/mdx";
import { useMediaQuery } from "@/lib/useMediaQuery";

export interface ResourceBookData {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  readingTime: number;
  topic: ArticleTopic;
  pages: Array<{
    label: string;
    content: ReactNode;
  }>;
}

type Collection = {
  title: string;
  label: string;
  description: string;
  slugs: string[];
};

const COLLECTIONS: Collection[] = [
  {
    label: "Choose and enroll",
    title: "Build a clear care plan",
    description: "Verify care, understand assistance, and prepare for a confident first day.",
    slugs: [
      "family-guide-choosing-licensed-child-care",
      "family-guide-child-action-and-costs",
      "family-guide-enrollment-and-first-days",
    ],
  },
  {
    label: "Using the program",
    title: "Keep everyday care organized",
    description: "Understand daily care, handle health needs, and keep family records current.",
    slugs: [
      "family-guide-daily-care",
      "family-guide-health-medicine-and-sick-days",
      "family-guide-pickup-contacts-and-records",
    ],
  },
];

const SHORT_TITLES: Record<string, string> = {
  "family-guide-choosing-licensed-child-care": "Choose & verify care",
  "family-guide-child-action-and-costs": "Child Action & costs",
  "family-guide-enrollment-and-first-days": "Enrollment & first days",
  "family-guide-daily-care": "Daily care at T.L.C.",
  "family-guide-health-medicine-and-sick-days": "Health, medicine & sick days",
  "family-guide-pickup-contacts-and-records": "Pickup, contacts & records",
};

const BOOK_TONES: Record<string, string> = {
  "family-guide-choosing-licensed-child-care": "resource-shelf-book-pink",
  "family-guide-child-action-and-costs": "resource-shelf-book-amber",
  "family-guide-enrollment-and-first-days": "resource-shelf-book-amber",
  "family-guide-daily-care": "resource-shelf-book-pink",
  "family-guide-health-medicine-and-sick-days": "resource-shelf-book-leaf",
  "family-guide-pickup-contacts-and-records": "resource-shelf-book-sage",
};

const BOOK_HEIGHTS = ["h-[12.6rem]", "h-[13.5rem]", "h-[12.9rem]", "h-[13.9rem]"] as const;
const BOOK_LEANS = ["-rotate-[1.2deg]", "rotate-[0.7deg]", "-rotate-[0.4deg]", "rotate-[1.1deg]"] as const;

const TOPIC_LABELS: Record<ArticleTopic, string> = {
  choosing: "Choosing care",
  cost: "Cost & help",
  licensing: "Licensing",
  starting: "Getting started",
  "day-to-day": "Daily care",
  health: "Health & safety",
  family: "Family records",
};

const OFFICIAL_LINKS = [
  {
    eyebrow: "Help paying for care",
    title: "Child Action",
    description:
      "Check Sacramento County assistance options and join the Child Care Eligibility List.",
    href: "https://childaction.org/apply-for-subsidized-care/",
    action: "Check eligibility & apply",
    external: true,
  },
  {
    eyebrow: "Verify licensed care",
    title: "California facility search",
    description: `Review public license and inspection information. T.L.C. Footprints is #${BUSINESS.license}.`,
    href: BUSINESS.licenseSearchUrl,
    action: "Open the official lookup",
    external: true,
  },
  {
    eyebrow: "T.L.C. enrollment",
    title: "Start with a conversation",
    description:
      "See the space, talk through your child’s needs, and learn what enrollment would involve.",
    href: "/tour",
    action: "Request a tour",
    external: false,
  },
] as const;

/**
 * `afterLinks` renders between the reference desk and the family shelf, on the
 * desk's cream-deep surface, so the desk trims its bottom padding to meet it.
 */
export function ResourceLibrary({
  books,
  afterLinks,
}: {
  books: ResourceBookData[];
  afterLinks?: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 1024px)");
  const initialSlug = books.find((book) => book.topic === "licensing")?.slug ?? books[0]?.slug ?? "";
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [opened, setOpened] = useState(false);
  const readerRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const selectedBook = useMemo(
    () => books.find((book) => book.slug === selectedSlug) ?? books[0],
    [books, selectedSlug],
  );
  const pageCount = selectedBook?.pages.length ?? 0;

  const {
    active,
    shown,
    turning,
    progress,
    enter,
    goTo: goToPage,
    step,
    reset,
    dragHandlers,
  } = useBookFlip({
    count: pageCount,
    wide,
    reduce,
    // Stacked, a page can run past one screen. Turning from the bottom
    // controls should land on the top of the new page, not its end.
    onStackedTurn: () => {
      const toolbar = toolbarRef.current;
      if (toolbar && toolbar.getBoundingClientRect().top < parseFloat(getComputedStyle(toolbar).scrollMarginTop)) {
        toolbar.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      }
    },
  });

  // During a turn the paper's height runs from the page being left to the
  // page being opened, in step with the leaf, so the book resizes smoothly
  // and lands at exactly the new page's height. Heights are read when a turn
  // starts: the pages are all mounted, so this is just a layout read.
  const paperRef = useRef<HTMLDivElement>(null);
  const paperHeight = useMotionValue(0);
  const pageHeights = useRef<number[]>([]);
  const turnRef = useRef(turning);

  const syncPaperHeight = useCallback(() => {
    const turn = turnRef.current;
    if (!turn) return;
    const from = pageHeights.current[turn.from] ?? 0;
    const to = pageHeights.current[turn.to] ?? from;
    paperHeight.set(from + (to - from) * progress.get());
  }, [paperHeight, progress]);

  useMotionValueEvent(progress, "change", syncPaperHeight);

  useLayoutEffect(() => {
    turnRef.current = turning;
    if (!turning || !paperRef.current) return;
    pageHeights.current = Array.from(
      paperRef.current.querySelectorAll<HTMLElement>(":scope > .resource-reader-spread"),
      (el) => el.offsetHeight,
    );
    syncPaperHeight();
  }, [turning, syncPaperHeight]);

  const openBook = useCallback(
    (slug: string) => {
      if (!books.some((book) => book.slug === slug)) return;
      reset();
      setSelectedSlug(slug);
      setOpened(true);

      window.setTimeout(() => {
        readerRef.current?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }, 80);
    },
    [books, reduce, reset],
  );

  function onReaderKeyDown(event: React.KeyboardEvent) {
    if ((event.target as HTMLElement).closest("a, button, select, input")) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  if (!selectedBook) return null;

  const slideIn = !reduce && !wide && enter.n > 0;
  const readPercent = ((active + 1) / pageCount) * 100;

  return (
    <MotionConfig reducedMotion="user">
      <section className={cn("section-y bg-cream-deep", Boolean(afterLinks) && "pb-4 sm:pb-6")}>
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel className="text-center">The reference desk</SectionLabel>
            <h2 className="mt-3 text-center text-h2">Three useful next steps</h2>
            <p className="mx-auto mt-4 max-w-[58ch] text-lead">
              Start with the source that matches what you need today. These links lead to official
              help or to T.L.C. Footprints’ enrollment process.
            </p>
          </div>

          <ul className="mt-9 grid gap-4 lg:grid-cols-3">
            {OFFICIAL_LINKS.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col items-center rounded-2xl border-hair border-cocoa/10 bg-cream p-6 text-center shadow-soft transition duration-200 hover:-translate-y-1 hover:border-pink/25 hover:shadow-lift"
                >
                  <span className="text-center text-eyebrow font-bold uppercase tracking-[0.12em] text-leaf-dark">
                    {item.eyebrow}
                  </span>
                  <h3 className="mt-4 text-center text-h3">{item.title}</h3>
                  <p className="mt-2 flex-1 text-base">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cocoa underline decoration-pink/45 underline-offset-4 group-hover:text-pink-dark">
                    {item.action}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {afterLinks}

      <section className="resource-library section-y overflow-hidden bg-cream">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel className="text-center">The family shelf</SectionLabel>
            <h2 className="mt-3 text-h2">Choose a guide to get started</h2>
            <p className="mx-auto mt-4 max-w-[60ch] text-lead">
              <span className="block">These six handbooks cover the questions families ask most.</span>{" "}
              <span className="mt-1 block">
                They can help you compare care, prepare for enrollment, and keep everyday details
                organized.
              </span>
            </p>
            <p className="mt-5 text-sm font-bold text-leaf-dark">
              <span className="block sm:inline">Click or tap to open a book.</span>{" "}
              <span className="block sm:inline">Each page handles one task.</span>
            </p>
          </div>

          <div className="resource-shelf-case mt-10">
            {COLLECTIONS.map((collection, collectionIndex) => {
              const shelfBooks = collection.slugs
                .map((slug) => books.find((book) => book.slug === slug))
                .filter((book): book is ResourceBookData => Boolean(book));

              return (
                <section key={collection.title} className="resource-shelf-section">
                  <div className="resource-shelf-copy text-center">
                    <span className="text-eyebrow font-bold uppercase tracking-[0.13em] text-leaf-dark">
                      {collection.label}
                    </span>
                    <h3 className="mt-1.5 text-h3">{collection.title}</h3>
                    <p className="mt-2 max-w-[38ch] text-base">{collection.description}</p>
                  </div>

                  <div className="resource-shelf-books" role="group" aria-label={`${collection.title} books`}>
                    {shelfBooks.map((book, bookIndex) => {
                      const globalIndex = books.findIndex((candidate) => candidate.slug === book.slug);
                      const selected = book.slug === selectedSlug;
                      const tone = BOOK_TONES[book.slug] ?? "resource-shelf-book-pink";

                      return (
                        <motion.button
                          key={book.slug}
                          type="button"
                          onClick={() => openBook(book.slug)}
                          aria-pressed={selected}
                          aria-label={selected ? `${book.title}, open below` : `Open ${book.title}`}
                          data-resource-slug={book.slug}
                          whileHover={{ y: -8, rotate: 0 }}
                          whileTap={{ y: -2, scale: 0.98 }}
                          animate={{ y: selected ? -6 : 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className={cn(
                            "resource-shelf-book group",
                            tone,
                            BOOK_HEIGHTS[(bookIndex + collectionIndex) % BOOK_HEIGHTS.length],
                            BOOK_LEANS[(bookIndex + globalIndex) % BOOK_LEANS.length],
                            selected && "resource-shelf-book-selected !rotate-0",
                          )}
                        >
                          <span className="resource-shelf-book-edge" aria-hidden="true" />
                          {selected ? <span className="resource-shelf-book-ribbon" aria-hidden="true" /> : null}
                          <span className="resource-shelf-book-number" aria-hidden="true">
                            {String(globalIndex + 1).padStart(2, "0")}
                          </span>
                          <ResourceBadge topic={book.topic} className="resource-shelf-book-icon" />
                          <span className="resource-shelf-book-label">{TOPIC_LABELS[book.topic]}</span>
                          <span className="resource-shelf-book-title">
                            {SHORT_TITLES[book.slug] ?? book.title}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="resource-shelf-board" aria-hidden="true" />
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="open-resource-reader"
        ref={readerRef}
        data-open-book={selectedBook.slug}
        className="resource-reader-section scroll-mt-24 bg-cream-deep pb-16 pt-5 sm:pb-20 sm:pt-8"
      >
        <div className="container-page">
          <motion.div
            key={selectedBook.slug}
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: EASE }}
          >
            <div
              ref={toolbarRef}
              className="resource-reader-toolbar relative mb-5 flex scroll-mt-[calc(var(--header-h)+0.75rem)] flex-col items-center gap-4 overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-cream/80 p-4 text-center shadow-soft backdrop-blur-sm sm:flex-row sm:justify-between sm:px-5 sm:text-left"
            >
              <div className="min-w-0 text-center sm:text-left">
                <p className="flex items-center justify-center gap-2 text-sm font-bold text-leaf-dark sm:justify-start">
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Now reading
                </p>
                <h2 className="mt-1 text-h3">{selectedBook.title}</h2>
              </div>

              <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={active === 0}
                  className="resource-reader-control"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <label className="sr-only" htmlFor="resource-page-select">
                  Go to a page
                </label>
                <select
                  id="resource-page-select"
                  value={active}
                  onChange={(event) => goToPage(Number(event.target.value))}
                  className="resource-reader-select"
                >
                  {selectedBook.pages.map((page, index) => (
                    <option key={`${page.label}-${index}`} value={index}>
                      {index + 1}. {page.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={active === pageCount - 1}
                  className="resource-reader-control"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Reading progress, along the toolbar's bottom edge. */}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-cocoa/5">
                <motion.span
                  className="block h-full rounded-r-full bg-gradient-to-r from-pink via-amber to-leaf"
                  initial={false}
                  animate={{ width: `${readPercent}%` }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
              </span>
            </div>

            <div
              role="group"
              aria-roledescription="book"
              aria-label={`${selectedBook.title}, ${pageCount} pages`}
              tabIndex={0}
              onKeyDown={onReaderKeyDown}
              className="resource-reader-shell relative mx-auto max-w-6xl rounded-[1.4rem] outline-none focus-visible:ring-2 focus-visible:ring-cocoa/40 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-deep"
            >
              <div className="resource-reader-page-edges" aria-hidden="true" />
              <div className="resource-reader-book flip-frame relative isolate rounded-[1.4rem] lg:select-none" {...dragHandlers}>
                {/* The book is as tall as the page it is open to. Every page
                    stays mounted, but only the current one is in flow; the
                    rest sit out of flow at their own natural height (hidden,
                    and on phones not displayed at all), which is what lets a
                    turn measure both pages and grow or shrink the book
                    between them as the leaf crosses (`paperHeight`). */}
                <motion.div
                  ref={paperRef}
                  className="relative overflow-hidden rounded-[1.05rem]"
                  style={{ height: turning && wide && !reduce ? paperHeight : undefined }}
                >
                  {selectedBook.pages.map((page, index) => {
                    const isShown = index === shown;
                    return (
                      <div
                        key={`${selectedBook.slug}-${index}`}
                        className={cn(
                          "resource-reader-spread overflow-hidden rounded-[1.05rem]",
                          isShown ? "relative" : "absolute inset-x-0 top-0 max-lg:hidden",
                        )}
                        style={{ visibility: isShown ? "visible" : "hidden" }}
                        aria-hidden={!isShown}
                        inert={!isShown}
                        data-resource-page={index}
                        data-active-page={isShown ? "true" : undefined}
                      >
                        <motion.div
                          key={isShown ? `in-${enter.n}` : "idle"}
                          className="h-full"
                          initial={isShown && slideIn ? { opacity: 0, x: enter.dir * 32 } : false}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                        >
                          <ReaderSpread book={selectedBook} pageIndex={index} onJump={goToPage} />
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Dog-ears that lift on hover: the pages can be grabbed. */}
                {!turning && active > 0 ? <FlipCorner side="left" className="hidden lg:block" /> : null}
                {!turning && active < pageCount - 1 ? <FlipCorner side="right" className="hidden lg:block" /> : null}
              </div>

              {turning && wide && !reduce ? (
                <ReaderTurn key={turning.seq} book={selectedBook} turn={turning} progress={progress} />
              ) : null}
            </div>

            {/* Phones: turn from the bottom too, after reading down a page. */}
            <div className="no-print mt-3 flex items-center justify-between gap-3 lg:hidden">
              <button type="button" onClick={() => step(-1)} disabled={active === 0} className="resource-reader-control">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={active === pageCount - 1}
                className="resource-reader-control"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="resource-reader-footer mt-5 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
              <p className="text-center text-sm font-semibold text-cocoa-mid">
                Page {active + 1} of {pageCount} · {selectedBook.readingTime} min read · updated{" "}
                {selectedBook.updated}
              </p>
              <Link
                href={`/resources/${selectedBook.slug}`}
                className="inline-flex items-center gap-2 rounded-full border-hair border-cocoa/15 bg-cream px-5 py-2.5 text-sm font-bold text-cocoa shadow-soft transition hover:-translate-y-0.5 hover:text-pink-dark"
              >
                Open the full guide
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="no-print mt-3 hidden items-center justify-center gap-2 text-center text-sm font-semibold text-cocoa-mid lg:flex">
              <Hand className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
              Grab a page and drag it to turn, or use the arrows and contents.
            </p>
          </motion.div>

          <p aria-live="polite" className="sr-only">
            {opened ? `${selectedBook.title}. ` : ""}
            {selectedBook.pages[active]?.label}. Page {active + 1} of {pageCount}.
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}

/** One page of the open book: the title page on the left, the text on the right. */
function ReaderSpread({
  book,
  pageIndex,
  onJump,
}: {
  book: ResourceBookData;
  pageIndex: number;
  onJump?: (index: number) => void;
}) {
  return (
    <div className="grid h-full lg:grid-cols-2">
      <ReaderLeftPage book={book} pageIndex={pageIndex} onJump={onJump} />
      <ReaderRightPage book={book} pageIndex={pageIndex} />
    </div>
  );
}

/**
 * The title page, with the book's contents. On a turn's moving leaf it is a
 * picture only (`onJump` absent), so its contents are plain text there.
 */
function ReaderLeftPage({
  book,
  pageIndex,
  onJump,
  className,
}: {
  book: ResourceBookData;
  pageIndex: number;
  onJump?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("resource-reader-page resource-reader-page-left h-full", className)}>
      <div className="resource-reader-page-body flex h-full flex-col justify-center px-5 py-4 text-center sm:py-6 lg:px-10 lg:py-7">
        <div className="flex items-center justify-center gap-1.5 lg:gap-2">
          <ResourceBadge topic={book.topic} className="h-10 w-10 shrink-0 lg:h-12 lg:w-12" />
          <span className="text-eyebrow font-bold uppercase tracking-[0.13em] text-leaf-dark">
            {TOPIC_LABELS[book.topic]}
          </span>
        </div>
        <h2 className="mx-auto mt-2 max-w-[20ch] text-balance text-[1.3rem] leading-tight lg:mt-4 lg:text-[1.75rem]">
          {book.title}
        </h2>
        <p className="mx-auto mt-2.5 hidden max-w-[42ch] text-[0.95rem] leading-relaxed text-ink lg:block">{book.summary}</p>

        <nav aria-label="In this book" className="mx-auto mt-5 hidden w-full max-w-[22rem] text-left lg:block">
          <p className="mb-2 text-center text-eyebrow font-bold uppercase tracking-[0.13em] text-cocoa-mid/70">
            In this book
          </p>
          <ol className="resource-toc">
            {book.pages.map((page, index) => {
              const current = index === pageIndex;
              const inner = (
                <>
                  <span className="resource-toc-n tabular">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{page.label}</span>
                </>
              );
              return (
                <li key={`${page.label}-${index}`}>
                  {onJump ? (
                    <button
                      type="button"
                      onClick={() => onJump(index)}
                      aria-current={current ? "page" : undefined}
                      className="resource-toc-item"
                    >
                      {inner}
                    </button>
                  ) : (
                    <span className="resource-toc-item" aria-current={current ? "page" : undefined}>
                      {inner}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

function ReaderRightPage({
  book,
  pageIndex,
  className,
}: {
  book: ResourceBookData;
  pageIndex: number;
  className?: string;
}) {
  return (
    <div className={cn("resource-reader-page resource-reader-page-right h-full", className)}>
      <div className="resource-reader-page-body flex h-full flex-col px-5 py-6 sm:px-8 lg:px-10 lg:py-7">
        <div className="resource-book-prose my-auto">{book.pages[pageIndex].content}</div>
        <p className="tabular mt-4 hidden text-right text-sm font-semibold text-cocoa-mid/55 lg:block" aria-hidden="true">
          {pageIndex + 1}
        </p>
      </div>
    </div>
  );
}

/** A page turn: the shared leaf, dressed in this book's pages. */
function ReaderTurn({
  book,
  turn,
  progress,
}: {
  book: ResourceBookData;
  turn: FlipTurn;
  progress: MotionValue<number>;
}) {
  const { from, to, dir } = turn;
  const forward = dir === 1;

  return (
    <FlipOverlay
      turn={turn}
      progress={progress}
      className="resource-reader-turn"
      radius="1.05rem"
      staticLeft={<ReaderLeftPage book={book} pageIndex={forward ? from : to} />}
      staticRight={<ReaderRightPage book={book} pageIndex={forward ? to : from} />}
      front={
        forward ? (
          <ReaderRightPage book={book} pageIndex={from} className="rounded-r-[1.05rem]" />
        ) : (
          <ReaderLeftPage book={book} pageIndex={from} className="rounded-l-[1.05rem]" />
        )
      }
      back={
        forward ? (
          <ReaderLeftPage book={book} pageIndex={to} className="rounded-l-[1.05rem]" />
        ) : (
          <ReaderRightPage book={book} pageIndex={to} className="rounded-r-[1.05rem]" />
        )
      }
    />
  );
}
