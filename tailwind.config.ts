import type { Config } from "tailwindcss";

/**
 * Brand tokens for T.L.C. Footprints, sampled from the logo.
 *
 * Two rules govern how these are used, and both come straight from LaTrell's
 * brief ("not extremely bright", "not too many childish graphics"):
 *
 *  1. Color lives in *marks* (arcs, leaves, footprints, icons, one CTA)
 *     against a majority of cream and cocoa. Never large saturated fields.
 *  2. Body text is never `pink` or `leaf` DEFAULT. Those are display/icon
 *     colors only; the `-dark` variants are the ones that clear AA on cream.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FDF8F0",
          deep: "#F7EFE2",
        },
        pink: {
          DEFAULT: "#E23A5E",
          dark: "#C22B4B",
          light: "#FCE7EC",
        },
        amber: {
          DEFAULT: "#F2A63B",
          dark: "#D98A20",
          light: "#FDF0DC",
        },
        leaf: {
          DEFAULT: "#6FA83C",
          dark: "#4E7A28",
          light: "#EDF5E1",
        },
        cocoa: {
          DEFAULT: "#3E2A21",
          mid: "#6B5245",
        },
        ink: "#4A3A31",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        // The casual hand: the hero licence line, and the handwritten headers
        // on the /programs clipboard sheet. Separate from `script` because the
        // two are not interchangeable: `script` is copperplate and only works
        // large.
        hand: ["var(--font-caveat)", "cursive"],
      },
      /**
       * Sized up one full step across the board in August 2026: the audience is
       * a tired parent reading one-handed on a phone, not a designer on a 27in
       * display. 18px is the floor for body copy, 19px for anything that has to
       * be read rather than scanned.
       */
      fontSize: {
        // The 2.25rem floor is set by the longest unbreakable word in the
        // hero ("Everlasting") against a 320px screen. Do not raise it.
        display: ["clamp(2.25rem, 6.4vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1: ["clamp(2.1rem, 5vw, 3.25rem)", { lineHeight: "1.10", letterSpacing: "-0.015em" }],
        h2: ["clamp(1.9rem, 4vw, 2.6rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.3rem, 2vw, 1.45rem)", { lineHeight: "1.30", letterSpacing: "-0.01em" }],
        // Lead paragraph under a section heading. The floor has to clear
        // `body` (1.1875rem) or the lead reads as *smaller* than the copy it
        // is introducing on exactly the screens where that matters most.
        lead: ["clamp(1.25rem, 2.4vw, 1.45rem)", { lineHeight: "1.6" }],
        body: ["1.1875rem", { lineHeight: "1.7" }],
        // Tailwind's own steps, lifted one notch each so that a `text-sm`
        // caption still reads as a caption next to 18px body copy instead of
        // as fine print. Everything on the site inherits these.
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["0.9375rem", { lineHeight: "1.6" }],
        base: ["1.0625rem", { lineHeight: "1.65" }],
        article: ["1.1875rem", { lineHeight: "1.8" }],
        eyebrow: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      maxWidth: {
        container: "72rem",
        prose: "48rem",
        measure: "68ch",
      },
      borderWidth: {
        hair: "0.5px",
      },
      boxShadow: {
        // Warm-tinted, never neutral black: neutral shadows read muddy-gray
        // against #FDF8F0. This is the single biggest tell of an amateur
        // cream palette.
        soft: "0 1px 2px rgba(62,42,33,0.04), 0 8px 24px rgba(62,42,33,0.06)",
        lift: "0 4px 8px rgba(62,42,33,0.06), 0 16px 40px rgba(62,42,33,0.10)",
        pinkglow: "0 2px 8px rgba(226,58,94,0.16), 0 10px 28px rgba(226,58,94,0.22)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
