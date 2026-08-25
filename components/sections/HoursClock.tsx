"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * The open day, drawn as one clock: the hands tick from 7:30 round to 6:00 on
 * a loop, laying down a green arc as they go, and the wedge they never cover
 * is the part of the evening the house is closed.
 *
 * This replaced an eight-step "daily rhythm" dial. That version was prettier
 * and every time on it was invented - LaTrell's brief gives her open hours and
 * her meals, and no schedule whatsoever. So the dial shows the two times she
 * actually gave, and the arc between them carries the idea the schedule was
 * reaching for: the day here has a shape, and it is a long one.
 *
 * The geometry is honest by construction. 7:30 sits at 225 degrees and 6:00 at
 * 180 on a twelve-hour face, which puts the 45-degree closed wedge at the
 * lower left and makes the open stretch 315 degrees of the dial.
 *
 * The two times are named in a legend below the dial rather than in labels
 * around its rim. Rim labels looked better and cost about eleven rem of clearance
 * on every side, which a half-column layout does not have; the
 * legend also means one rendering instead of a desktop dial plus a separate
 * phone list, so nothing is in the DOM twice.
 */

const CENTER = 200;
const DIAL_R = 156;

/** Minutes past twelve on a twelve-hour face, from a 24-hour "HH:MM". */
function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return (h % 12) * 60 + m;
}

/**
 * Rounded on purpose. Math.cos and Math.sin are allowed to differ in their
 * last bit between engines, and they do: Node rendered a tick at
 * y="90.01456582934566" and Chrome recomputed 90.01456582934567, which React
 * counts as a hydration mismatch and re-renders the whole tree over. Two
 * decimals in a 400-unit viewBox is far finer than a pixel, and it is
 * spec-defined so both sides always agree.
 */
function polar(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Number((CENTER + Math.cos(rad) * r).toFixed(2)),
    y: Number((CENTER + Math.sin(rad) * r).toFixed(2)),
  };
}

