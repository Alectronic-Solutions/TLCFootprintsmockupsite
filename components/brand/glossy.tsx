import type { ReactNode } from "react";

/**
 * The shared kit for the glossy icon sets (ProgramIcon, HighlightIcon): the
 * three brand tones as lit gradients, a sheen from the upper left, and a
 * soft contact shadow, all on a 48x48 canvas. ResourceBadge keeps its own
 * copy of the same tones.
 */

export type Tone = "leaf" | "pink" | "amber";

export const TONES: Record<
  Tone,
  { top: [string, string]; face: [string, string]; panel: [string, string]; side: [string, string]; shadow: string }
> = {
  leaf: {
    top: ["#D6F0B0", "#9FCE66"],
    face: ["#B4DD7E", "#5C9130"],
    panel: ["#8CC152", "#4E7A28"],
    side: ["#4E7A28", "#355719"],
    shadow: "#2F4E15",
  },
  pink: {
    top: ["#FFD0DA", "#F58AA2"],
    face: ["#FF9DB3", "#D42A50"],
    panel: ["#F2607F", "#B0213F"],
    side: ["#B0213F", "#7E1229"],
    shadow: "#6E0F22",
  },
  amber: {
    top: ["#FFEBC2", "#FAC56A"],
    face: ["#FFD891", "#E0921F"],
    panel: ["#FBB84F", "#C77A12"],
    side: ["#C77A12", "#8F540A"],
    shadow: "#7A4708",
  },
};

/** A small rounded heart, centred near (24, 22.3); place it with a transform. */
export const HEART =
  "M24 28.3c-3.9-2.7-6.6-5.2-6.6-8.3 0-2.1 1.6-3.7 3.6-3.7 1.3 0 2.4.7 3 1.7.6-1 1.7-1.7 3-1.7 2 0 3.6 1.6 3.6 3.7 0 3.1-2.7 5.6-6.6 8.3Z";

/** Transform that centres HEART on (cx, cy) at a given scale. */
export function heartAt(cx: number, cy: number, scale: number) {
  return `translate(${cx} ${cy}) scale(${scale}) translate(-24 -22.3)`;
}

export type GlossyIds = ReturnType<typeof glossyIds>;

/** `url(#...)` references for one icon instance; `prefix` keeps ids unique per SVG. */
export function glossyIds(prefix: string) {
  return {
    prefix,
    url: (name: string) => `url(#${prefix}-${name})`,
    top: (tone: Tone) => `url(#${prefix}-${tone}-top)`,
    face: (tone: Tone) => `url(#${prefix}-${tone}-face)`,
    panel: (tone: Tone) => `url(#${prefix}-${tone}-panel)`,
    side: (tone: Tone) => `url(#${prefix}-${tone}-side)`,
    sheen: `url(#${prefix}-sheen)`,
    blur: `url(#${prefix}-blur)`,
  };
}

/** The tone gradients, sheen and blur, plus any icon-specific defs as children. */
export function GlossyDefs({ prefix, children }: { prefix: string; children?: ReactNode }) {
  return (
    <defs>
      {(Object.keys(TONES) as Tone[]).map((tone) => (
        <g key={tone}>
          <linearGradient id={`${prefix}-${tone}-top`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TONES[tone].top[0]} />
            <stop offset="100%" stopColor={TONES[tone].top[1]} />
          </linearGradient>
          <linearGradient id={`${prefix}-${tone}-face`} x1="0.2" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={TONES[tone].face[0]} />
            <stop offset="100%" stopColor={TONES[tone].face[1]} />
          </linearGradient>
          <linearGradient id={`${prefix}-${tone}-panel`} x1="0.3" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={TONES[tone].panel[0]} />
            <stop offset="100%" stopColor={TONES[tone].panel[1]} />
          </linearGradient>
          <linearGradient id={`${prefix}-${tone}-side`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TONES[tone].side[0]} />
            <stop offset="100%" stopColor={TONES[tone].side[1]} />
          </linearGradient>
        </g>
      ))}
      <radialGradient id={`${prefix}-sheen`} cx="28%" cy="14%" r="75%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id={`${prefix}-blur`} x="-50%" y="-200%" width="200%" height="500%">
        <feGaussianBlur stdDeviation="1.3" />
      </filter>
      {children}
    </defs>
  );
}

/** The soft shadow the object stands on. */
export function Ground({ ids, rx }: { ids: GlossyIds; rx: number }) {
  return <ellipse cx="24" cy="44.4" rx={rx} ry="1.9" fill="#3E2A21" opacity="0.24" filter={ids.blur} />;
}

/** A shape given depth: its edge below, the gradient face, then the sheen. */
export function Solid({
  shape,
  tone,
  ids,
  depth = 2.3,
}: {
  shape: (fill: string) => ReactNode;
  tone: Tone;
  ids: GlossyIds;
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
