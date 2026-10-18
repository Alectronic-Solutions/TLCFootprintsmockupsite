"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Shared page-turning for the site's two books (the What to Expect book and
 * the resource reader).
 *
 * A turn is one number, `progress`, from 0 (leaf flat on its starting side)
 * to 1 (landed on the other side). A button or arrow key animates it; a drag
 * sets it straight from the pointer, so the page follows the hand and can be
 * let go of anywhere. Released past halfway (or flicked), it finishes;
 * otherwise it falls back and nothing changes.
 *
 * Side-by-side spreads only exist from the caller's `wide` breakpoint up.
 * Below it the pages stack, a half-page turn means nothing, and a swipe or a
 * button just moves to the next page (the caller slides it in using `enter`).
 */

export type FlipTurn = { from: number; to: number; dir: 1 | -1; seq: number };

const DURATION = 0.8;
const TURN_EASE = [0.645, 0.045, 0.355, 1] as const;
/** Pixels of sideways travel before a press becomes a drag (not a click). */
const DRAG_START = 6;
/** Below the wide breakpoint, how far a swipe must go to count. */
const SWIPE_DISTANCE = 50;
/** px per ms. A flick this fast finishes the turn even if short of halfway. */
const FLICK_VELOCITY = 0.45;

type Drag = {
  id: number;
  x0: number;
  y0: number;
  spine: number;
  half: number;
  started: boolean;
  dir: 1 | -1;
  turn: FlipTurn | null;
  samples: Array<{ x: number; t: number }>;
  el: HTMLElement;
};

export function useBookFlip({
  count,
  wide,
  reduce,
  onStackedTurn,
}: {
  count: number;
  /** True when spreads sit side by side and half-page turns apply. */
  wide: boolean;
  reduce: boolean;
  /** Called after a page change in the stacked layout (e.g. to scroll up). */
  onStackedTurn?: () => void;
}) {
  /** The page asked for. Controls follow this at once. */
  const [active, setActive] = useState(0);
  /** The page the base layer shows. Catches up when a turn lands. */
  const [shown, setShown] = useState(0);
  const [turning, setTurning] = useState<FlipTurn | null>(null);
  /** Drives the stacked slide-in. A new `n` remounts the incoming page. */
  const [enter, setEnter] = useState({ dir: 1 as 1 | -1, n: 0 });
  const progress = useMotionValue(0);

  const target = useRef(0);
  const busy = useRef(false);
  const queued = useRef<number | null>(null);
  const seq = useRef(0);
  const current = useRef<FlipTurn | null>(null);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);

  const opts = useRef({ count, wide, reduce, onStackedTurn });
  useEffect(() => {
    opts.current = { count, wide, reduce, onStackedTurn };
  });

  const goToRef = useRef<(to: number) => void>(() => {});

  const land = useCallback(
    (turn: FlipTurn) => {
      if (current.current?.seq !== turn.seq) return;
      current.current = null;
      busy.current = false;
      setShown(turn.to);
      setTurning(null);
      progress.set(0);
      const next = queued.current;
      queued.current = null;
      if (next !== null && next !== turn.to) goToRef.current(next);
    },
    [progress],
  );

  const fallBack = useCallback(
    (turn: FlipTurn) => {
      if (current.current?.seq !== turn.seq) return;
      current.current = null;
      busy.current = false;
      target.current = turn.from;
      setTurning(null);
      progress.set(0);
      queued.current = null;
    },
    [progress],
  );

  const begin = useCallback(
    (from: number, to: number) => {
      const turn: FlipTurn = { from, to, dir: to > from ? 1 : -1, seq: ++seq.current };
      busy.current = true;
      current.current = turn;
      target.current = to;
      progress.set(0);
      setTurning(turn);
      return turn;
    },
    [progress],
  );

  const goTo = useCallback(
    (requested: number) => {
      const { count: n, wide: w, reduce: r } = opts.current;
      const to = Math.min(n - 1, Math.max(0, requested));
      // A request mid-turn is remembered rather than dropped: the book
      // finishes the current turn, then heads for the last page asked for.
      if (busy.current) {
        queued.current = to;
        return;
      }
      const from = target.current;
      if (to === from) return;
      setActive(to);

      if (r || !w) {
        target.current = to;
        setShown(to);
        setEnter((e) => ({ dir: to > from ? 1 : -1, n: e.n + 1 }));
        opts.current.onStackedTurn?.();
        return;
      }

      const turn = begin(from, to);
      animate(progress, 1, { duration: DURATION, ease: TURN_EASE }).then(() => land(turn));
    },
    [begin, land, progress],
  );

  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  const step = useCallback(
    (delta: number) => goTo((busy.current && queued.current !== null ? queued.current : target.current) + delta),
    [goTo],
  );

  /** Back to page one with nothing in flight (e.g. a different book opened). */
  const reset = useCallback(() => {
    current.current = null;
    busy.current = false;
    queued.current = null;
    drag.current = null;
    target.current = 0;
    progress.stop();
    progress.set(0);
    setActive(0);
    setShown(0);
    setTurning(null);
  }, [progress]);

  function onPointerDown(e: React.PointerEvent<HTMLElement>) {
    suppressClick.current = false;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (busy.current) return;
    // Links and buttons on a page keep working as links and buttons.
    if ((e.target as HTMLElement).closest("a, button, select, input, textarea, label")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      spine: rect.left + rect.width / 2,
      half: rect.width / 2,
      started: false,
      dir: 1,
      turn: null,
      samples: [{ x: e.clientX, t: e.timeStamp }],
      el: e.currentTarget,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();

    if (!d.started) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null; // a scroll, not a turn
        return;
      }
      if (Math.abs(dx) < DRAG_START) return;

      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      const to = target.current + dir;
      if (to < 0 || to > opts.current.count - 1) return; // no page that way

      d.started = true;
      d.dir = dir;
      suppressClick.current = true;
      try {
        d.el.setPointerCapture(e.pointerId);
      } catch {
        // The pointer may already be gone; the drag still works without it.
      }
      if (opts.current.wide && !opts.current.reduce) d.turn = begin(target.current, to);
    }

    if (d.turn) {
      // The page edge tracks the hand. Grabbing near the outer edge means a
      // long pull to the far side; grabbing near the spine, a short one.
      const grab = Math.abs(d.x0 - d.spine);
      const span = Math.max(grab * 2, d.half * 0.6);
      progress.set(Math.min(1, Math.max(0, (-d.dir * dx) / span)));
    }
  }

  function velocity(d: Drag) {
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const dt = last.t - first.t;
    return dt > 0 ? (last.x - first.x) / dt : 0;
  }

  function onPointerUp(e: React.PointerEvent<HTMLElement>, cancelled = false) {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    if (!d.started) return;

    const v = velocity(d) * -d.dir; // positive = moving the way the page turns

    if (d.turn) {
      const turn = d.turn;
      const p = progress.get();
      const finish = !cancelled && (p > 0.5 || (v > FLICK_VELOCITY && p > 0.04));
      if (finish) {
        setActive(turn.to);
        animate(progress, 1, { duration: Math.max(0.18, DURATION * 0.7 * (1 - p)), ease: "easeOut" }).then(() =>
          land(turn),
        );
      } else {
        animate(progress, 0, { duration: Math.max(0.16, DURATION * 0.6 * p), ease: "easeOut" }).then(() =>
          fallBack(turn),
        );
      }
      return;
    }

    // Stacked layout: a plain swipe.
    const dx = e.clientX - d.x0;
    if (!cancelled && (Math.abs(dx) > SWIPE_DISTANCE || v > FLICK_VELOCITY)) goTo(target.current + d.dir);
  }

  /** Swallow the click that ends a drag, so a drag never also clicks. */
  function onClickCapture(e: React.MouseEvent) {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  }

  return {
    active,
    shown,
    turning,
    progress,
    enter,
    goTo,
    step,
    reset,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (e: React.PointerEvent<HTMLElement>) => onPointerUp(e),
      onPointerCancel: (e: React.PointerEvent<HTMLElement>) => onPointerUp(e, true),
      onClickCapture,
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
  };
}

