"use client";

import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { FootShape } from "./FootShape";
import { PuzzleTile, type PieceTone } from "./PuzzleTile";
import { IncludedClipboard } from "./IncludedClipboard";
import { PUZZLE_PIECES, type FootRegion } from "./checklistPieces";

const ALL_PIECE_IDS = PUZZLE_PIECES.map((p) => p.id);

// The completed footprint uses each brand tone exactly twice. This fixed,
// alternating palette keeps neighboring regions distinct and guarantees that
// the new snack half is always the requested yellow/amber piece.
const PIECE_TONES: Record<string, PieceTone> = {
  deposit: "amber",
  schedule: "pink",
  breakfast: "leaf",
  snacks: "amber",
  lunch: "pink",
  "child-action": "leaf",
};

/**
 * The foot puzzle and the clipboard checklist, one interaction.
 *
 * Every piece is its own foot-region cutout plus its label, using a fixed,
 * balanced brand palette and sitting in an open tray until it is dragged or
 * clicked onto the foot.
 * Placing it fills that region in and ticks the matching line on the
 * clipboard beside it: one action, one payoff, nothing asked for twice.
 * checklistPieces.ts is the shared map that keeps the puzzle and the sheet
 * from drifting into two different lists of "the same" six facts.
 *
 * Each region on the foot still knows the one piece cut to fit it (see
 * FootShape.tsx), while the full silhouette is a forgiving drop target: once
 * a piece reaches the footprint, it routes to its proper region. Dragging is
 * for a mouse or trackpad; every tile is also a real
 * `<button>`, so a tap or an Enter/Space press places it directly, in its
 * correct spot, without needing to be dragged anywhere at all.
 *
 * `armed` is the same trick the old scroll-triggered clipboard used, moved
 * here: the puzzle needs JavaScript to play, so the *default* state - before
 * React has mounted, and forever for a no-JS visitor - is "complete." A
 * visitor who can actually play it watches the checklist reset to blank and
 * fill back in as they place each piece; everyone else, and print (see the
 * `.foot-checklist` rules in globals.css), simply sees the finished facts.
 * Content is never gated behind an interaction that might not be available.
 *
 * The palette is deterministic on the server and client, so the six-piece
 * arrangement never changes color during hydration or between visits.
 */
