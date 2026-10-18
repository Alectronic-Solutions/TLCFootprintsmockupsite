import { useId } from "react";
import { GlossyDefs, Ground, HEART, heartAt, Solid, TONES, glossyIds, type GlossyIds } from "@/components/brand/glossy";
import { cn } from "@/lib/cn";

/**
 * The four marks in the "Good to know" bar, drawn as small glossy objects in
 * the same light as ProgramIcon (see glossy.tsx): a clock, a door left ajar,
 * a breakfast bowl, and a coin stamped with a heart.
 */
export type HighlightIconName = "hours" | "openings" | "meals" | "subsidy";

function Extras({ prefix }: { prefix: string }) {
  return (
    <>
      <linearGradient id={`${prefix}-dial`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F4EADB" />
      </linearGradient>
      <radialGradient id={`${prefix}-glow`} cx="62%" cy="58%" r="70%">
        <stop offset="0%" stopColor="#FFF7DF" />
        <stop offset="45%" stopColor="#FCD285" />
        <stop offset="100%" stopColor="#E39A33" />
      </radialGradient>
      <radialGradient id={`${prefix}-oats`} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#FFF6E2" />
        <stop offset="60%" stopColor="#F6D9A4" />
        <stop offset="100%" stopColor="#DDAE62" />
      </radialGradient>
    </>
  );
}

/* ---- hours: a little alarm clock ------------------------------------ */

function Hours({ ids }: { ids: GlossyIds }) {
  const rim = (fill: string) => <circle cx="24" cy="25" r="14.4" fill={fill} />;
  const bell = (cx: number) => (fill: string) => <circle cx={cx} cy="14.6" r="4.8" fill={fill} />;
  const hands = (stroke: string) => (
    <path d="M24 25.6v-7.4M24 25.6l4.4 3" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" fill="none" />
  );

  return (
    <>
      <Ground ids={ids} rx={12.5} />

      {/* Legs and bells sit behind the body, so the rim covers their roots. */}
      <path d="M16.4 36.4l-2.6 5M31.6 36.4l2.6 5" stroke={ids.side("leaf")} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M24 10.6V8.2" stroke={TONES.leaf.side[0]} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="7.6" r="1.7" fill={ids.face("amber")} />
      <Solid shape={bell(14)} tone="amber" ids={ids} depth={1.4} />
      <Solid shape={bell(34)} tone="amber" ids={ids} depth={1.4} />

      <Solid shape={rim} tone="leaf" ids={ids} depth={2.4} />
      <path d="M13.2 20.6a11.6 11.6 0 0 1 7-6.6" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* The dial, set into the rim. */}
      <circle cx="24" cy="25" r="11.2" fill={TONES.leaf.side[1]} opacity="0.55" />
      <circle cx="24" cy="25.5" r="10.7" fill={ids.url("dial")} />
      <g fill={TONES.leaf.side[0]}>
        <circle cx="24" cy="17.2" r="1" />
        <circle cx="32.3" cy="25.5" r="1" />
        <circle cx="24" cy="33.8" r="1" />
        <circle cx="15.7" cy="25.5" r="1" />
      </g>

      <g transform="translate(0.5 0.9)" opacity="0.22">
        {hands("#3E2A21")}
      </g>
      {hands(TONES.pink.panel[0])}
      <circle cx="24" cy="25.6" r="2" fill={ids.face("amber")} />
      <circle cx="23.4" cy="25" r="0.6" fill="#FFFFFF" opacity="0.8" />
      <path d="M16.6 22.4a8.4 8.4 0 0 1 4.2-4.6" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </>
  );
}

/* ---- openings: a door standing ajar, lit from inside ---------------- */

function Openings({ ids }: { ids: GlossyIds }) {
  const frame = (fill: string) => (
    <path d="M11 41V11.4a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5V41Z" fill={fill} />
  );
  const step = (fill: string) => <rect x="8.4" y="39.2" width="31.2" height="3.4" rx="1.5" fill={fill} />;
  const OPENING = "M15 41V12.8a2.6 2.6 0 0 1 2.6-2.6h12.8a2.6 2.6 0 0 1 2.6 2.6V41Z";

  return (
    <>
      <Ground ids={ids} rx={15.5} />
      <Solid shape={frame} tone="leaf" ids={ids} depth={1.8} />
      <path d="M13.6 10.4a3.6 3.6 0 0 1 3-2.6h7" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.1" strokeLinecap="round" fill="none" />

      {/* Warm light through the gap. */}
      <path d={OPENING} fill={ids.url("glow")} />
      <path d={OPENING} fill="none" stroke={TONES.leaf.side[1]} strokeOpacity="0.45" strokeWidth="1.2" />

      {/* The door, swung inward on its left hinge: its free edge reads shorter. */}
      <path d="M15 10.4l8.6 3V39.4L15 41Z" fill={ids.face("pink")} />
      <path d="M15 10.4l8.6 3V39.4L15 41Z" fill={ids.sheen} />
      <path d="M23.6 13.4h1.3V39.3h-1.3Z" fill={ids.side("pink")} />
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.38" strokeWidth="0.9">
        <path d="M16.8 14l5 1.6v8.6l-5-.2Z" />
        <path d="M16.8 27.4l5 .1v8.8l-5 1.2Z" />
      </g>
      <circle cx="21.6" cy="26.4" r="1.4" fill={ids.face("amber")} />
      <circle cx="21.2" cy="26" r="0.45" fill="#FFFFFF" opacity="0.85" />

      <Solid shape={step} tone="amber" ids={ids} depth={1.3} />
      <ellipse cx="28.6" cy="40" rx="4.6" ry="0.8" fill="#FFF7DF" opacity="0.85" />
    </>
  );
}