/**
 * The turning leaf, laid over a book for the length of a turn.
 *
 * Forward: the static layer shows the current left page and the next right
 * page; the leaf sits over the right half showing the current right page,
 * hinges at the spine, and lands on the left showing the next left page.
 * Backward mirrors it. When the leaf lands, the static layer already matches
 * the destination spread, so swapping to the base layer is invisible.
 *
 * `className` positions it over the book's paper. It should sit outside any
 * clipping frame so the lifting leaf is never cut off.
 */
export function FlipOverlay({
  turn,
  progress,
  className,
  radius,
  staticLeft,
  staticRight,
  front,
  back,
}: {
  turn: FlipTurn;
  progress: MotionValue<number>;
  className?: string;
  radius: string;
  staticLeft: ReactNode;
  staticRight: ReactNode;
  front: ReactNode;
  back: ReactNode;
}) {
  const forward = turn.dir === 1;
  const rotateY = useTransform(progress, (p) => p * (forward ? -180 : 180));
  const castShadow = useTransform(progress, [0, 0.5, 1], [0, 0.55, 0]);
  const frontShade = useTransform(progress, [0, 0.5, 1], [0, 0.5, 0.5]);
  const backShade = useTransform(progress, [0, 0.5, 1], [0.5, 0.5, 0]);

  return (
    <div aria-hidden="true" className={cn("flip-overlay no-print", className)} style={{ perspective: 2600 }}>
      <div className="absolute inset-0 isolate grid grid-cols-2 overflow-hidden" style={{ borderRadius: radius }}>
        <div className="relative">
          {staticLeft}
          <motion.div className="flip-shade flip-shade-to-right" style={{ opacity: castShadow }} />
        </div>
        <div className="relative">
          {staticRight}
          <motion.div className="flip-shade flip-shade-to-left" style={{ opacity: castShadow }} />
        </div>
      </div>

      <motion.div
        className={cn("absolute inset-y-0 z-10 w-1/2", forward ? "left-1/2" : "left-0")}
        style={{ rotateY, transformStyle: "preserve-3d", transformOrigin: forward ? "left center" : "right center" }}
      >
        <div className="flip-face">
          {front}
          <motion.div className="flip-shade flip-shade-flat" style={{ opacity: frontShade }} />
        </div>
        <div className="flip-face" style={{ transform: "rotateY(180deg)" }}>
          {back}
          <motion.div className="flip-shade flip-shade-flat" style={{ opacity: backShade }} />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * A dog-eared corner that lifts when the book is hovered, hinting that the
 * page can be grabbed. Rendered only where there is a page to turn to.
 */
export function FlipCorner({ side, className }: { side: "left" | "right"; className?: string }) {
  return <span aria-hidden="true" className={cn("flip-corner no-print", `flip-corner-${side}`, className)} />;
}
