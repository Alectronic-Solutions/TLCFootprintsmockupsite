import { useId, type ReactNode } from "react";
import type { ProgramIconName } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { GlossyDefs, Ground, HEART, heartAt, TONES, glossyIds, type GlossyIds, type Tone } from "@/components/brand/glossy";

/**
 * Age-group marks for the two rate tiers, drawn as small glossy objects that
 * stand on the card with nothing behind them. They are lit the same way as
 * ResourceBadge (light from the upper left, a soft contact shadow below) and
 * use the same tones (see glossy.tsx), so the two sets read as one family. The bottle is
 * pink-led and the blocks are three-colour, so the two cards read apart at a
 * glance.
 */

type Ids = GlossyIds & ReturnType<typeof bottleIds>;

function bottleIds(prefix: string) {
  return {
    glass: `url(#${prefix}-glass)`,
    milk: `url(#${prefix}-milk)`,
    teat: `url(#${prefix}-teat)`,
  };
}

function Defs({ prefix }: { prefix: string }) {
  return (
    <GlossyDefs prefix={prefix}>
      {/* Horizontal stops are what turn a flat rectangle into a cylinder. */}
      <linearGradient id={`${prefix}-glass`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#F3C9D3" />
        <stop offset="20%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FCEBEF" />
        <stop offset="100%" stopColor="#E59AAD" />
      </linearGradient>
      <linearGradient id={`${prefix}-milk`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#F1E2C8" />
        <stop offset="25%" stopColor="#FFFDF6" />
        <stop offset="65%" stopColor="#FBF3E4" />
        <stop offset="100%" stopColor="#E6CFA8" />
      </linearGradient>
      <linearGradient id={`${prefix}-teat`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B568" />
        <stop offset="35%" stopColor="#FFF0D4" />
        <stop offset="100%" stopColor="#D9933A" />
      </linearGradient>
    </GlossyDefs>
  );
}

/* ---- the bottle ---------------------------------------------------- */

const BODY = { x: 12.8, y: 18.4, width: 22.4, height: 23.4, rx: 6.2 };

function Infant({ ids }: { ids: Ids }) {
  const clip = `${ids.prefix}-body`;
  const collar = (fill: string) => <rect x="15.4" y="12.6" width="17.2" height="6.6" rx="2.4" fill={fill} />;

  return (
    <>
      <Ground ids={ids} rx={12} />

      {/* Glass, with the milk inside it. */}
      <clipPath id={clip}>
        <rect {...BODY} />
      </clipPath>
      <rect {...BODY} fill={ids.glass} />
      <g clipPath={`url(#${clip})`}>
        <rect x="12.8" y="27.4" width="22.4" height="15" fill={ids.milk} />
        <ellipse cx="24" cy="27.4" rx="11.2" ry="1.6" fill="#FFFFFF" />
        <ellipse cx="24" cy="41.8" rx="11.2" ry="2.6" fill="#E59AAD" opacity="0.35" />
      </g>
      <rect {...BODY} fill="none" stroke="#C22B4B" strokeOpacity="0.28" strokeWidth="0.9" />

      {/* Graduation ticks, so it never reads as a glue bottle. */}
      <path
        d="M28.4 23.6h3.2M29.4 27.4h2.2M28.4 31.2h3.2M29.4 35h2.2"
        stroke="#D42A50"
        strokeOpacity="0.75"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Light caught down the curve of the glass. */}
      <path d="M16.6 22.8v15.4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      <path d="M19.6 24.4v3" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />

      {/* The screw collar: edge, face, sheen, then its grip ridges. */}
      <g transform="translate(0 1.6)">{collar(ids.side("pink"))}</g>
      {collar(ids.face("pink"))}
      {collar(ids.sheen)}
      <path
        d="M18.8 14.6v3M22 14.6v3M26 14.6v3M29.2 14.6v3"
        stroke="#7E1229"
        strokeOpacity="0.3"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M17.4 13.8h11.8" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round" />

      {/* The teat. */}
      <ellipse cx="24" cy="12.8" rx="5.6" ry="1.5" fill="#C98530" />
      <path d="M20.4 12.8c0-2.4.9-3.6 1.9-4.4C22.9 7.9 22.7 4.6 24 4.6s1.1 3.3 1.7 3.8c1 .8 1.9 2 1.9 4.4Z" fill={ids.teat} />
      <ellipse cx="24" cy="12.4" rx="5.6" ry="1.4" fill={ids.teat} />
      <path d="M22.6 10.6c.1-.9.4-1.4.8-1.8" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="0.9" strokeLinecap="round" />
    </>
  );
}

/* ---- the blocks ---------------------------------------------------- */

/** How far back the top and side faces recede: up and to the right. */
const DEPTH = { dx: 3.6, dy: 3 };
const SIZE = 13.6;

function starPath(cx: number, cy: number, outer: number, inner: number) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
}

type Mark = "heart" | "star" | "dot";

function Emblem({ symbol, cx, cy, fill }: { symbol: Mark; cx: number; cy: number; fill: string }) {
  if (symbol === "heart") {
    return <path d={HEART} fill={fill} transform={heartAt(cx, cy, 0.48)} />;
  }
  if (symbol === "star") return <path d={starPath(cx, cy, 3.7, 1.6)} fill={fill} strokeLinejoin="round" />;
  return <circle cx={cx} cy={cy} r="2.7" fill={fill} />;
}

/**
 * One wooden-toy block in a three-quarter view: the receding top and side
 * faces first, then the front face with its bevelled panel and a white
 * emblem pressed up out of it.
 */
function Block({ x, y, tone, symbol, ids }: { x: number; y: number; tone: Tone; symbol: Mark; ids: Ids }) {
  const { dx, dy } = DEPTH;
  const s = SIZE;
  // Inset by half the stroke so the round joins soften every corner.
  const hull = `M${x + 1} ${y + 1}L${x + 1 + dx} ${y + 1 - dy}H${x + s - 1 + dx}V${y + s - 1 - dy}L${x + s - 1} ${y + s - 1}Z`;
  const top = `M${x + 1} ${y + 1}L${x + 1 + dx} ${y + 1 - dy}H${x + s - 1 + dx}L${x + s - 1} ${y + 1}Z`;
  const cx = x + s / 2;
  const cy = y + s / 2;
  const inset = 2.3;

  return (
    <g>
      <path d={hull} fill={ids.side(tone)} stroke={ids.side(tone)} strokeWidth="2" strokeLinejoin="round" />
      <path d={top} fill={ids.top(tone)} stroke={ids.top(tone)} strokeWidth="2" strokeLinejoin="round" />
      <rect x={x} y={y} width={s} height={s} rx="2.6" fill={ids.face(tone)} />
      <rect
        x={x + inset}
        y={y + inset}
        width={s - inset * 2}
        height={s - inset * 2}
        rx="1.6"
        fill={ids.panel(tone)}
        stroke="#FFFFFF"
        strokeOpacity="0.4"
        strokeWidth="0.9"
      />
      <rect x={x} y={y} width={s} height={s} rx="2.6" fill={ids.sheen} />
      <path d={`M${x + 2.4} ${y + 0.7}H${x + s - 2.4}`} stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="0.9" strokeLinecap="round" />
      <g opacity="0.45" transform="translate(0 0.9)">
        <Emblem symbol={symbol} cx={cx} cy={cy} fill={TONES[tone].shadow} />
      </g>
      <Emblem symbol={symbol} cx={cx} cy={cy} fill="#FFFDF8" />
    </g>
  );
}

function Toddler({ ids }: { ids: Ids }) {
  // Stacked in the rainbow's order: pink over leaf and amber. Left to right,
  // so the right block's front hides the left block's side face.
  return (
    <>
      <Ground ids={ids} rx={15.5} />
      <Block x={8.2} y={28.4} tone="leaf" symbol="dot" ids={ids} />
      <Block x={22.6} y={28.4} tone="amber" symbol="star" ids={ids} />
      <Block x={15.4} y={14} tone="pink" symbol="heart" ids={ids} />
    </>
  );
}

const ICONS: Record<ProgramIconName, (props: { ids: Ids }) => ReactNode> = {
  infant: Infant,
  toddler: Toddler,
};

export function ProgramIcon({
  name,
  className,
}: {
  name: ProgramIconName;
  className?: string;
}) {
  const prefix = useId().replace(/:/g, "");
  const Icon = ICONS[name];
  return (
    <svg viewBox="0 0 48 48" className={cn("block", className)} aria-hidden="true">
      <Defs prefix={prefix} />
      <Icon ids={{ ...glossyIds(prefix), ...bottleIds(prefix) }} />
    </svg>
  );
}
