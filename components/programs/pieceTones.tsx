/**
 * The three brand tones a puzzle piece can be, shared between FootShape.tsx
 * (the assembled foot) and PuzzleTile.tsx (the same pieces cut out for the
 * tray) so a tile's color and its placed color on the foot can never drift
 * apart - both reference this one map.
 *
 * Each tone renders as a gradient (light tint -> saturated brand color) plus
 * a shared soft highlight sheen, rather than a flat opacity fill - pieces
 * read as dimensional, glossy jigsaw pieces instead of a flat pastel wash.
 * The gradient stop colors live here once; each SVG that uses them (the
 * board, and every tray tile) declares its own `<defs>` referencing these
 * values via `toneGradientId`/`SHEEN_GRADIENT_ID`, since SVG gradients are
 * scoped to the document/element that defines them.
 */
export type PieceTone = "pink" | "leaf" | "amber";

export const TONE_STROKE: Record<PieceTone, string> = {
  pink: "stroke-pink-dark",
  leaf: "stroke-leaf-dark",
  amber: "stroke-amber-dark",
};

export const TONE_DOT: Record<PieceTone, string> = {
  pink: "bg-pink",
  leaf: "bg-leaf",
  amber: "bg-amber",
};

/** Gradient stop colors per tone: a light tint lifting into the saturated brand color. */
export const TONE_GRADIENT_STOPS: Record<PieceTone, { from: string; to: string }> = {
  pink: { from: "#FF8FA8", to: "#D42A50" },
  leaf: { from: "#A6D66E", to: "#5C9130" },
  amber: { from: "#FFC96B", to: "#E0921F" },
};

/** Very faint tone tint used for an empty slot's "ghost" fill, hinting which color belongs there. */
export const TONE_GHOST_FILL: Record<PieceTone, string> = {
  pink: "fill-pink/10",
  leaf: "fill-leaf/10",
  amber: "fill-amber/10",
};

export function toneGradientId(prefix: string, tone: PieceTone) {
  return `${prefix}-tone-${tone}`;
}

export const SHEEN_GRADIENT_SUFFIX = "tone-sheen";

export function sheenGradientId(prefix: string) {
  return `${prefix}-${SHEEN_GRADIENT_SUFFIX}`;
}

const TONES: readonly PieceTone[] = ["pink", "leaf", "amber"];

/**
 * The `<defs>` block a piece's SVG needs to use `toneGradientId`/
 * `sheenGradientId`: one linear gradient per tone plus one shared radial
 * highlight. `prefix` should be unique per SVG instance (e.g. from `useId`)
 * so multiple pieces on the same page never collide on gradient ids.
 */
export function ToneGradientDefs({ prefix }: { prefix: string }) {
  return (
    <>
      {TONES.map((tone) => (
        <linearGradient
          key={tone}
          id={toneGradientId(prefix, tone)}
          x1="0.15"
          y1="0"
          x2="0.55"
          y2="1"
        >
          <stop offset="0%" stopColor={TONE_GRADIENT_STOPS[tone].from} />
          <stop offset="100%" stopColor={TONE_GRADIENT_STOPS[tone].to} />
        </linearGradient>
      ))}
      <radialGradient id={sheenGradientId(prefix)} cx="35%" cy="18%" r="75%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

/**
 * The completed footprint uses each brand tone exactly twice. This fixed,
 * alternating palette keeps neighboring regions distinct and guarantees the
 * snack piece is always the requested yellow/amber tone. Deterministic on
 * server and client, so the six-piece arrangement never changes color during
 * hydration or between visits.
 */
export const PIECE_TONE_BY_ID: Record<string, PieceTone> = {
  deposit: "amber",
  schedule: "pink",
  breakfast: "leaf",
  snacks: "amber",
  lunch: "pink",
  "child-action": "leaf",
};
