import { FootprintGlyph } from "./Footprints";

/**
 * The logo's baby footprint, scattered across a colored field as a watermark,
 * with every print lighting up in a wave that travels left to right.
 *
 * The site's texture vocabulary is paper grain and watercolor washes, neither
 * of which carries a motif. This is the one surface saturated enough to hold
 * one, and the motif it holds is the name: prints at 7% white, turned off-axis
 * so the field reads as walking rather than as a grid.
 *
 * It was a tiled <pattern> once, which is cheaper and evener, but a tile cannot
 * light up one print at a time - every repeat of a pattern is identical, so
 * lighting it through a moving mask lights a solid bar of prints at once. So
 * every print here is a real element on its own clock. They are laid out on a
 * jittered brick grid rather than at random: pure random clumps and leaves
 * holes, and a hole reads as the wave stalling.
 *
 * Two layers over the same positions, because they need different masks:
 *
 *   - The resting watermark is harmless anywhere, so it only takes the soft
 *     radial thinning that keeps texture from crowding a sentence.
 *   - The lit copies are not. A lit print behind a glyph measured as low as
 *     2.2:1 against the white text, so those carry `.cta-wave-mask` - dark over
 *     every text run, opening out around them, and shaped differently on a
 *     phone than on a desktop because the copy fills a phone edge to edge. See
 *     globals.css for the geometry. Where it hides a lit print you simply see
 *     the resting print underneath.
 *
 * That mask turns out to make the better effect anyway: the wave flares beside
 * the heading, goes dark as it passes behind the sentence, and flares again on
 * the far side.
 *
 * Both layers instantiate one <FootprintGlyph> through <use> rather than
 * inlining the path a hundred and some times - and the glyph is the mark's own,
 * so the wallpaper can never drift from the logo it is made of.
 */

/** Tinted well above the brand tokens on purpose. On a deep pink field these
 *  read as light falling on the surface; the tokens themselves read as ink. */
const TINTS = ["#FF7FA0", "#FFC46B", "#A8DC7C"] as const;

/** Seconds. The whole loop, and the share of it the wave takes to cross. */
const CYCLE = 7;
const CROSS = 4.2;

/** Brick grid. Roughly matches the density the old 128x112 tile gave at desktop
 *  width; on a narrower band the same count simply sits closer together. */
const COLS = 15;
const ROWS = 6;

/** Texture thinning for the resting watermark. */
const TEXTURE_MASK =
  "radial-gradient(76% 66% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 56%, #000 100%)";

/** mulberry32. Seeded so the scatter is identical on the server and the client
 *  - Math.random() here would mismatch on hydration. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PRINTS = (() => {
  const rand = rng(0x7c1f);
  const out = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // Half-step offset on alternate rows, then jittered inside the cell. The
      // offset is what stops a jittered grid from still reading as rows.
      const u = (col + (row % 2 ? 0.5 : 0) + 0.5 + (rand() - 0.5) * 0.9) / COLS;
      const v = (row + 0.5 + (rand() - 0.5) * 0.9) / ROWS;

      // Overshoot the box a little so the field has no visible margin; the
      // section clips whatever hangs off.
      const x = -4 + u * 108;
      const y = -6 + v * 112;

      // Phase follows x, so the wave travels. The jitter is under one column's
      // worth, which keeps neighbours out of lockstep without ever letting the
      // order read as backwards.
      const t = (x / 100) * CROSS + (rand() - 0.5) * 0.5;

      out.push({
        x,
        y,
        delay: CYCLE - Math.min(Math.max(t, 0.05), CYCLE - 0.05),
        // Independent of position: the wave is the order, not the colour.
        tint: TINTS[Math.floor(rand() * TINTS.length)],
        size: 19 + Math.round(rand() * 13),
        rotate: Math.round((rand() - 0.5) * 52),
        left: rand() > 0.5,
      });
    }
  }

  return out;
})();

/** The glyph's own centre, from the bounding box documented on FootprintGlyph.
 *  Prints are translated by it so an (x, y) places the middle of the foot. */
