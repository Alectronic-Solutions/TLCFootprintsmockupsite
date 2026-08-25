import { HandTick, EmptyBox } from "@/components/brand/HandTick";
import { SurfaceGrain } from "@/components/brand/Texture";
import { RATE_INCLUSIONS } from "@/lib/constants";
import { isLineChecked } from "./checklistPieces";

/**
 * The clipboard sheet, third in the site's small family of built-CSS objects
 * (after the toy block pen and the tic-tac-toe rug on /about - see globals.css,
 * "MOTION AND DEPTH"). Same house rules as those: warm hard-offset shadows,
 * cocoa/cream palette, nothing in the physical description a screen reader
 * needs - every glyph here is aria-hidden and the meaning is carried by real
 * <ul>/<li> text.
 *
 * Purely presentational and controlled: which lines are ticked is decided by
 * FootprintChecklist.tsx, which owns `placed` and passes it straight through.
 * This component used to watch its own scroll position and tick itself off on
 * arrival - that self-triggering is gone now that a real interaction (the foot
 * puzzle) drives it, which is also what removed this file's only reason to be
 * a client component.
 */
export function IncludedClipboard({ placed }: { placed: readonly string[] }) {
  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <figure className="clipboard-board relative">
        {/* The metal clip, overlapping the sheet's top edge. */}
        <svg
          viewBox="0 0 120 60"
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-14 w-28 -translate-x-1/2"
        >
          <defs>
            <linearGradient id="clip-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b8078" />
              <stop offset="45%" stopColor="#c9c0b6" />
              <stop offset="55%" stopColor="#a89d92" />
              <stop offset="100%" stopColor="#6f655d" />
            </linearGradient>
          </defs>
          <rect
            x="18"
            y="4"
            width="84"
            height="26"
            rx="7"
            fill="url(#clip-metal)"
            stroke="#5a5148"
            strokeWidth="1.5"
          />
          <rect
            x="8"
            y="24"
            width="104"
            height="20"
            rx="6"
            fill="url(#clip-metal)"
            stroke="#5a5148"
            strokeWidth="1.5"
          />
          <ellipse cx="60" cy="16" rx="6" ry="4" fill="#5a5148" opacity="0.55" />
        </svg>

        <div className="clipboard-sheet relative overflow-hidden rounded-b-xl rounded-t-sm px-7 pb-7 pt-10 shadow-soft sm:px-8">
          <SurfaceGrain className="opacity-[0.35] mix-blend-soft-light" />

          <div className="relative">
            <p className="font-hand text-2xl text-leaf-dark sm:text-3xl">
              Your checklist
            </p>

            <ul className="clipboard-rules mt-2">
              {RATE_INCLUSIONS.included.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <HandTick index={i} checked={isLineChecked("included", i, placed)} />
                  <span className="text-base text-cocoa">{item}</span>
                </li>
              ))}
            </ul>

            <hr className="clipboard-tear my-5" />

            <p className="font-hand text-xl text-cocoa-mid sm:text-2xl">
              Families provide
            </p>

            <ul className="clipboard-rules mt-2">
              {RATE_INCLUSIONS.notIncluded.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <EmptyBox placed={isLineChecked("notIncluded", i, placed)} />
                  <span className="text-base text-cocoa-mid">{item}</span>
                </li>
              ))}
            </ul>

            <hr className="clipboard-tear my-5" />

            <p className="font-hand text-xl text-cocoa-mid sm:text-2xl">
              Enrollment &amp; payment
            </p>

            <ul className="clipboard-rules mt-2">
              {RATE_INCLUSIONS.enrollment.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <HandTick index={i} checked={isLineChecked("enrollment", i, placed)} />
                  <span className="text-base text-cocoa">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </figure>
    </div>
  );
}