function arcPath(startDeg: number, sweepDeg: number, r: number) {
  if (sweepDeg < 0.6) return "";
  const a = polar(startDeg, r);
  const b = polar(startDeg + Math.min(sweepDeg, 359.9), r);
  return ["M", a.x, a.y, "A", r, r, 0, sweepDeg > 180 ? 1 : 0, 1, b.x, b.y].join(" ");
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Pacing. The open stretch gets the time; the closed wedge goes by quickly. */
const SEG_BASE_MS = 1900;
const SEG_MS_PER_MINUTE = 2.2;

export function HoursClock({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const segRef = useRef(0);
  const startedRef = useRef(0);
  const pinnedRef = useRef(false);
  const activeRef = useRef(0);

  const anchors = useMemo(
    () => [
      { hhmm: BUSINESS.hours.open24, label: BUSINESS.hours.open, title: "Open" },
      { hhmm: BUSINESS.hours.close24, label: BUSINESS.hours.close, title: "Close" },
    ],
    [],
  );

  const angles = useMemo(() => anchors.map((a) => minutesOf(a.hhmm) * 0.5), [anchors]);

  /**
   * Two segments: open to close the long way round the day, then close back to
   * open across the wedge the house is shut. Minutes keep climbing rather than
   * wrapping at 720, so each segment is a plain interpolation.
   */
  const timeline = useMemo(() => {
    const opens = minutesOf(anchors[0].hhmm);
    const closes = minutesOf(anchors[1].hhmm);
    const openSpan = (((closes - opens) % 720) + 720) % 720;
    return [
      {
        from: opens,
        to: opens + openSpan,
        next: 1,
        duration: SEG_BASE_MS + openSpan * SEG_MS_PER_MINUTE,
      },
      {
        from: opens + openSpan,
        to: opens + 720,
        next: 0,
        duration: SEG_BASE_MS + (720 - openSpan) * SEG_MS_PER_MINUTE,
      },
    ];
  }, [anchors]);

  const dayStart = angles[0];

  const paint = useCallback(
    (minutes: number) => {
      // Whole minutes, so the minute hand steps the way a clock does rather
      // than gliding. Fast stretches blur into a sweep; the slow ends tick.
      const q = Math.round(minutes);
      hourRef.current?.setAttribute("transform", "rotate(" + q * 0.5 + " 200 200)");
      minuteRef.current?.setAttribute("transform", "rotate(" + (q % 60) * 6 + " 200 200)");
      const swept = (((q * 0.5 - dayStart) % 360) + 360) % 360;
      arcRef.current?.setAttribute("d", arcPath(dayStart, swept, DIAL_R));
    },
    [dayStart],
  );

  const pin = useCallback(
    (i: number) => {
      pinnedRef.current = true;
      segRef.current = i;
      startedRef.current = 0;
      activeRef.current = i;
      setActive(i);
      paint(timeline[i].from);
    },
    [paint, timeline],
  );

  const release = useCallback(() => {
    pinnedRef.current = false;
  }, []);

  useEffect(() => {
    paint(timeline[0].from);
  }, [paint, timeline]);

  useEffect(() => {
    if (reduce) return;
    const box = boxRef.current;
    if (!box) return;

    let raf = 0;
    let running = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (pinnedRef.current) return;
      if (!startedRef.current) startedRef.current = now;

      let seg = timeline[segRef.current];
      let progress = (now - startedRef.current) / seg.duration;
      if (progress >= 1) {
        segRef.current = seg.next;
        startedRef.current = now;
        seg = timeline[segRef.current];
        progress = 0;
      }

      const eased = easeInOut(progress);
      paint(seg.from + (seg.to - seg.from) * eased);

      const nowActive = eased < 0.5 ? segRef.current : seg.next;
      if (nowActive !== activeRef.current) {
        activeRef.current = nowActive;
        setActive(nowActive);
      }
    };

    // A clock nobody is looking at does not need a frame budget.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) {
          startedRef.current = 0;
          raf = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(box);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [paint, reduce, timeline]);

  const initial = timeline[0].from;

  return (
    <div className={cn("relative", className)} onMouseLeave={release}>
      <div
        ref={boxRef}
        className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72 lg:h-[20rem] lg:w-[20rem] xl:h-[24rem] xl:w-[24rem]"
      >
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="hours-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="var(--color-cream-deep)" />
            </linearGradient>
          </defs>

          <circle
            cx={CENTER}
            cy={CENTER}
            r={DIAL_R}
            fill="url(#hours-face)"
            stroke="var(--color-cocoa)"
            strokeOpacity={0.14}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={DIAL_R - 13}
            fill="none"
            stroke="var(--color-cocoa)"
            strokeOpacity={0.08}
          />

          {/* Sixty minute ticks, with the hours and quarters weighted up. */}
          {Array.from({ length: 60 }, (_, i) => {
            const deg = i * 6;
            const hour = i % 5 === 0;
            const quarter = i % 15 === 0;
            const inner = polar(deg, DIAL_R - (quarter ? 22 : hour ? 17 : 8));
            const outer = polar(deg, DIAL_R - 4);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--color-cocoa)"
                strokeOpacity={quarter ? 0.4 : hour ? 0.28 : 0.13}
                strokeWidth={quarter ? 3 : hour ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}

          {/* How much of the open day the hands have covered. */}
          <path
            ref={arcRef}
            d=""
            fill="none"
            stroke="var(--color-leaf)"
            strokeOpacity={0.55}
            strokeWidth={4}
            strokeLinecap="round"
          />

          {angles.map((deg, i) => {
            const dot = polar(deg, DIAL_R);
            const on = i === active;
            return (
              <g key={anchors[i].hhmm}>
                {on && (
                  <circle cx={dot.x} cy={dot.y} r={12} fill="var(--color-pink)" opacity={0.16} />
                )}
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={on ? 7 : 5}
                  fill={on ? "var(--color-pink)" : "var(--color-cocoa)"}
                  fillOpacity={on ? 1 : 0.35}
                />
              </g>
            );
          })}

          <g ref={minuteRef} transform={"rotate(" + (initial % 60) * 6 + " 200 200)"}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={CENTER}
              y2={CENTER - 118}
              stroke="var(--color-cocoa-mid)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
          <g ref={hourRef} transform={"rotate(" + initial * 0.5 + " 200 200)"}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={CENTER}
              y2={CENTER - 82}
              stroke="var(--color-cocoa)"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </g>
          <circle cx={CENTER} cy={CENTER} r={7} fill="var(--color-pink)" />
          <circle cx={CENTER} cy={CENTER} r={2.6} fill="#ffffff" />
        </svg>
      </div>

      {/* The legend names the two dots. Hovering or focusing a row pins the
          hands to that time, which is the same interaction the rim labels
          used to carry. */}
      <ol className="mx-auto mt-7 flex w-fit flex-col gap-2">
        {anchors.map((anchor, i) => {
          const on = i === active;
          return (
            <li key={anchor.hhmm}>
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => pin(i)}
                onFocus={() => pin(i)}
                onBlur={release}
                onClick={() => pin(i)}
                className="flex w-full items-baseline gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-cocoa/[0.05]"
              >
                <span className="sr-only">Set the hands to {anchor.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 translate-y-[-1px] rounded-full transition-colors duration-300",
                    on ? "bg-pink ring-4 ring-pink/15" : "bg-cocoa/35",
                  )}
                />
                <span
                  className={cn(
                    "tabular w-[4.5rem] shrink-0 text-sm font-semibold transition-colors duration-300",
                    on ? "text-pink-dark" : "text-cocoa-mid",
                  )}
                >
                  {anchor.label}
                </span>
                <span
                  className={cn(
                    "text-h3 transition-colors duration-300",
                    on ? "text-cocoa" : "text-cocoa/70",
                  )}
                >
                  {anchor.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