export function FootprintChecklist() {
  const [armed, setArmed] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [snappedPiece, setSnappedPiece] = useState<string | null>(null);
  const [snapKey, setSnapKey] = useState(0);
  const placedIds = useRef(new Set<string>());

  useEffect(() => {
    setArmed(true);
  }, []);

  const effectivePlaced = armed ? placed : ALL_PIECE_IDS;
  const complete = placed.length === PUZZLE_PIECES.length;

  const toneFor = (pieceId: string) => PIECE_TONES[pieceId] ?? "pink";

  // Each filled region keeps the same intentionally assigned tone shown in
  // the tray, so the assembled foot has a predictable two-of-each balance.
  const filled = PUZZLE_PIECES.reduce(
    (acc, piece) => {
      acc[piece.region] = effectivePlaced.includes(piece.id) ? toneFor(piece.id) : null;
      return acc;
    },
    {} as Record<FootRegion, PieceTone | null>,
  );

  function place(id: string) {
    if (placedIds.current.has(id)) return;
    placedIds.current.add(id);
    setPlaced((current) => [...current, id]);
    setSnappedPiece(id);
    setSnapKey((current) => current + 1);
  }

  const tray = PUZZLE_PIECES.filter((p) => !placed.includes(p.id));

  return (
    <div className="foot-checklist relative isolate overflow-hidden rounded-[2rem] border border-cocoa/10 bg-white/75 p-3 shadow-lift sm:p-5 lg:p-6">
      <span
        aria-hidden="true"
        className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-amber-light/70 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-leaf-light/70 blur-3xl"
      />

      <header className="relative z-10 rounded-[1.5rem] border border-cocoa/10 bg-gradient-to-br from-white via-white to-cream px-5 py-5 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-7 sm:px-7 sm:py-6">
        <div className="max-w-[42rem]">
          <p className="text-eyebrow font-bold uppercase text-leaf-dark">
            Put the pieces together
          </p>
          <h3 className="mt-2 text-h3">Drag each piece into its matching spot.</h3>
          <p className="mt-2 max-w-[58ch] text-base text-cocoa-mid">
            Drop a piece anywhere over the footprint and it will find its place,
            then check itself off the list. You can also tap any piece to place it.
          </p>
        </div>

        <div className="mt-5 shrink-0 rounded-2xl border border-cocoa/10 bg-cream/80 px-4 py-3 sm:mt-0 sm:min-w-[12rem]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-cocoa-mid">
              Progress
            </span>
            <span className="tabular font-display text-xl font-semibold text-cocoa">
              {placed.length}/{PUZZLE_PIECES.length}
            </span>
          </div>
          <div
            className="mt-2 grid grid-cols-6 gap-1.5"
            role="progressbar"
            aria-label="Puzzle progress"
            aria-valuemin={0}
            aria-valuemax={PUZZLE_PIECES.length}
            aria-valuenow={placed.length}
          >
            {PUZZLE_PIECES.map((piece) => (
              <span
                key={piece.id}
                aria-hidden="true"
                className={
                  "h-1.5 rounded-full transition-colors duration-300 " +
                  (placed.includes(piece.id) ? "bg-leaf-dark" : "bg-cocoa/15")
                }
              />
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.72fr)] lg:items-start">
        <section
          aria-label="Interactive footprint puzzle"
          className="rounded-[1.5rem] border border-cocoa/10 bg-cream/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-semibold text-cocoa">Piece tray</p>
              <p className="text-sm text-cocoa-mid">Choose one to get started.</p>
            </div>
            <span className="rounded-full border border-leaf/20 bg-leaf-light px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-leaf-dark">
              Tap or drag
            </span>
          </div>

          <div className="mt-4 grid items-stretch gap-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(11rem,0.75fr)]">
            <div>
              {tray.length > 0 ? (
                <div className="puzzle-piece-buttons grid grid-cols-3 gap-x-1 gap-y-2 sm:gap-x-2.5 sm:gap-y-3">
                  {tray.map((piece) => (
                    <PuzzleTile
                      key={piece.id}
                      id={piece.id}
                      label={piece.label}
                      region={piece.region}
                      tone={toneFor(piece.id)}
                      onPlace={() => place(piece.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="puzzle-piece-buttons grid min-h-52 place-items-center rounded-2xl border border-leaf/25 bg-leaf-light/65 p-6 text-center sm:min-h-full">
                  <div>
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-leaf-dark text-white shadow-soft">
                      <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <p className="mt-3 font-display text-lg font-semibold text-cocoa">
                      Every piece is placed.
                    </p>
                    <p className="mt-1 text-sm text-cocoa-mid">Your checklist is complete.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="puzzle-board flex min-h-[19rem] flex-col rounded-2xl border border-cocoa/10 bg-white/85 p-3 shadow-soft sm:min-h-full">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-cocoa-mid">
                  Drop zone
                </span>
                {placed.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPlaced([]);
                      placedIds.current.clear();
                      setSnappedPiece(null);
                    }}
                    className="print:hidden inline-flex min-h-8 items-center gap-1.5 rounded-full border border-cocoa/10 bg-cream px-2.5 py-1 text-xs font-bold text-cocoa transition-colors hover:border-pink/30 hover:text-pink-dark"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-cocoa-mid">Ready</span>
                )}
              </div>

              <div className="relative grid flex-1 place-items-center py-2">
                <span
                  aria-hidden="true"
                  className="absolute h-44 w-44 rounded-full bg-gradient-to-br from-pink-light via-amber-light/70 to-leaf-light opacity-70 blur-2xl"
                />
                <FootShape
                  filled={filled}
                  onPieceDropped={place}
                  snappedPiece={snappedPiece}
                  snapKey={snapKey}
                  className="relative z-10 mx-auto h-52 w-auto sm:h-64"
                />
              </div>

              <p aria-live="polite" className="text-center text-sm font-semibold text-cocoa">
                {complete
                  ? "Footprint complete!"
                  : `${placed.length} of ${PUZZLE_PIECES.length} pieces placed`}
              </p>
            </div>
          </div>
        </section>

        <aside className="flex flex-col rounded-[1.5rem] border border-cocoa/10 bg-gradient-to-b from-white to-cream p-4 shadow-soft sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-cocoa">Live checklist</p>
              <p className="text-sm text-cocoa-mid">Updates as you play.</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-light text-pink-dark">
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </span>
          </div>
          <div className="my-auto">
            <IncludedClipboard placed={effectivePlaced} />
          </div>
        </aside>
      </div>
    </div>
  );
}
