import { useId } from "react";
import { GlossyDefs, Ground, Solid, TONES, glossyIds, type GlossyIds } from "@/components/brand/glossy";
import { cn } from "@/lib/cn";

/**
 * The contact marks on the tour page, drawn as small glossy objects in the
 * same light as HighlightIcon (see glossy.tsx), one brand tone each: a red
 * ringing handset, a yellow pair of speech bubbles, and a green envelope.
 */
export type ContactIconName = "call" | "text" | "email";

/* ---- call: a telephone handset, tilted in the classic pose -------- */

const CUP =
  "M5 25a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3l-1.2 6.6a2.8 2.8 0 0 1-2.8 2.4h-7a2.8 2.8 0 0 1-2.8-2.4Z";

/* Drawn upright with the cups down, then turned so the earpiece sits upper
   right. Each part carries the turn itself, so Solid's edge still falls
   straight down like the other icons. */
const TURN = "translate(-6 2) rotate(-45 24 22)";

function Call({ ids }: { ids: GlossyIds }) {
  const handle = (fill: string) => (
    <path d="M12.5 26Q24 5 35.5 26" transform={TURN} stroke={fill} strokeWidth="8" strokeLinecap="round" fill="none" />
  );
  const cup = (dx: number) => (fill: string) => (
    <path d={CUP} transform={`${TURN} translate(${dx} 0)`} fill={fill} />
  );

  /* Two ring waves off the earpiece, the outer one fainter. */
  const wave = (r: number) => (fill: string) => (
    <path
      d={`M${30.4 + r * 0.17} ${19 - r * 0.98}A${r} ${r} 0 0 1 ${30.4 + r * 0.98} ${19 - r * 0.17}`}
      stroke={fill}
      strokeWidth="2.6"
      strokeLinecap="round"
      fill="none"
    />
  );

  return (
    <>
      <Ground ids={ids} rx={13} />
      <Solid shape={wave(11)} tone="pink" ids={ids} depth={1} />
      <g opacity="0.6">
        <Solid shape={wave(15.6)} tone="pink" ids={ids} depth={1} />
      </g>
      <Solid shape={handle} tone="pink" ids={ids} depth={2.2} />
      <Solid shape={cup(0)} tone="pink" ids={ids} depth={2.4} />
      <Solid shape={cup(23)} tone="pink" ids={ids} depth={2.4} />

      <g transform={TURN}>
        {/* Darker bands where each cup meets the handle. */}
        <path d="M6.4 26.4h12.2M29.4 26.4h12.2" stroke={TONES.pink.side[0]} strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M15 20.4Q19.4 12.8 26 12.2" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M7.8 24.6h5M30.8 24.6h5" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </>
  );
}

/* ---- text: two speech bubbles, a conversation ---------------------- */

const FRONT_BUBBLE =
  "M14 14h10a9 9 0 0 1 9 9v3a9 9 0 0 1-9 9h-5.4c-1.8 2.6-5 4.6-9 5.4 1.6-1.6 2.4-3.4 2.4-5.8A9 9 0 0 1 5 26v-3a9 9 0 0 1 9-9Z";
const BACK_BUBBLE =
  "M26 6h8a9 9 0 0 1 9 9 9 9 0 0 1-5.6 8.3c.3 1.7 1.2 3.1 2.6 4.1-2.8.1-5.3-1-7-3.4H26a9 9 0 0 1-9-9 9 9 0 0 1 9-9Z";

function Text({ ids }: { ids: GlossyIds }) {
  const front = (fill: string) => <path d={FRONT_BUBBLE} fill={fill} />;
  const dots = (fill: string) => (
    <g fill={fill}>
      <circle cx="12.4" cy="24.6" r="2.4" />
      <circle cx="19" cy="24.6" r="2.4" />
      <circle cx="25.6" cy="24.6" r="2.4" />
    </g>
  );

  return (
    <>
      <Ground ids={ids} rx={15} />

      {/* The reply behind, paler and set back. */}
      <path d={BACK_BUBBLE} transform="translate(0 1.8)" fill={ids.face("amber")} />
      <path d={BACK_BUBBLE} fill={ids.top("amber")} />
      <path d={BACK_BUBBLE} fill={ids.sheen} />
      <path d="M21 12.4a6.4 6.4 0 0 1 4.6-3.4h3" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* The front bubble casts onto the one behind. */}
      <path d={FRONT_BUBBLE} transform="translate(1.2 1.6)" fill={TONES.amber.shadow} opacity="0.22" />
      <Solid shape={front} tone="amber" ids={ids} depth={2.4} />
      <path d="M8 21.4a7 7 0 0 1 5.4-4.6h3" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.3" strokeLinecap="round" fill="none" />

      {/* Raised dots: a shadow beneath, the face, then a pinpoint of light. */}
      <g transform="translate(0.3 0.9)" opacity="0.4">
        {dots(TONES.amber.shadow)}
      </g>
      {dots("#FFFFFF")}
      <g fill={TONES.amber.top[0]}>
        <circle cx="12.4" cy="25.4" r="1.3" />
        <circle cx="19" cy="25.4" r="1.3" />
        <circle cx="25.6" cy="25.4" r="1.3" />
      </g>
      <g fill="#FFFFFF">
        <circle cx="11.8" cy="23.9" r="0.7" />
        <circle cx="18.4" cy="23.9" r="0.7" />
        <circle cx="25" cy="23.9" r="0.7" />
      </g>
    </>
  );
}

/* ---- email: an envelope with its flap closed ------------------------ */

function Email({ ids }: { ids: GlossyIds }) {
  const body = (fill: string) => <rect x="7" y="12" width="34" height="25" rx="4.2" fill={fill} />;
  const FLAP = "M8.6 13.6 24 26.4 39.4 13.6";

  return (
    <>
      <Ground ids={ids} rx={15.5} />
      <Solid shape={body} tone="leaf" ids={ids} depth={2.6} />

      {/* The lower folds, meeting under the flap. */}
      <path d="M8.4 35.6 20.6 25.2M39.6 35.6 27.4 25.2" stroke={TONES.leaf.side[0]} strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />

      {/* The flap: its shadow, the lit face, then a bright crease along its top. */}
      <path d={`${FLAP}Z`} transform="translate(0 1.4)" fill={TONES.leaf.shadow} opacity="0.3" />
      <path d={`${FLAP}Z`} fill={ids.top("leaf")} />
      <path d={`${FLAP}Z`} fill={ids.sheen} />
      <path d={FLAP} stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1" strokeLinejoin="round" fill="none" />

      <path d="M9.4 31.8V16.6a3 3 0 0 1 1-2.2" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </>
  );
}

const ICONS: Record<ContactIconName, (props: { ids: GlossyIds }) => React.JSX.Element> = {
  call: Call,
  text: Text,
  email: Email,
};

export function ContactIcon({
  name,
  className,
}: {
  name: ContactIconName;
  className?: string;
}) {
  const prefix = useId().replace(/:/g, "");
  const Icon = ICONS[name];
  return (
    <svg viewBox="0 0 48 48" className={cn("block", className)} aria-hidden="true">
      <GlossyDefs prefix={prefix} />
      <Icon ids={glossyIds(prefix)} />
    </svg>
  );
}
