"use client";

import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { FootShape } from "./FootShape";
import { PuzzleTile, RegionCutout, type PieceTone } from "./PuzzleTile";
import { IncludedClipboard } from "./IncludedClipboard";
import { PIECE_TONE_BY_ID } from "./pieceTones";
import { PUZZLE_PIECES, type FootRegion } from "./checklistPieces";

const ALL_PIECE_IDS = PUZZLE_PIECES.map((p) => p.id);

interface DragState {
  id: string;
  tone: PieceTone;
  region: FootRegion;
  x: number;
  y: number;
  overBoard: boolean;
}

/**
 * The foot puzzle and the clipboard checklist, one interaction.
 *
 * Every piece is its own foot-region cutout plus its label, using a fixed,
 * balanced brand palette and sitting in an open tray until it is dragged or
 * tapped onto the foot.
 * Placing it fills that region in and ticks the matching line on the
 * clipboard beside it: one action, one payoff, nothing asked for twice.
 * checklistPieces.ts is the shared map that keeps the puzzle and the sheet
 * from drifting into two different lists of "the same" six facts.
 *
 * Dragging is one hand-rolled Pointer Events implementation (see
 * PuzzleTile.tsx), the same for a mouse, a finger, or a pen - not a desktop
 * drag feature with a tap fallback bolted on for touch. This component owns
 * the drag itself: it tracks the live pointer position, renders the floating
 * piece that follows it, and - on release - checks whether that point falls
 * within the foot's own bounding box (via `boardRef`) to decide whether the
 * piece lands. Every tile is still also a real `<button>`, so a tap or an
 * Enter/Space press places it directly, in its correct spot, without needing
 * to be dragged anywhere at all.
 *
 * `armed` is the same trick the old scroll-triggered clipboard used, moved
 * here: the puzzle needs JavaScript to play, so the *default* state - before
 * React has mounted, and forever for a no-JS visitor - is "complete." A
 * visitor who can actually play it watches the checklist reset to blank and
 * fill back in as they place each piece; everyone else, and print (see the
 * `.foot-checklist` rules in globals.css), simply sees the finished facts.
 * Content is never gated behind an interaction that might not be available.
 *
 * The palette (pieceTones.ts) is deterministic on the server and client, so
 * the six-piece arrangement never changes color during hydration or between
 * visits.
 */
export function FootprintChecklist() {
  const [armed, setArmed] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [snappedPiece, setSnappedPiece] = useState<string | null>(null);
  const [snapKey, setSnapKey] = useState(0);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const placedIds = useRef(new Set<string>());
  const boardRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setArmed(true);
  }, []);

  const effectivePlaced = armed ? placed : ALL_PIECE_IDS;
  const complete = placed.length === PUZZLE_PIECES.length;

  const toneFor = (pieceId: string) => PIECE_TONE_BY_ID[pieceId] ?? "pink";

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

  function pointOverBoard(x: number, y: number) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function handleDragStart(id: string, tone: PieceTone, region: FootRegion, x: number, y: number) {
    setDragging({ id, tone, region, x, y, overBoard: pointOverBoard(x, y) });
  }

  function handleDragMove(x: number, y: number) {
    setDragging((current) => (current ? { ...current, x, y, overBoard: pointOverBoard(x, y) } : current));
  }

  function handleDragEnd(x: number, y: number) {
    const wasOverBoard = pointOverBoard(x, y);
    const id = dragging?.id;
    setDragging(null);
    if (id && wasOverBoard) place(id);
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

      {dragging ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[65%] drop-shadow-2xl transition-transform"
          style={{ left: dragging.x, top: dragging.y }}
        >
          <RegionCutout
            region={dragging.region}
            tone={dragging.tone}
            className={dragging.overBoard ? "scale-125" : "scale-110"}
            style={{ height: "clamp(3.4rem, 16vw, 4.4rem)", width: "auto", transition: "transform 150ms" }}
          />
        </div>
      ) : null}

      <header className="relative z-10 rounded-[1.5rem] border border-cocoa/10 bg-gradient-to-br from-white via-white to-cream px-5 py-5 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-7 sm:px-7 sm:py-6">
        <div className="max-w-[42rem]">
          <p className="text-eyebrow font-bold uppercase text-leaf-dark">
            Put the pieces together
          </p>
          <h3 className="mt-2 text-h3">Tap a piece, or drag it onto the footprint.</h3>
          <p className="mt-2 max-w-[58ch] text-base text-cocoa-mid">
            Each piece has its own spot. Touch and hold a piece to drag it, or
            just tap it to send it straight to the right place - either way it
            checks itself off the list.
          </p>
        </div>

        <div className="mt-5 shrink-0 rounded-2xl border border-cocoa/10 bg-cream/80 px-4 py-3 sm:mt-0 sm:min-w-[12rem]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.12em] text-cocoa-mid">
              Progress
            </span>
            <span className="tabular font-display text-2xl font-semibold text-cocoa">
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
                  "h-2 rounded-full transition-colors duration-300 " +
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
              <p className="font-display text-xl font-semibold text-cocoa">Piece tray</p>
              <p className="text-sm text-cocoa-mid">Choose one to get started.</p>
            </div>
            <span className="rounded-full border border-leaf/20 bg-leaf-light px-3 py-1.5 text-sm font-bold uppercase tracking-[0.06em] text-leaf-dark">
              Tap or drag
            </span>
          </div>

          <div className="mt-4 grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(11rem,0.75fr)]">
            <div>
              {tray.length > 0 ? (
                <div className="puzzle-piece-buttons grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
                  {tray.map((piece) => (
                    <PuzzleTile
                      key={piece.id}
                      id={piece.id}
                      label={piece.label}
                      region={piece.region}
                      tone={toneFor(piece.id)}
                      dragging={dragging?.id === piece.id}
                      onPlace={() => place(piece.id)}
                      onDragStart={handleDragStart}
                      onDragMove={handleDragMove}
                      onDragEnd={handleDragEnd}
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

            <div className="puzzle-board flex min-h-[21rem] flex-col rounded-2xl border border-cocoa/10 bg-white/85 p-3 shadow-soft sm:min-h-full">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.12em] text-cocoa-mid">
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
                    className="print:hidden inline-flex min-h-9 items-center gap-1.5 rounded-full border border-cocoa/10 bg-cream px-3 py-1.5 text-sm font-bold text-cocoa transition-colors hover:border-pink/30 hover:text-pink-dark"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
                  </button>
                ) : (
                  <span className="text-sm font-semibold text-cocoa-mid">Ready</span>
                )}
              </div>

              <div className="relative grid flex-1 place-items-center py-3">
                <span
                  aria-hidden="true"
                  className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-pink-light via-amber-light/70 to-leaf-light opacity-70 blur-2xl"
                />
                <FootShape
                  ref={boardRef}
                  filled={filled}
                  dropActive={dragging?.overBoard ?? false}
                  snappedPiece={snappedPiece}
                  snapKey={snapKey}
                  className="relative z-10 mx-auto h-60 w-auto sm:h-64"
                />
              </div>

              <p aria-live="polite" className="text-center text-base font-semibold text-cocoa">
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
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300",
                complete ? "bg-leaf-dark text-white" : "bg-pink-light text-pink-dark",
              )}
            >
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
