"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { FootShape } from "./FootShape";
import { PuzzleTile, type PieceTone } from "./PuzzleTile";
import { IncludedClipboard } from "./IncludedClipboard";
import { PUZZLE_PIECES, type FootRegion } from "./checklistPieces";

const ALL_PIECE_IDS = PUZZLE_PIECES.map((p) => p.id);

// Fixed default order for the server-rendered / pre-hydration paint - see the
// `useEffect` below for why this can't be `Math.random()` up front. Three
// brand tones only (pink/leaf/amber), cycling so no two adjacent pieces in
// the *default* order repeat.
const DEFAULT_TONES: PieceTone[] = ["leaf", "pink", "amber", "leaf", "pink"];

function shuffledTones(): PieceTone[] {
  const bag: PieceTone[] = ["pink", "leaf", "amber"];
  const tones = PUZZLE_PIECES.map((_, i) => bag[i % bag.length]);
  // Fisher-Yates.
  for (let i = tones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tones[i], tones[j]] = [tones[j], tones[i]];
  }
  return tones;
}

/**
 * The foot puzzle and the clipboard checklist, one interaction.
 *
 * Every piece is a real tile - its own foot-region cutout plus its label,
 * colored a random brand tone (pink, leaf, or amber) each time the page
 * loads - sitting in a tray until it is dragged or clicked onto the foot.
 * Placing it fills that region in and ticks the matching line on the
 * clipboard beside it: one action, one payoff, nothing asked for twice.
 * checklistPieces.ts is the shared map that keeps the puzzle and the sheet
 * from drifting into two different lists of "the same" five facts.
 *
 * Each region on the foot only accepts the one piece cut to fit it (see
 * FootShape.tsx) - dropped on the wrong spot, a piece's drag image simply
 * snaps back to the tray, the browser's own native behavior for a rejected
 * drop. Dragging is for a mouse or trackpad; every tile is also a real
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
 * The random tone assignment is client-only for the same reason: shuffling
 * with `Math.random()` before the first paint would render one order on the
 * server and a different one after hydration, which React reports as a
 * mismatch. `DEFAULT_TONES` is what ships in the server-rendered HTML and
 * the first client paint; the shuffle only happens after, in a `useEffect`,
 * once there is no longer a server render for it to disagree with.
 */
export function FootprintChecklist() {
  const [armed, setArmed] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [tones, setTones] = useState<PieceTone[]>(DEFAULT_TONES);
  const [snappedPiece, setSnappedPiece] = useState<string | null>(null);
  const [snapKey, setSnapKey] = useState(0);
  const placedIds = useRef(new Set<string>());

  useEffect(() => {
    setArmed(true);
    setTones(shuffledTones());
  }, []);

  const effectivePlaced = armed ? placed : ALL_PIECE_IDS;
  const complete = placed.length === PUZZLE_PIECES.length;

  const toneFor = (pieceId: string) => tones[ALL_PIECE_IDS.indexOf(pieceId)];

  // Each filled region shows *that piece's own* tray color, not a fixed
  // per-region palette - dragging the pink piece to the heel is what makes
  // the heel pink, which is the whole point of shuffling the tray colors.
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
    <div className="foot-checklist rounded-3xl border-hair border-cocoa/10 bg-white/65 p-4 shadow-soft sm:p-8">
      <div className="grid gap-6 sm:gap-9 lg:grid-cols-[1fr_0.85fr] lg:items-start">
        <div className="text-center">
          <p className="text-eyebrow font-bold uppercase text-leaf-dark">
            Put the pieces together
          </p>
          <h3 className="mt-2 text-h3">Drag each piece into its matching spot.</h3>
          <p className="mx-auto mt-3 max-w-[46ch] text-cocoa-mid">
            Every piece only fits its own outline. Get it close and it
            snaps in, then checks itself off the list below. Tap a piece if
            dragging isn&apos;t your thing.
          </p>

          {tray.length > 0 ? (
            <div className="puzzle-piece-buttons mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
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
            <p className="puzzle-piece-buttons mt-6 text-sm font-semibold text-leaf-dark">
              Every piece is placed. Nice work.
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-[11.5rem] sm:max-w-[14rem]">
          <FootShape
            filled={filled}
            onPieceDropped={place}
            snappedPiece={snappedPiece}
            snapKey={snapKey}
            className="mx-auto h-56 w-auto sm:h-80"
          />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <p className="text-center text-sm font-semibold text-cocoa">
              {complete ? "Footprint complete!" : `${placed.length} of ${PUZZLE_PIECES.length} pieces placed`}
            </p>
            {placed.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setPlaced([]);
                  placedIds.current.clear();
                  setSnappedPiece(null);
                }}
                className="print:hidden inline-flex items-center gap-1 text-sm font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 hover:text-pink-dark"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-9 border-t-hair border-cocoa/10 pt-9">
        <IncludedClipboard placed={effectivePlaced} />
      </div>
    </div>
  );
}
