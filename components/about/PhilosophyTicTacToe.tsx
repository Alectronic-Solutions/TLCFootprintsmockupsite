"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Footprint } from "@/components/brand/Footprints";

/**
 * A card-sized game of tic-tac-toe, played with footprints.
 *
 * Sibling to PhilosophyBlocks: where that card's sentence is about stacking
 * and toppling and gets a physics pen, this card's sentence is about a child
 * being given room to follow something through, and gets the one game every
 * kid learns to play. The visitor is the pink pair; the house answers in
 * leaf, on its own, a beat later - no "your move" button to press, no score
 * to keep. A finished board clears itself after a moment so the card is
 * never left sitting on a dead game.
 *
 * Unlike the blocks pen this is NOT aria-hidden. The pen is drag-only
 * decoration that repeats what the card already says; this is nine real
 * buttons a keyboard user can operate, so every square is labelled by its
 * position and its contents, and the running commentary is announced from a
 * polite live region.
 *
 * Motion is limited to the mark's entrance and the win highlight, both of
 * which the prefers-reduced-motion kill-switch at the top of globals.css
 * already switches off; the house's own reply is a timer, not an animation,
 * so it still plays under reduced motion.
 */

type Mark = "child" | "house";
type Cell = Mark | null;

/** Every straight line of three, as board indices. */
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const EMPTY: Cell[] = Array(9).fill(null);

/** Row/column wording for the square labels, so "cell 6" is never spoken. */
const ROWS = ["top", "middle", "bottom"] as const;
const COLUMNS = ["left", "centre", "right"] as const;

/** The house thinks for about this long before answering. */
const REPLY_MS = 620;
/** How long a finished board stays up before it clears itself. */
const CLEAR_MS = 2200;

function winningLine(board: Cell[], mark: Mark): readonly number[] | null {
  return LINES.find((line) => line.every((i) => board[i] === mark)) ?? null;
}

function openSquares(board: Cell[]): number[] {
  return board.reduce<number[]>((acc, cell, i) => (cell === null ? [...acc, i] : acc), []);
}

/** The square that completes a line for `mark`, if there is one. */
function completing(board: Cell[], mark: Mark): number | null {
  for (const line of LINES) {
    const own = line.filter((i) => board[i] === mark).length;
    const open = line.filter((i) => board[i] === null);
    if (own === 2 && open.length === 1) return open[0];
  }
  return null;
}

/**
 * The house's move: take the win, otherwise block one, otherwise the centre,
 * otherwise a corner, otherwise anything left.
 *
 * Deliberately not the unbeatable minimax. A board no visitor can ever win is
 * a board nobody plays twice, and this one sits inside a card about leaving
 * room for someone else - a fork beats it, which is exactly the opening a
 * child finds first.
 */
function houseMove(board: Cell[]): number | null {
  const open = openSquares(board);
  if (open.length === 0) return null;

  const win = completing(board, "house");
  if (win !== null) return win;

  const block = completing(board, "child");
  if (block !== null) return block;

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  const pool = corners.length > 0 ? corners : open;
  return pool[Math.floor(Math.random() * pool.length)];
}

function squareLabel(index: number, cell: Cell): string {
  const where = `${ROWS[Math.floor(index / 3)]} ${COLUMNS[index % 3]}`;
  if (cell === "child") return `${where}, yours`;
  if (cell === "house") return `${where}, taken`;
  return `${where}, empty`;
}

export function PhilosophyTicTacToe({ className }: { className?: string }) {
  const [board, setBoard] = useState<Cell[]>(EMPTY);
  /** True while the house's reply is pending, which is also when the board is locked. */
  const [thinking, setThinking] = useState(false);
  const [line, setLine] = useState<readonly number[] | null>(null);
  const [status, setStatus] = useState("Your turn. Pick a square.");

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Every timer this component starts is tracked so unmount cancels it. */
  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    [],
  );

  const reset = useCallback(() => {
    setBoard(EMPTY);
    setLine(null);
    setThinking(false);
    setStatus("Your turn. Pick a square.");
  }, []);

  /**
   * Settle a board: announce the result, hold it, then clear. Returns whether
   * the game is over, so the caller knows not to keep playing into it.
   */
  const settle = useCallback(
    (next: Cell[], justMoved: Mark) => {
      const won = winningLine(next, justMoved);
      if (won) {
        setLine(won);
        setStatus(justMoved === "child" ? "Three in a row. You win." : "Three in a row for me.");
        later(reset, CLEAR_MS);
        return true;
      }
      if (openSquares(next).length === 0) {
        setStatus("All nine taken. A tie.");
        later(reset, CLEAR_MS);
        return true;
      }
      return false;
    },
    [later, reset],
  );

  function play(index: number) {
    if (thinking || line || board[index] !== null) return;

    const afterChild = board.slice();
    afterChild[index] = "child";
    setBoard(afterChild);

    if (settle(afterChild, "child")) return;

    setThinking(true);
    setStatus("My turn.");
    later(() => {
      const pick = houseMove(afterChild);
      if (pick === null) return;
      const afterHouse = afterChild.slice();
      afterHouse[pick] = "house";
      setBoard(afterHouse);
      setThinking(false);
      if (!settle(afterHouse, "house")) setStatus("Your turn.");
    }, REPLY_MS);
  }

  return (
    <div className={`tictac ${className ?? ""}`}>
      <div className="tictac-board" role="group" aria-label="Tic-tac-toe. You play first.">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            className={`tictac-cell${line?.includes(i) ? " tictac-cell--win" : ""}`}
            onClick={() => play(i)}
            disabled={cell !== null || thinking || line !== null}
            aria-label={squareLabel(i, cell)}
          >
            {cell ? (
              <Footprint
                className={`tictac-mark ${cell === "child" ? "fill-pink" : "fill-leaf"}`}
                left={i % 2 === 1}
              />
            ) : null}
          </button>
        ))}
      </div>
      <p className="tictac-status" role="status">
        {status}
      </p>
    </div>
  );
}