/* ---- meals: a breakfast bowl ---------------------------------------- */

function Meals({ ids }: { ids: GlossyIds }) {
  const body = (fill: string) => (
    <path d="M7 22.4c.6 10.6 7.6 16.4 17 16.4s16.4-5.8 17-16.4Z" fill={fill} />
  );
  const spoon = (stroke: string, width = 3.2) => (
    <path d="M30.6 21.6 37.4 9.8" stroke={stroke} strokeWidth={width} strokeLinecap="round" fill="none" />
  );

  return (
    <>
      <Ground ids={ids} rx={13} />

      <g fill="none" stroke={TONES.amber.side[0]} strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18.6 16.4c-1.6-1.6 1.4-3 0-4.8s1.2-3.2 0-4.6" />
        <path d="M24.6 15.6c-1.6-1.6 1.4-3 0-4.8s1.2-3.2 0-4.6" />
      </g>

      <ellipse cx="24" cy="39.6" rx="7.4" ry="2.2" fill={ids.side("leaf")} />
      <Solid shape={body} tone="leaf" ids={ids} depth={1.2} />

      {/* Rim, then the oats inside it, with a few berries on top. */}
      <ellipse cx="24" cy="22.4" rx="17" ry="4.4" fill={ids.top("leaf")} />
      <ellipse cx="24" cy="22.7" rx="14.6" ry="3.3" fill={ids.url("oats")} />
      <path d="M9.4 22.7a14.6 3.3 0 0 1 29.2 0" stroke={TONES.leaf.side[1]} strokeOpacity="0.4" strokeWidth="1" fill="none" />
      <circle cx="19.4" cy="23" r="1.15" fill={ids.face("pink")} />
      <circle cx="26.2" cy="22" r="1.15" fill={ids.face("pink")} />
      <circle cx="22.8" cy="24.1" r="1" fill={ids.face("leaf")} />

      <g transform="translate(0.5 0.7)" opacity="0.25">
        {spoon("#3E2A21")}
      </g>
      {spoon(TONES.pink.panel[0])}
      {spoon("#FFFFFF", 0.9)}

      <path d="M10.2 25.2C14 27.4 18.8 28.6 24 28.6s10-1.2 13.8-3.4" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" fill="none" />
    </>
  );
}

/* ---- subsidy: a coin stamped with a heart --------------------------- */

function Subsidy({ ids }: { ids: GlossyIds }) {
  const coin = (fill: string) => <circle cx="24" cy="23" r="15.4" fill={fill} />;
  const heart = (fill: string) => (
    <path d={HEART} fill={fill} transform={heartAt(24, 23.6, 1.12)} />
  );

  return (
    <>
      <Ground ids={ids} rx={12.5} />
      <Solid shape={coin} tone="amber" ids={ids} depth={3.2} />
      <circle
        cx="24"
        cy="23"
        r="11.8"
        fill={ids.panel("amber")}
        stroke="#FFFFFF"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <path d="M11.6 19.4a13 13 0 0 1 8.4-8.6" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <g transform="translate(0 1.2)" opacity="0.4">
        {heart(TONES.amber.shadow)}
      </g>
      <Solid shape={heart} tone="pink" ids={ids} depth={1.2} />
    </>
  );
}

const ICONS: Record<HighlightIconName, (props: { ids: GlossyIds }) => React.JSX.Element> = {
  hours: Hours,
  openings: Openings,
  meals: Meals,
  subsidy: Subsidy,
};

export function HighlightIcon({
  name,
  className,
}: {
  name: HighlightIconName;
  className?: string;
}) {
  const prefix = useId().replace(/:/g, "");
  const Icon = ICONS[name];
  return (
    <svg viewBox="0 0 48 48" className={cn("block", className)} aria-hidden="true">
      <GlossyDefs prefix={prefix}>
        <Extras prefix={prefix} />
      </GlossyDefs>
      <Icon ids={glossyIds(prefix)} />
    </svg>
  );
}
