"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from "lucide-react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ResourceIcon } from "@/components/brand/ResourceIcon";
import { EASE } from "@/components/ui/AnimatedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ArticleTopic } from "@/lib/mdx";

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

type Turn = { from: number; to: number; direction: 1 | -1 };

const TURN_DURATION = 0.64;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 300;

export function ResourceLibrary({ books }: { books: ResourceBookData[] }) {
  const reduce = useReducedMotion();
  const initialSlug = books.find((book) => book.topic === "licensing")?.slug ?? books[0]?.slug ?? "";
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [pageIndex, setPageIndex] = useState(0);
  const [turning, setTurning] = useState<Turn | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const readerRef = useRef<HTMLDivElement>(null);

  const selectedBook = useMemo(
    () => books.find((book) => book.slug === selectedSlug) ?? books[0],
    [books, selectedSlug],
  );

  const openBook = useCallback(
    (slug: string) => {
      const next = books.find((book) => book.slug === slug);
      if (!next) return;

      setSelectedSlug(slug);
      setPageIndex(0);
      setTurning(null);
      setAnnouncement(`${next.title} opened. Page 1 of ${next.pages.length}.`);

      window.setTimeout(() => {
        readerRef.current?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }, 80);
    },
    [books, reduce],
  );

  const goToPage = useCallback(
    (to: number) => {
      if (!selectedBook || to === pageIndex || to < 0 || to >= selectedBook.pages.length || turning) {
        return;
      }

      if (reduce) {
        setPageIndex(to);
        setAnnouncement(`${selectedBook.title}. Page ${to + 1} of ${selectedBook.pages.length}.`);
        return;
      }

      setTurning({ from: pageIndex, to, direction: to > pageIndex ? 1 : -1 });
    },
    [pageIndex, reduce, selectedBook, turning],
  );

  const commitTurn = useCallback(() => {
    setTurning((turn) => {
      if (!turn || !selectedBook) return null;
      setPageIndex(turn.to);
      setAnnouncement(`${selectedBook.title}. Page ${turn.to + 1} of ${selectedBook.pages.length}.`);
      return null;
    });
  }, [selectedBook]);

  function onReaderKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToPage(pageIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPage(pageIndex - 1);
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x <= -SWIPE_DISTANCE || info.velocity.x <= -SWIPE_VELOCITY) {
      goToPage(pageIndex + 1);
    } else if (info.offset.x >= SWIPE_DISTANCE || info.velocity.x >= SWIPE_VELOCITY) {
      goToPage(pageIndex - 1);
    }
  }

  if (!selectedBook) return null;

  return (
    <>
      <section className="section-y bg-cream-deep">
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

      <section className="resource-library section-y overflow-hidden bg-cream">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel className="text-center">The family shelf</SectionLabel>
            <h2 className="mt-3 text-h2">Pull down the handbook you need</h2>
            <p className="mx-auto mt-4 max-w-[60ch] text-lead">
              <span className="block">This is a focused child care library, not a stream of filler.</span>
              <span className="mt-1 block">
                Every handbook supports a decision families make before enrolling or while using
                the program.
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

                  <div className="resource-shelf-books" aria-label={`${collection.title} books`}>
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
                          aria-label={`Open ${book.title}`}
                          data-resource-slug={book.slug}
                          whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
                          whileTap={reduce ? undefined : { y: -2, scale: 0.98 }}
                          className={cn(
                            "resource-shelf-book group",
                            tone,
                            BOOK_HEIGHTS[(bookIndex + collectionIndex) % BOOK_HEIGHTS.length],
                            BOOK_LEANS[(bookIndex + globalIndex) % BOOK_LEANS.length],
                            selected && "resource-shelf-book-selected !rotate-0",
                          )}
                        >
                          <span className="resource-shelf-book-edge" aria-hidden="true" />
                          <span className="resource-shelf-book-number" aria-hidden="true">
                            {String(globalIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="resource-shelf-book-icon">
                            <ResourceIcon topic={book.topic} className="h-5 w-5" />
                          </span>
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
            initial={reduce ? false : { opacity: 0, y: 28, rotateX: -7, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: EASE }}
            style={{ perspective: reduce ? undefined : 2200 }}
          >
            <div className="resource-reader-toolbar mb-5 flex flex-col items-center gap-4 rounded-2xl border-hair border-cocoa/10 bg-cream/80 p-4 text-center shadow-soft backdrop-blur-sm sm:flex-row sm:justify-between sm:px-5 sm:text-left">
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
                  onClick={() => goToPage(pageIndex - 1)}
                  disabled={pageIndex === 0}
                  className="resource-reader-control"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <label className="sr-only" htmlFor="resource-page-select">
                  Choose a page
                </label>
                <select
                  id="resource-page-select"
                  value={pageIndex}
                  onChange={(event) => goToPage(Number(event.target.value))}
                  disabled={Boolean(turning)}
                  className="resource-reader-select"
                >
                  {selectedBook.pages.map((page, index) => (
                    <option key={`${page.label}-${index}`} value={index}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => goToPage(pageIndex + 1)}
                  disabled={pageIndex === selectedBook.pages.length - 1}
                  className="resource-reader-control"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              role="group"
              aria-roledescription="book"
              aria-label={`${selectedBook.title}, ${selectedBook.pages.length} pages`}
              tabIndex={0}
              onKeyDown={onReaderKeyDown}
              className="resource-reader-shell relative mx-auto max-w-6xl outline-none"
            >
              <div className="resource-reader-page-edges" aria-hidden="true" />
              <motion.div
                layout
                className="resource-reader-book relative isolate grid rounded-[1.4rem]"
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={onDragEnd}
                transition={{ layout: { duration: 0.34, ease: EASE } }}
              >
                <div
                  key={`${selectedBook.slug}-${pageIndex}`}
                  className="resource-reader-spread overflow-hidden rounded-[1.05rem]"
                  data-resource-page={pageIndex}
                  data-active-page="true"
                >
                  <ReaderSpread book={selectedBook} pageIndex={pageIndex} />
                </div>

                {turning && !reduce ? (
                  <TurningPage book={selectedBook} turn={turning} onDone={commitTurn} />
                ) : null}
              </motion.div>
            </div>

            <div className="resource-reader-footer mt-5 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
              <p className="text-center text-sm font-semibold text-cocoa-mid">
                Page {pageIndex + 1} of {selectedBook.pages.length} · {selectedBook.readingTime} min read ·
                updated {selectedBook.updated}
              </p>
              <Link
                href={`/resources/${selectedBook.slug}`}
                className="inline-flex items-center gap-2 rounded-full border-hair border-cocoa/15 bg-cream px-5 py-2.5 text-sm font-bold text-cocoa shadow-soft transition hover:-translate-y-0.5 hover:text-pink-dark"
              >
                Open the full guide
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <p className="resource-reader-hint mt-3 flex items-center justify-center gap-2 text-center text-sm text-cocoa-mid">
              <MoveHorizontal className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
              <span className="sm:hidden">Use the arrows, page menu, or swipe to turn the page.</span>
              <span className="hidden sm:inline">Use the arrows, page menu, arrow keys, or drag to turn the page.</span>
            </p>
          </motion.div>

          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </div>
      </section>
    </>
  );
}

function ReaderSpread({ book, pageIndex }: { book: ResourceBookData; pageIndex: number }) {
  const page = book.pages[pageIndex];

  return (
    <div className="resource-reader-paper relative grid h-full md:grid-cols-[0.78fr_1.22fr]">
      <div className="resource-reader-gutter" aria-hidden="true" />
      <div className="resource-reader-left flex flex-col items-center justify-center px-6 py-7 text-center sm:px-10 sm:py-9 md:min-h-[34rem] md:px-11 md:py-11">
        <div>
          <div className="flex items-center justify-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-hair border-cocoa/10 bg-white/55">
              <ResourceIcon topic={book.topic} className="h-5 w-5" />
            </span>
            <span className="text-eyebrow font-bold uppercase tracking-[0.13em] text-leaf-dark">
              {TOPIC_LABELS[book.topic]}
            </span>
          </div>
          <h2 className="mt-4 text-[1.65rem] leading-tight md:mt-6 md:text-h2">{book.title}</h2>
          <p className={cn("mx-auto mt-3 max-w-[36ch] text-base text-ink md:mt-4", pageIndex > 0 && "max-md:hidden")}>
            {book.summary}
          </p>
        </div>
      </div>

      <div className="resource-reader-right border-t-hair border-cocoa/10 px-6 py-8 text-center sm:px-10 sm:py-10 md:border-l-hair md:border-t-0 md:px-12 md:py-11">
        <div className="resource-book-prose">{page.content}</div>
        <p className="tabular mt-9 text-right text-sm font-semibold text-cocoa-mid/55" aria-hidden="true">
          {pageIndex * 2 + 2}
        </p>
      </div>
    </div>
  );
}

function TurningPage({
  book,
  turn,
  onDone,
}: {
  book: ResourceBookData;
  turn: Turn;
  onDone: () => void;
}) {
  const origin = turn.direction === 1 ? "left center" : "right center";

  return (
    <motion.div
      className="resource-reader-leaf no-print absolute inset-0 z-20"
      style={{ transformStyle: "preserve-3d", transformOrigin: origin }}
      initial={{ rotateY: 0 }}
      animate={{
        rotateY: turn.direction === 1 ? -180 : 180,
        rotateZ: [0, turn.direction * 0.35, 0],
        scaleX: [1, 0.985, 1],
        boxShadow: [
          "0 0 0 rgba(62,42,33,0)",
          "0 28px 72px -20px rgba(62,42,33,0.46)",
          "0 0 0 rgba(62,42,33,0)",
        ],
      }}
      transition={{ duration: TURN_DURATION, ease: EASE, times: [0, 0.5, 1] }}
      onAnimationComplete={onDone}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[1.05rem]"
        style={{ backfaceVisibility: "hidden" }}
      >
        <ReaderSpread book={book} pageIndex={turn.from} />
        <div className="resource-reader-turn-shade resource-reader-turn-shade-forward" aria-hidden="true" />
      </div>
      <div
        className="absolute inset-0 overflow-hidden rounded-[1.05rem]"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <ReaderSpread book={book} pageIndex={turn.to} />
        <div className="resource-reader-turn-shade resource-reader-turn-shade-backward" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
