"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Body, Constraint } from "matter-js";
import "./toy-pen.css";

/**
 * Rigid-body physics for the block pen, with the blocks staying real DOM nodes.
 *
 * matter-js runs headless - no canvas renderer. Every frame we read each body's
 * position and angle and write them onto the corresponding `<li>` as a
 * transform. That is the whole point of doing it this way: the blocks keep
 * their text, their icons, their place in the document and their behaviour with
 * JavaScript off, and only their position comes from the simulation.
 *
 * Positions are written as an offset from where CSS already laid the block out,
 * so the resting arrangement is a plain grid (a row on desktop, a pyramid on
 * phones) and the simulation starts with every offset at zero. Nothing jumps on
 * load, and the layout stays responsive without any of it being computed here.
 *
 * The engine is imported dynamically by the caller's `enabled` flag, so its
 * ~25KB never reaches someone who does not scroll this far.
 *
 * `recoverAfterMs` is the escape hatch for a block that has left the pen. The
 * walls are sealed, but the drag constraint is a spring, not a collision: pull
 * hard enough and a block is hauled straight through a wall, after which
 * nothing can push it back and gravity takes it away forever. When that
 * happens the block is parked, hidden, and put back at its home position after
 * the given delay, fading in via `.toy-block--lost` (globals.css). Left at 0
 * the watcher never runs, which is the old behaviour exactly.
 *
 * `calm` is the reduced-motion mode, and it is deliberately not "switch the toy
 * off". Picking a block up and moving it is direct manipulation - the same
 * category as dragging a scrollbar - and taking that away leaves a visitor
 * poking at blocks that do nothing, with no way to know why. What reduced
 * motion should remove is the part that moves on its own: gravity, so nothing
 * falls, and rotation, so nothing tumbles. Blocks still slide, still shove each
 * other, and stay where they are put.
 */

/** Hold before a touch becomes a grab. Below ~150ms it fires during scrolls. */
const HOLD_MS = 200;
/** Travel that cancels the hold: that movement is a scroll, not a grab. */
const HOLD_SLOP = 8;
/** How far a block must shift before we offer to tidy up. */
const DISTURBED_PX = 4;
const DISTURBED_RAD = 0.05;
/** Walls are thick so nothing tunnels through them on a hard fling. */
const WALL = 200;
/**
 * How far past the floor box a block's centre has to travel before it counts
 * as gone rather than as merely overlapping a wall. One cube is the right unit:
 * a block resting against a wall sits half a cube out at most, so this cannot
 * fire on contact, only on a body that is genuinely outside the room.
 */
const LOST_MARGIN = 1.2;

