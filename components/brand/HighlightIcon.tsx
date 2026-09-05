import { cn } from "@/lib/cn";

/** The four small, illustrated marks in the "Good to know" bar. */
export type HighlightIconName = "hours" | "openings" | "meals" | "subsidy";

const STROKE = {
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function IconDefs({ name }: { name: HighlightIconName }) {
  const prefix = `highlight-${name}`;

  return (
    <defs>
      <linearGradient id={`${prefix}-green`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9abf72" />
        <stop offset="0.55" stopColor="#5d8b55" />
        <stop offset="1" stopColor="#3f6947" />
      </linearGradient>
      <linearGradient id={`${prefix}-amber`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f8d889" />
        <stop offset="0.6" stopColor="#eeb862" />
        <stop offset="1" stopColor="#cf8740" />
      </linearGradient>
      <linearGradient id={`${prefix}-pink`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f49a9c" />
        <stop offset="0.6" stopColor="#e36f78" />
        <stop offset="1" stopColor="#bd4f62" />
      </linearGradient>
      <filter
        id={`${prefix}-shadow`}
        x="-30%"
        y="-30%"
        width="160%"
        height="170%"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow dx="0" dy="1" stdDeviation="0.75" floodColor="#3e2a21" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

function Hours() {
  return (
    <g filter="url(#highlight-hours-shadow)">
      <circle cx="12" cy="12.2" r="8.6" fill="url(#highlight-hours-green)" />
      <ellipse
        cx="9.5"
        cy="8.3"
        rx="4.8"
        ry="2.1"
        fill="#fff"
        opacity="0.24"
        transform="rotate(-28 9.5 8.3)"
      />
      <circle cx="12" cy="11.7" r="6.35" fill="#fffaf0" />
      <circle cx="12" cy="11.7" r="6.35" fill="none" stroke="#3f6947" strokeOpacity="0.24" />
      <path d="M12 8.2v3.5l2.7 1.7" fill="none" stroke="#d65e6d" strokeWidth="1.55" {...STROKE} />
      <circle cx="12" cy="11.7" r="1.15" fill="#d65e6d" />
    </g>
  );
}

function Openings() {
  return (
    <g filter="url(#highlight-openings-shadow)">
      <path d="M4.5 10.6 12 4.5l7.5 6.1V19H4.5Z" fill="url(#highlight-openings-green)" />
      <path d="m12 4.5 7.5 6.1V19H17V10.8Z" fill="#365d42" opacity="0.32" />
      <path d="M8.5 19v-7.4h7V19" fill="url(#highlight-openings-amber)" />
      <path d="M8.5 11.6h7" fill="none" stroke="#fff5d8" strokeOpacity="0.8" strokeWidth="0.8" />
      <circle cx="13.8" cy="15.4" r="0.7" fill="#8f5937" />
      <path d="M6.4 9.6 12 5.1l5.6 4.5" fill="none" stroke="#fff" strokeOpacity="0.34" strokeWidth="0.85" {...STROKE} />
    </g>
  );
}

function Meals() {
  return (
    <g filter="url(#highlight-meals-shadow)">
      <path d="M7.1 8.7c.9-1.1-.7-2.1.2-3.3M12 8.3c.9-1.2-.7-2.2.2-3.4M16.8 8.7c.9-1.1-.7-2.1.2-3.3" fill="none" stroke="#d58c45" strokeWidth="1.15" {...STROKE} />
      <ellipse cx="12" cy="10.9" rx="8.3" ry="2.25" fill="#fff6dc" stroke="#3f6947" strokeOpacity="0.3" strokeWidth="0.7" />
      <path d="M3.7 11c.7 4.7 4 7.7 8.3 7.7s7.6-3 8.3-7.7c-2 1-5 1.55-8.3 1.55S5.7 12 3.7 11Z" fill="url(#highlight-meals-amber)" />
      <path d="M5.1 12.8c1.8.7 4.1 1.05 6.9 1.05 2.8 0 5.1-.35 6.9-1.05" fill="none" stroke="#fff" strokeOpacity="0.42" strokeWidth="0.85" {...STROKE} />
      <path d="M8.2 20h7.6" fill="none" stroke="#3f6947" strokeWidth="1.15" {...STROKE} />
    </g>
  );
}

function Subsidy() {
  return (
    <g filter="url(#highlight-subsidy-shadow)">
      <path d="M4.2 12.2c-.5 2.6.7 5 3.1 5.9" fill="none" stroke="#3f6947" strokeWidth="1.6" {...STROKE} />
      <path d="M19.8 12.2c.5 2.6-.7 5-3.1 5.9" fill="none" stroke="#3f6947" strokeWidth="1.6" {...STROKE} />
      <path d="M12 18.5c-3.45-2.65-5.3-4.25-5.3-6.45 0-1.65 1.2-2.9 2.8-2.9 1.05 0 2 .58 2.5 1.5.5-.92 1.45-1.5 2.5-1.5 1.6 0 2.8 1.25 2.8 2.9 0 2.2-1.85 3.8-5.3 6.45Z" fill="url(#highlight-subsidy-pink)" />
      <path d="M9.2 10.4c.7-.45 1.55-.08 2.1.7" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" {...STROKE} />
      <path d="M12 5.1v1.6M11.2 5.9h1.6" fill="none" stroke="#eab65d" strokeWidth="1" {...STROKE} />
    </g>
  );
}

const ICONS: Record<HighlightIconName, () => React.JSX.Element> = {
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
  const Icon = ICONS[name];

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("block h-6 w-6 overflow-visible", className)}
      aria-hidden="true"
    >
      <IconDefs name={name} />
      <Icon />
    </svg>
  );
}