const GLYPH_CX = 21;
const GLYPH_CY = 28.4;

/** Bounding-box width, for turning a pixel size into a scale factor. */
const GLYPH_W = 24.6;

/**
 * One layer's worth of prints, as <use> elements inside a single <svg>.
 *
 * A wrapper div and an svg per print costs about 56KB of extra markup once
 * React serializes it twice - into the HTML and again into the flight payload -
 * on all seven pages that carry this band, including phones that never display
 * the lit layer. As <use> elements in one svg the same field is 27KB of tags,
 * and it gzips to very little because the markup is so repetitive.
 *
 * Each print is a nested <svg>, which is the only element that takes x and y as
 * percentages *and* applies them outside its children's transforms. Putting the
 * percentages on the <use> itself does not work: SVG applies a use's x/y as a
 * translate at the innermost end of its transform list, so every print's
 * position came out rotated and scaled along with the glyph, and most of them
 * landed outside the band. overflow="visible" is required because the glyph is
 * drawn around the nested viewport's origin rather than inside it.
 */
function PrintLayer({ flare }: { flare?: boolean }) {
  return (
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      {PRINTS.map((p, i) => (
        <svg
          key={i}
          x={`${p.x.toFixed(2)}%`}
          y={`${p.y.toFixed(2)}%`}
          overflow="visible"
          className={flare ? "cta-foot-flare" : undefined}
          style={
            flare
              ? { fill: p.tint, animationDelay: `-${p.delay.toFixed(2)}s` }
              : undefined
          }
        >
          <use
            href="#cta-foot-glyph"
            transform={[
              `rotate(${p.rotate})`,
              `scale(${(p.size / GLYPH_W).toFixed(3)})`,
              `translate(${-GLYPH_CX},${-GLYPH_CY})`,
              // Mirrored about the glyph's own centre, the same way
              // <Footprint left> does it, so a pair is a left and a right and
              // not the same foot twice.
              p.left ? "translate(42,0) scale(-1,1)" : "",
            ].join(" ")}
          />
        </svg>
      ))}
    </svg>
  );
}

export function FootprintField() {
  return (
    <>
      {/* Defined once, instantiated by every print on both layers. */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        className="pointer-events-none absolute"
      >
        <defs>
          <g id="cta-foot-glyph">
            <FootprintGlyph />
          </g>
        </defs>
      </svg>

      {/* Resting watermark. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 print:hidden"
        style={{
          maskImage: TEXTURE_MASK,
          WebkitMaskImage: TEXTURE_MASK,
          fill: "#FFFFFF",
          opacity: 0.07,
        }}
      >
        <PrintLayer />
      </div>

      {/* The wave. */}
      <div
        aria-hidden="true"
        className="cta-wave-mask pointer-events-none absolute inset-0 print:hidden"
      >
        {/* A soft gleam travels with the prints, so the surface itself brightens
            under the wave instead of the prints floating on a dead field. */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="cta-sweep-rainbow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={TINTS[0]} stopOpacity={0} />
              <stop offset="22%" stopColor={TINTS[0]} stopOpacity={1} />
              <stop offset="50%" stopColor={TINTS[1]} stopOpacity={1} />
              <stop offset="78%" stopColor={TINTS[2]} stopOpacity={1} />
              <stop offset="100%" stopColor={TINTS[2]} stopOpacity={0} />
            </linearGradient>
            <filter
              id="cta-sweep-blur"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="26" />
            </filter>
          </defs>
          <g style={{ mixBlendMode: "screen" }} filter="url(#cta-sweep-blur)">
            <rect
              className="cta-sweep"
              x="-45%"
              y="0"
              width="45%"
              height="100%"
              fill="url(#cta-sweep-rainbow)"
              opacity="0.1"
            />
          </g>
        </svg>

        <PrintLayer flare />
      </div>
    </>
  );
}