interface Home {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BlockPhysics {
  /** True once the engine has loaded and the bodies are live. */
  ready: boolean;
  /** True once a block has actually been shifted from where it started. */
  disturbed: boolean;
  /** Put every block back in its starting arrangement, upright and still. */
  reset: () => void;
}

export function useBlockPhysics({
  penRef,
  floorRef,
  blockRefs,
  enabled,
  calm,
  recoverAfterMs = 0,
}: {
  /** The pen. Owns the pointer events, and is the frame pointers are measured in. */
  penRef: React.RefObject<HTMLElement | null>;
  /** The arena. Its box is the four walls - see buildWalls. */
  floorRef: React.RefObject<HTMLElement | null>;
  blockRefs: React.RefObject<(HTMLLIElement | null)[]>;
  enabled: boolean;
  /** Reduced motion: no gravity and no tumbling, but still draggable. */
  calm: boolean;
  /**
   * Milliseconds before a block dragged out of the pen fades back in at home.
   * 0 disables the watcher entirely.
   */
  recoverAfterMs?: number;
}): BlockPhysics {
  const [ready, setReady] = useState(false);
  const [disturbed, setDisturbed] = useState(false);

  // The effect owns the simulation; this is how the outside reaches into it.
  const resetRef = useRef<() => void>(() => {});
  const reset = useCallback(() => resetRef.current(), []);

  useEffect(() => {
    const pen = penRef.current;
    if (!enabled || !pen) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    import("matter-js").then((mod) => {
      if (disposed) return;
      // matter-js is CommonJS: depending on the bundler the namespace lands on
      // the module object or under `default`.
      const M = ((mod as unknown as { default?: typeof mod }).default ??
        mod) as typeof mod;
      teardown = start(M);
    });

    function start(M: typeof import("matter-js")) {
      const blocks = (blockRefs.current ?? []).filter(Boolean) as HTMLLIElement[];
      if (!pen || blocks.length === 0) return;

      const engine = M.Engine.create({ enableSleeping: true });
      const world = engine.world;
      // Nothing falls in calm mode; a block goes where it is put and stops.
      if (calm) engine.gravity.y = 0;

      /* Layout position, not getBoundingClientRect: offsetLeft is unaffected by
         the transform we are about to write, so it stays truthful frame to
         frame. Walking to `pen` rather than trusting offsetParent directly
         keeps this correct if a positioned wrapper is ever added between. */
      const measure = (): Home[] =>
        blocks.map((el) => {
          let left = 0;
          let top = 0;
          let node: HTMLElement | null = el;
          while (node && node !== pen) {
            left += node.offsetLeft;
            top += node.offsetTop;
            node = node.offsetParent as HTMLElement | null;
          }
          return {
            x: left + el.offsetWidth / 2,
            y: top + el.offsetHeight / 2,
            w: el.offsetWidth,
            h: el.offsetHeight,
          };
        });

      let homes = measure();

      /* The walls come off the floor element rather than the pen, because that
         element is also what lays the blocks out: its bottom edge is exactly
         where they are already resting, so the simulation starts in contact
         with the ground instead of dropping onto it. It also keeps the inset
         that holds blocks clear of the pen rounded corners in one place, in
         CSS, rather than as a number duplicated in here. */
      const floorBox = () => {
        const f = floorRef.current;
        return {
          l: f ? f.offsetLeft : 0,
          t: f ? f.offsetTop : 0,
          w: f ? f.offsetWidth : pen!.clientWidth,
          h: f ? f.offsetHeight : pen!.clientHeight,
        };
      };

      const buildWalls = () => {
        const { l, t, w, h } = floorBox();
        const opts = { isStatic: true, friction: 0.7, restitution: 0 };
        return [
          M.Bodies.rectangle(l + w / 2, t + h + WALL / 2, w + WALL * 2, WALL, opts),
          M.Bodies.rectangle(l + w / 2, t - WALL / 2, w + WALL * 2, WALL, opts),
          M.Bodies.rectangle(l - WALL / 2, t + h / 2, WALL, h + WALL * 2, opts),
          M.Bodies.rectangle(l + w + WALL / 2, t + h / 2, WALL, h + WALL * 2, opts),
        ];
      };

      /* Painted wooden blocks, not rubber: high friction so a stack holds, and
         almost no restitution so a dropped block lands with a knock rather than
         bouncing. The chamfer matches the corner radius in the CSS, so a block
         resting on its corner tips the way it looks like it should. */
      const bodies = homes.map((h) =>
        M.Bodies.rectangle(h.x, h.y, h.w, h.h, {
          chamfer: { radius: Math.min(10, h.w * 0.08) },
          friction: 0.6,
          frictionStatic: 1,
          // Calm mode has no gravity to settle a block, so drag does it instead:
          // let go and it coasts to a stop rather than gliding on forever.
          frictionAir: calm ? 0.22 : 0.012,
          restitution: calm ? 0 : 0.06,
          density: 0.0012,
        }),
      );

      // Infinite inertia is matter's way of saying "this cannot spin".
      if (calm) bodies.forEach((b) => M.Body.setInertia(b, Infinity));

      let walls = buildWalls();
      M.Composite.add(world, [...walls, ...bodies]);

      const sync = () => {
        for (let i = 0; i < bodies.length; i++) {
          /* A parked block is invisible, but its transform still counts toward
             the document's scrollable area - a body sitting 900px off to the
             right of a phone-width page is a horizontal scrollbar nobody can
             see the cause of. Leave its node at home instead; only the body is
             out there, and the body is not in the DOM. */
          if (lostTimers[i]) {
            blocks[i].style.transform = "";
            continue;
          }
          const b = bodies[i];
          const h = homes[i];
          blocks[i].style.transform =
            `translate3d(${(b.position.x - h.x).toFixed(2)}px, ${(b.position.y - h.y).toFixed(2)}px, 0)` +
            ` rotate(${b.angle.toFixed(4)}rad)`;
        }
      };

      let announced = false;

      /* After a rescue the pen may be tidy again, and the one-way latch above
         would leave the "put them back" prompt showing over an untouched pen.
         This is the only path that clears it. */
      const settleDisturbed = () => {
        const moved = bodies.some((b, i) => {
          const h = homes[i];
          return (
            Math.abs(b.position.x - h.x) > DISTURBED_PX ||
            Math.abs(b.position.y - h.y) > DISTURBED_PX ||
            Math.abs(b.angle) > DISTURBED_RAD
          );
        });
        announced = moved;
        setDisturbed(moved);
      };

      const checkDisturbed = () => {
        if (announced) return;
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          const h = homes[i];
          if (
            Math.abs(b.position.x - h.x) > DISTURBED_PX ||
            Math.abs(b.position.y - h.y) > DISTURBED_PX ||
            Math.abs(b.angle) > DISTURBED_RAD
          ) {
            announced = true;
            setDisturbed(true);
            return;
          }
        }
      };

      /* ------------------------------------------------------------ rescue

         A block only ever leaves the pen one way: the drag constraint is a
         spring, so hauling a block hard into a wall stretches it straight
         through. Once out, the sealed room is behind it and gravity carries it
         off with nothing to collide with - it is simply gone.

         The fix is not to stiffen the constraint (that makes the toy feel
         glassy) or to teleport the block back mid-drag (that fights the hand
         holding it). It is to notice the block has gone, park it where it
         stops costing frames, and quietly put it back. */
      const lostTimers: number[] = [];

      /** Park a body that has left the room, and schedule its return. */
      const lose = (i: number) => {
        if (lostTimers[i]) return;
        const b = bodies[i];
        M.Body.setVelocity(b, { x: 0, y: 0 });
        M.Body.setAngularVelocity(b, 0);
        /* Static, not asleep. `Sleeping.set` does not hold a body that is in
           open air with nothing to rest on - measured, it kept accelerating
           downward for the whole delay and the rAF loop never got to idle.
           Static is absolute, and the step loop below counts it as parked. */
        M.Body.setStatic(b, true);
        blocks[i].classList.add("toy-block--lost");

        lostTimers[i] = window.setTimeout(() => {
          lostTimers[i] = 0;
          const h = homes[i];
          // Back to a real body first: setPosition on a static body leaves the
          // mass and inertia it was stripped of when it was parked.
          M.Body.setStatic(b, false);
          M.Body.setPosition(b, { x: h.x, y: h.y });
          M.Body.setAngle(b, 0);
          M.Body.setVelocity(b, { x: 0, y: 0 });
          M.Body.setAngularVelocity(b, 0);
          M.Sleeping.set(b, false);
          // Move it home while it is still invisible, paint that frame, and
          // only then let the opacity transition run - otherwise the browser
          // coalesces both and the block is seen flying back to its place.
          sync();
          requestAnimationFrame(() => blocks[i]?.classList.remove("toy-block--lost"));
          settleDisturbed();
          kick();
        }, recoverAfterMs);
      };

      /** Has this body's centre left the room by more than a cube? */
      const isLost = (i: number) => {
        const { l, t, w, h } = floorBox();
        const m = Math.max(homes[i].w, homes[i].h) * LOST_MARGIN;
        const p = bodies[i].position;
        return p.x < l - m || p.x > l + w + m || p.y < t - m || p.y > t + h + m;
      };

      const watchLost = () => {
        if (!recoverAfterMs) return;
        for (let i = 0; i < bodies.length; i++) {
          if (!lostTimers[i] && isLost(i)) lose(i);
        }
      };

      /* The loop stops the moment every block is asleep and nothing is being
         held. A marketing page has no business holding a rAF open for a toy
         nobody is playing with; `kick` restarts it whenever that changes. */
      let raf = 0;
      let running = false;
      let dragBody: Body | null = null;

      const step = () => {
        M.Engine.update(engine, 1000 / 60);
        sync();
        checkDisturbed();
        watchLost();
        if (!dragBody && bodies.every((b) => b.isSleeping || b.isStatic)) {
          running = false;
          raf = 0;
          return;
        }
        raf = requestAnimationFrame(step);
      };

      const kick = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(step);
      };

      // ---------------------------------------------------------------- drag
      let dragConstraint: Constraint | null = null;
      let holdTimer = 0;
      let holdOrigin: { x: number; y: number } | null = null;
      let heldPointer = -1;

      const worldPoint = (e: PointerEvent) => {
        const r = pen!.getBoundingClientRect();
        return { x: e.clientX - r.left - pen!.clientLeft, y: e.clientY - r.top - pen!.clientTop };
      };

      const grab = (p: { x: number; y: number }, pointerId: number) => {
        const hit = M.Query.point(bodies, p)[0];
        if (!hit) return;
        // A body waiting to be rescued is parked out of the room and invisible.
        // Query.point can still find it; the hand must not.
        if (lostTimers[bodies.indexOf(hit)]) return;
        dragBody = hit;
        M.Sleeping.set(hit, false);

        /* pointB is in the body's own frame, so the world offset has to be
           rotated back by the body's angle - otherwise a block picked up while
           lying on its side swings from the wrong corner. */
        const dx = p.x - hit.position.x;
        const dy = p.y - hit.position.y;
        const cos = Math.cos(-hit.angle);
        const sin = Math.sin(-hit.angle);

        dragConstraint = M.Constraint.create({
          pointA: { x: p.x, y: p.y },
          bodyB: hit,
          pointB: { x: dx * cos - dy * sin, y: dx * sin + dy * cos },
          stiffness: 0.14,
          damping: 0.12,
          length: 0,
        });
        M.Composite.add(world, dragConstraint);
        pen!.classList.add("toy-pen--holding");
        blocks[bodies.indexOf(hit)]?.classList.add("toy-block--held");
        try {
          pen!.setPointerCapture(pointerId);
          heldPointer = pointerId;
        } catch {
          heldPointer = -1;
        }
        kick();
      };

      const cancelHold = () => {
        if (holdTimer) window.clearTimeout(holdTimer);
        holdTimer = 0;
        holdOrigin = null;
      };

      const release = () => {
        cancelHold();
        if (dragConstraint) {
          M.Composite.remove(world, dragConstraint);
          dragConstraint = null;
        }
        dragBody = null;
        pen!.classList.remove("toy-pen--holding");
        blocks.forEach((el) => el.classList.remove("toy-block--held"));
        pen!.style.touchAction = "";
        if (heldPointer >= 0) {
          try {
            pen!.releasePointerCapture(heldPointer);
          } catch {
            /* already gone */
          }
          heldPointer = -1;
        }
        kick();
      };

      const onPointerDown = (e: PointerEvent) => {
        if (e.button > 0) return;
        const p = worldPoint(e);
        // Empty rug: leave the event alone so the page still scrolls. A parked
        // body counts as empty rug - it is not on screen to be aimed at.
        const under = M.Query.point(bodies, p)[0];
        if (!under || lostTimers[bodies.indexOf(under)]) return;

        if (e.pointerType === "mouse") {
          grab(p, e.pointerId);
          return;
        }

        /* Touch and pen grab on a hold, so a flick over a block still scrolls
           the page. Cancelling on movement makes the two gestures mutually
           exclusive, which is how a phone home screen already behaves. */
        holdOrigin = { x: e.clientX, y: e.clientY };
        holdTimer = window.setTimeout(() => {
          holdTimer = 0;
          holdOrigin = null;
          pen!.style.touchAction = "none";
          if (typeof navigator.vibrate === "function") navigator.vibrate(8);
          grab(p, e.pointerId);
        }, HOLD_MS);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (holdOrigin) {
          if (Math.hypot(e.clientX - holdOrigin.x, e.clientY - holdOrigin.y) > HOLD_SLOP) {
            cancelHold();
          }
          return;
        }
        if (!dragConstraint) return;
        const p = worldPoint(e);
        dragConstraint.pointA.x = p.x;
        dragConstraint.pointA.y = p.y;
        kick();
      };

      /* Browsers latch touch-action when a gesture starts, so flipping it to
         `none` mid-hold is not reliable everywhere. This is the belt to that
         braces: once a block is in hand the page cannot scroll under it. */
      const onTouchMove = (e: TouchEvent) => {
        if (dragBody) e.preventDefault();
      };

      pen.addEventListener("pointerdown", onPointerDown);
      pen.addEventListener("pointermove", onPointerMove);
      pen.addEventListener("pointerup", release);
      pen.addEventListener("pointercancel", release);
      pen.addEventListener("touchmove", onTouchMove, { passive: false });

      // --------------------------------------------------------------- reset
      const doReset = () => {
        homes = measure();
        /* A manual tidy-up outranks a pending rescue: cancel the timers and
           show every block again, or a rescue would fire later and re-fade a
           block that is already home. */
        lostTimers.forEach((id, i) => {
          if (id) window.clearTimeout(id);
          lostTimers[i] = 0;
          if (bodies[i].isStatic) M.Body.setStatic(bodies[i], false);
          blocks[i]?.classList.remove("toy-block--lost");
        });
        bodies.forEach((b, i) => {
          M.Body.setPosition(b, { x: homes[i].x, y: homes[i].y });
          M.Body.setAngle(b, 0);
          M.Body.setVelocity(b, { x: 0, y: 0 });
          M.Body.setAngularVelocity(b, 0);
        });

        /* Asleep at home, rather than awake and left to the solver. The two
           blocks are laid out touching, so at their exact home positions they
           overlap by a pixel or two; wake them here and the solver spends the
           next second shoving them apart - measured, that ended anywhere from
           1px off to one block tilted on top of the other. Either way the pen
           does not look tidied and `disturbed` latches straight back on, so
           the button you just pressed never goes away.

           Nothing is lost by sleeping: `grab` wakes whatever is picked up, and
           matter wakes a sleeping body as soon as an awake one touches it. */
        bodies.forEach((b) => M.Sleeping.set(b, true));
        announced = false;
        setDisturbed(false);
        sync();
        // Deliberately no `kick`: everything is asleep and at home, and a step
        // here would be the solver getting its hands on the overlap again.
      };
      resetRef.current = doReset;

      /* Width-only, because phones fire resize every time the URL bar collapses
         and re-tidying the rug mid-play would be baffling. A real width change
         moves every home position and can resize the blocks themselves, so the
         bodies are rescaled and everything goes back to its starting place. */
      let lastWidth = window.innerWidth;
      let resizeTimer = 0;
      const onResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          release();
          M.Composite.remove(world, walls);
          walls = buildWalls();
          M.Composite.add(world, walls);

          const next = measure();
          bodies.forEach((b, i) => {
            if (Math.abs(next[i].w - homes[i].w) > 0.5) {
              M.Body.scale(b, next[i].w / homes[i].w, next[i].h / homes[i].h);
            }
          });
          homes = next;
          doReset();
        }, 150);
      };
      window.addEventListener("resize", onResize);

      sync();
      kick();
      setReady(true);

      return () => {
        cancelAnimationFrame(raf);
        cancelHold();
        lostTimers.forEach((id) => id && window.clearTimeout(id));
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        pen!.removeEventListener("pointerdown", onPointerDown);
        pen!.removeEventListener("pointermove", onPointerMove);
        pen!.removeEventListener("pointerup", release);
        pen!.removeEventListener("pointercancel", release);
        pen!.removeEventListener("touchmove", onTouchMove);
        M.Composite.clear(world, false);
        M.Engine.clear(engine);
        blocks.forEach((el) => {
          el.style.transform = "";
          el.classList.remove("toy-block--held", "toy-block--lost");
        });
        resetRef.current = () => {};
      };
    }

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [enabled, calm, recoverAfterMs, penRef, floorRef, blockRefs]);

  return { ready, disturbed, reset };
}
