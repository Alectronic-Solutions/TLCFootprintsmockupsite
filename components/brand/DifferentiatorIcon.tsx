import { useId } from "react";
import {
  GlossyDefs,
  Ground,
  HEART,
  Solid,
  TONES,
  glossyIds,
  heartAt,
  type GlossyIds,
  type Tone,
} from "@/components/brand/glossy";
import { cn } from "@/lib/cn";

/**
 * Marks for the "A home, not a center" cards, drawn as small glossy objects
 * in the same light as ProgramIcon and HighlightIcon (see glossy.tsx). Hearts
 * are pink, matching the solid hearts used across the site. No mark depicts
 * a countable number of children.
 */

function Extras({ prefix }: { prefix: string }) {
  return (
    <>
      <radialGradient id={`${prefix}-head`} cx="36%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#E2F4C6" />
        <stop offset="45%" stopColor="#9FCE66" />
        <stop offset="100%" stopColor="#4E7A28" />
      </radialGradient>
      <linearGradient id={`${prefix}-wall`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F4E7D3" />
      </linearGradient>
      <linearGradient id={`${prefix}-wall-side`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E9D8BC" />
        <stop offset="100%" stopColor="#CDB28A" />
      </linearGradient>
      <linearGradient id={`${prefix}-cloud`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#EDE3D3" />
      </linearGradient>
    </>
  );
}

/* ---- constant: one adult, a heart at the chest ---------------------- */

function Constant({ ids }: { ids: GlossyIds }) {
  const body = (fill: string) => (
    <path d="M9.6 40.6c0-9.4 6.2-14.6 14.4-14.6s14.4 5.2 14.4 14.6c0 .9-.6 1.4-1.4 1.4H11c-.8 0-1.4-.5-1.4-1.4Z" fill={fill} />
  );
  const heart = (fill: string) => <path d={HEART} fill={fill} transform={heartAt(24, 34.2, 0.78)} />;

  return (
    <>
      <Ground ids={ids} rx={14} />
      <Solid shape={body} tone="leaf" ids={ids} depth={1.6} />
      <path d="M13.4 34.6c1.2-3.4 3.6-5.6 6.6-6.6" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* The head's shadow on the shoulders, then the head itself. */}
      <ellipse cx="24" cy="27.9" rx="4.4" ry="1.2" fill={TONES.leaf.shadow} opacity="0.3" />
      <circle cx="24" cy="15.4" r="7.6" fill={ids.url("head")} />
      <ellipse cx="21.4" cy="12.4" rx="2.6" ry="1.7" fill="#FFFFFF" opacity="0.7" transform="rotate(-30 21.4 12.4)" />

      <g transform="translate(0 1)" opacity="0.4">
        {heart(TONES.leaf.shadow)}
      </g>
      <Solid shape={heart} tone="pink" ids={ids} depth={1} />
    </>
  );
}

/* ---- home: a little house with a heart on its front ----------------- */

function Home({ ids }: { ids: GlossyIds }) {
  const heart = (fill: string) => <path d={HEART} fill={fill} transform={heartAt(20.6, 31, 0.8)} />;

  return (
    <>
      <Ground ids={ids} rx={15} />

      {/* Side wall receding to the right, then the gable end facing us. */}
      <path d="M31 22.4 37.2 18.2V36.4L31 40.6Z" fill={ids.url("wall-side")} />
      <path d="M10.2 40.6V22.6L20.6 13.4 31 22.6V40.6Z" fill={ids.url("wall")} />
      <path d="M10.2 40.6V22.6L20.6 13.4 31 22.6V40.6Z" fill="none" stroke="#3E2A21" strokeOpacity="0.1" strokeWidth="0.8" />

      {/* The roof: one slope seen from above, and the thick edge of the gable. */}
      <path d="M20.6 11.8 26.8 7.6 39.8 19.4 33.4 23.6Z" fill={ids.face("leaf")} />
      <path d="M20.6 11.8 26.8 7.6 39.8 19.4 33.4 23.6Z" fill={ids.sheen} />
      <path d="M8.2 23.4 20.6 11.8 33.4 23.6" stroke={ids.side("leaf")} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9.4 22.2 20.6 11.8" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="0.9" strokeLinecap="round" />

      <g transform="translate(0 1)" opacity="0.3">
        {heart(TONES.pink.shadow)}
      </g>
      <Solid shape={heart} tone="pink" ids={ids} depth={1.2} />

      {/* The sill it all stands on. */}
      <path d="M9.4 40.2h22.4l6.2-4.2v1.6l-6.2 4.4H9.4Z" fill={TONES.amber.side[0]} opacity="0.9" />
    </>
  );
}

/* ---- play: the logo's rainbow, resting on two clouds --------------- */

const CENTER = { x: 24, y: 37 };

function band(outer: number, inner: number) {
  const { x, y } = CENTER;
  return `M${x - outer} ${y}A${outer} ${outer} 0 0 1 ${x + outer} ${y}H${x + inner}A${inner} ${inner} 0 0 0 ${x - inner} ${y}Z`;
}

const BANDS: { tone: Tone; outer: number; inner: number }[] = [
  { tone: "pink", outer: 19, inner: 14.4 },
  { tone: "amber", outer: 14.4, inner: 9.8 },
  { tone: "leaf", outer: 9.8, inner: 5.2 },
];

function Cloud({ cx, ids }: { cx: number; ids: GlossyIds }) {
  const puffs = (fill: string) => (
    <g fill={fill}>
      <circle cx={cx - 3.8} cy="39" r="3.3" />
      <circle cx={cx} cy="36.6" r="4.3" />
      <circle cx={cx + 3.9} cy="39.2" r="3.1" />
      <rect x={cx - 6.4} y="39.4" width="12.8" height="2.9" rx="1.45" />
    </g>
  );
  return (
    <>
      <g transform="translate(0 0.9)">{puffs("#D9CBB4")}</g>
      {puffs(ids.url("cloud"))}
      <circle cx={cx - 1.2} cy="35" r="1.3" fill="#FFFFFF" />
    </>
  );
}

function Play({ ids }: { ids: GlossyIds }) {
  return (
    <>
      <Ground ids={ids} rx={17} />

      {/* Each band's top surface, pushed back, then all the fronts over it. */}
      {BANDS.map((b) => (
        <path key={`${b.tone}-top`} d={band(b.outer, b.inner)} fill={ids.top(b.tone)} transform="translate(0.6 -1.4)" />
      ))}
      {BANDS.map((b) => (
        <g key={b.tone}>
          <path d={band(b.outer, b.inner)} fill={ids.face(b.tone)} />
          <path
            d={band(b.outer - 0.9, b.inner + 0.9)}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.28"
            strokeWidth="0.8"
          />
        </g>
      ))}

      <Cloud cx={9.4} ids={ids} />
      <Cloud cx={38.6} ids={ids} />
    </>
  );
}

export type DifferentiatorIconName = "constant" | "home" | "play";

const ICONS: Record<DifferentiatorIconName, (props: { ids: GlossyIds }) => React.JSX.Element> = {
  constant: Constant,
  home: Home,
  play: Play,
};

export function DifferentiatorIcon({
  name,
  className,
}: {
  name: DifferentiatorIconName;
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
