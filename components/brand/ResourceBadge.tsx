import { useId, type ReactNode } from "react";
import type { ArticleTopic } from "@/lib/mdx";
import { FootprintGlyph } from "@/components/brand/Footprints";
import { cn } from "@/lib/cn";

/**
 * The topic marks drawn as small glossy objects for the open book's title
 * page, where the flat line icons (ResourceIcon) would need a chip behind
 * them to hold their own. Every badge is built the same way: a visible edge
 * below the face, a gradient face, a soft sheen from the upper left, and a
 * raised white symbol, all sitting on a contact shadow. The tones are the
 * puzzle pieces' gradients (pieceTones.tsx), so the set reads as one family
 * with the rest of the site.
 */

type Tone = "leaf" | "pink" | "amber";

const TONES: Record<Tone, { face: [string, string]; panel: [string, string]; side: [string, string]; shadow: string }> = {
  leaf: {
    face: ["#B4DD7E", "#5C9130"],
    panel: ["#8CC152", "#4E7A28"],
    side: ["#4E7A28", "#355719"],
    shadow: "#2F4E15",
  },
  pink: {
    face: ["#FF9DB3", "#D42A50"],
    panel: ["#F2607F", "#B0213F"],
    side: ["#B0213F", "#7E1229"],
    shadow: "#6E0F22",
  },
  amber: {
    face: ["#FFD891", "#E0921F"],
    panel: ["#FBB84F", "#C77A12"],
    side: ["#C77A12", "#8F540A"],
    shadow: "#7A4708",
  },
};

type Ids = ReturnType<typeof makeIds>;

function makeIds(prefix: string) {
  return {
    face: (tone: Tone) => `url(#${prefix}-${tone}-face)`,
    panel: (tone: Tone) => `url(#${prefix}-${tone}-panel)`,
    side: (tone: Tone) => `url(#${prefix}-${tone}-side)`,
    sheen: `url(#${prefix}-sheen)`,
    sphere: `url(#${prefix}-sphere)`,
    paper: `url(#${prefix}-paper)`,
    lens: `url(#${prefix}-lens)`,
    blur: `url(#${prefix}-blur)`,
  };
}

function Defs({ prefix }: { prefix: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Tone[]).map((tone) => (
        <g key={tone}>
          <linearGradient id={`${prefix}-${tone}-face`} x1="0.2" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={TONES[tone].face[0]} />
            <stop offset="100%" stopColor={TONES[tone].face[1]} />
          </linearGradient>
          <linearGradient id={`${prefix}-${tone}-panel`} x1="0.3" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={TONES[tone].panel[0]} />
            <stop offset="100%" stopColor={TONES[tone].panel[1]} />
          </linearGradient>
          <linearGradient id={`${prefix}-${tone}-side`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TONES[tone].side[0]} />
            <stop offset="100%" stopColor={TONES[tone].side[1]} />
          </linearGradient>
        </g>
      ))}
      <radialGradient id={`${prefix}-sheen`} cx="32%" cy="16%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${prefix}-sphere`} cx="36%" cy="32%" r="72%">
        <stop offset="0%" stopColor="#FFF1C9" />
        <stop offset="38%" stopColor="#FBC25E" />
        <stop offset="100%" stopColor="#D98A20" />
      </radialGradient>
      <linearGradient id={`${prefix}-paper`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F4EADB" />
      </linearGradient>
      <radialGradient id={`${prefix}-lens`} cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#E3F0D3" stopOpacity="0.9" />
      </radialGradient>
      <filter id={`${prefix}-blur`} x="-50%" y="-200%" width="200%" height="500%">
        <feGaussianBlur stdDeviation="1.3" />
      </filter>
    </defs>
  );
}

/** A shape given depth: its edge below, the gradient face, then the sheen. */
function Solid({
  shape,
  tone,
  ids,
  depth = 2.3,
}: {
  shape: (fill: string) => ReactNode;
  tone: Tone;
  ids: Ids;
  depth?: number;
}) {
  return (
    <>
      <g transform={`translate(0 ${depth})`}>{shape(ids.side(tone))}</g>
      {shape(ids.face(tone))}
      {shape(ids.sheen)}
    </>
  );
}

/** A bevelled inner panel: the shape again, smaller, with a light rim. */
function Panel({
  shape,
  tone,
  ids,
  cx,
  cy,
  scale = 0.8,
}: {
  shape: (fill: string, stroke?: string) => ReactNode;
  tone: Tone;
  ids: Ids;
  cx: number;
  cy: number;
  scale?: number;
}) {
  const transform = `translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;
  return (
    <g transform={transform}>
      {shape(ids.panel(tone))}
      {shape("none", "rgba(255,255,255,0.4)")}
    </g>
  );
}

/** A white symbol pressed up from the face, with its shadow just below. */
function Raised({ tone, children }: { tone: Tone; children: (stroke: string) => ReactNode }) {
  return (
    <>
      <g transform="translate(0 1.1)" opacity="0.45">
        {children(TONES[tone].shadow)}
      </g>
      {children("#FFFDF8")}
    </>
  );
}

function Ground({ ids, rx = 11.5 }: { ids: Ids; rx?: number }) {
  return <ellipse cx="24" cy="44.6" rx={rx} ry="1.9" fill="#3E2A21" opacity="0.22" filter={ids.blur} />;
}

const SYMBOL = {
  fill: "none",
  strokeWidth: 3.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* ---- the badges ---------------------------------------------------- */

const SHIELD =
  "M24 4.6C28.6 7.3 33.4 8.5 38.4 8.7c.6.3.9.9.9 1.6v11.2c0 9.5-6.4 16.2-15.3 19.6C15.1 37.7 8.7 31 8.7 21.5V10.3c0-.7.3-1.3.9-1.6C14.6 8.5 19.4 7.3 24 4.6Z";

function Licensing({ ids }: { ids: Ids }) {
  const shield = (fill: string, stroke?: string) => (
    <path d={SHIELD} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.2 : undefined} />
  );
  return (
    <>
      <Ground ids={ids} />
      <Solid shape={shield} tone="leaf" ids={ids} />
      <Panel shape={shield} tone="leaf" ids={ids} cx={24} cy={22.6} />
      <path d="M11.3 10.9c4.6-.4 8.8-1.6 12.7-3.7" fill="none" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="1.3" strokeLinecap="round" />
      <Raised tone="leaf">{(stroke) => <path d="M17.4 23.4 22 28l9.2-10" stroke={stroke} {...SYMBOL} />}</Raised>
    </>
  );
}

const SMALL_HEART =
  "M24 28.3c-3.9-2.7-6.6-5.2-6.6-8.3 0-2.1 1.6-3.7 3.6-3.7 1.3 0 2.4.7 3 1.7.6-1 1.7-1.7 3-1.7 2 0 3.6 1.6 3.6 3.7 0 3.1-2.7 5.6-6.6 8.3Z";

function Cost({ ids }: { ids: Ids }) {
  // A gold coin, stamped with a heart.
  const coin = (fill: string, stroke?: string) => (
    <circle cx="24" cy="21.5" r="15.5" fill={fill} stroke={stroke} strokeWidth={stroke ? 1.2 : undefined} />
  );
  return (
    <>
      <Ground ids={ids} rx={12.5} />
      <Solid shape={coin} tone="amber" ids={ids} depth={3.2} />
      <Panel shape={coin} tone="amber" ids={ids} cx={24} cy={21.5} scale={0.76} />
      <Raised tone="amber">{(fill) => <path d={SMALL_HEART} fill={fill} />}</Raised>
    </>
  );
}

function Starting({ ids }: { ids: Ids }) {
  // The logo's footprint, as a solid print.
  const print = (fill: string) => (
    <g fill={fill} transform="translate(24 23.2) scale(0.95) translate(-20.5 -28.4)">
      <FootprintGlyph />
    </g>
  );
  return (
    <>
      <Ground ids={ids} rx={9.5} />
      <Solid shape={print} tone="pink" ids={ids} depth={2.1} />
    </>
  );
}

function DayToDay({ ids }: { ids: Ids }) {
  // A sun rising over a green hill.
  const rays = Array.from({ length: 7 }, (_, i) => {
    const angle = (Math.PI * (i + 0.5)) / 7 + Math.PI;
    const x1 = 24 + Math.cos(angle) * 13.2;
    const y1 = 22 + Math.sin(angle) * 13.2;
    const x2 = 24 + Math.cos(angle) * 16.6;
    const y2 = 22 + Math.sin(angle) * 16.6;
    return { x1, y1, x2, y2 };
  });
  const hill = (fill: string) => (
    <path
      d="M6.2 36.2C9.8 29.8 16.4 26.4 24 26.4s14.2 3.4 17.8 9.8c.5.9-.2 1.9-1.2 1.9H7.4c-1 0-1.7-1-1.2-1.9Z"
      fill={fill}
    />
  );
  return (
    <>
      <Ground ids={ids} rx={15} />
      {rays.map((r, i) => (
        <line key={i} {...r} stroke="#F2A63B" strokeWidth="2.6" strokeLinecap="round" />
      ))}
      <circle cx="24" cy="23.2" r="9.6" fill="#C77A12" />
      <circle cx="24" cy="22" r="9.6" fill={ids.sphere} />
      <Solid shape={hill} tone="leaf" ids={ids} depth={2.4} />
    </>
  );
}

const HEART =
  "M24 40.5C17.4 36.6 7.2 29.3 7.2 18.9 7.2 13.2 11.4 8.9 16.8 8.9c3.1 0 5.7 1.5 7.2 3.9 1.5-2.4 4.1-3.9 7.2-3.9 5.4 0 9.6 4.3 9.6 10 0 10.4-10.2 17.7-16.8 21.6Z";

function Health({ ids }: { ids: Ids }) {
  const heart = (fill: string, stroke?: string) => (
    <path d={HEART} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.2 : undefined} />
  );
  return (
    <>
      <Ground ids={ids} rx={12.5} />
      <Solid shape={heart} tone="pink" ids={ids} />
      <Panel shape={heart} tone="pink" ids={ids} cx={24} cy={22.5} scale={0.78} />
      <Raised tone="pink">{(stroke) => <path d="M24 17.4v11.2M18.4 23h11.2" stroke={stroke} {...SYMBOL} />}</Raised>
    </>
  );
}

function Family({ ids }: { ids: Ids }) {
  // A clipboard holding a family record card.
  const board = (fill: string) => <rect x="10" y="8.2" width="28" height="32.6" rx="4.6" fill={fill} />;
  const clip = (fill: string) => <rect x="18.2" y="5.4" width="11.6" height="6.2" rx="2.6" fill={fill} />;
  return (
    <>
      <Ground ids={ids} rx={13} />
      <Solid shape={board} tone="amber" ids={ids} />
      <rect x="13.4" y="13.2" width="21.2" height="24.4" rx="2.4" fill="#8F540A" opacity="0.25" transform="translate(0 0.9)" />
      <rect x="13.4" y="13.2" width="21.2" height="24.4" rx="2.4" fill={ids.paper} />
      <Solid shape={clip} tone="pink" ids={ids} depth={1.5} />
      <circle cx="19.6" cy="20.2" r="2.7" fill={ids.face("leaf")} />
      <path d="M15.6 28.2c.7-2.6 2.2-3.9 4-3.9s3.3 1.3 4 3.9Z" fill={ids.face("leaf")} />
      <path d="M26.4 19h4.6M26.4 23h4.6M17 32.6h14" stroke="#4E7A28" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Choosing({ ids }: { ids: Ids }) {
  // A magnifying glass: a green ring with a pink handle.
  const ring = (fill: string) => (
    <path
      d="M21 8.6a12.4 12.4 0 1 1 0 24.8 12.4 12.4 0 0 1 0-24.8Zm0 4.6a7.8 7.8 0 1 0 0 15.6 7.8 7.8 0 0 0 0-15.6Z"
      fill={fill}
      fillRule="evenodd"
    />
  );
  const handle = (fill: string) => (
    <rect x="-3.2" y="0" width="6.4" height="13" rx="3.2" fill={fill} transform="translate(31.2 30.2) rotate(-45)" />
  );
  return (
    <>
      <Ground ids={ids} rx={13} />
      <Solid shape={handle} tone="pink" ids={ids} depth={2} />
      <circle cx="21" cy="21" r="7.9" fill={ids.lens} />
      <path d="M16.6 18.6a5 5 0 0 1 3.6-3.3" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
      <Solid shape={ring} tone="leaf" ids={ids} depth={2.2} />
    </>
  );
}

const BADGES: Record<ArticleTopic, (props: { ids: Ids }) => React.JSX.Element> = {
  choosing: Choosing,
  cost: Cost,
  licensing: Licensing,
  starting: Starting,
  "day-to-day": DayToDay,
  health: Health,
  family: Family,
};

export function ResourceBadge({ topic, className }: { topic: ArticleTopic; className?: string }) {
  const prefix = useId().replace(/:/g, "");
  const Badge = BADGES[topic];
  return (
    <svg viewBox="0 0 48 48" className={cn("block", className)} aria-hidden="true">
      <Defs prefix={prefix} />
      <Badge ids={makeIds(prefix)} />
    </svg>
  );
}
