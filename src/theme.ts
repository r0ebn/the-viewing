/**
 * The Viewing — the visual identity, set once and used by every output.
 *
 * Warm sand, terracotta and charcoal; Fraunces for anything that should
 * feel like a printed particulars sheet, Inter for the working text.
 * The hex values also live in `palette`, because the floor-plan engine
 * (src/plan.tsx) paints with exactly the same colours the theme does.
 */
import { defineTheme } from "@hyper-elements/react";

export const palette = {
  sand: "#F4EDE3",
  sandDeep: "#E7D9C0",
  sandPale: "#FBF7EE",
  paper: "#FFFCF6",
  clay: "#B4552D",
  clayDark: "#8F3E1F",
  clayPale: "#F3DCCB",
  charcoal: "#23201C",
  charcoalSoft: "#4A443C",
  muted: "#71665A",
  border: "#DFD3BF",
  white: "#FFFFFF",
} as const;

export const fontStacks = {
  display: "Fraunces, Georgia, 'Times New Roman', serif",
  body: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

/**
 * Web fonts for the HTML outputs. Inter's files are the latin subsets the
 * Google Fonts CSS API serves; Fraunces is served there as a variable
 * file, so the headings' one static latin file (700) is listed and the
 * browser matches the theme's 600 to it. The PDF and the social card
 * never fetch these — src/fonts.ts hands them the same families as local
 * WOFF files from the @fontsource packages.
 */
export const webFonts = [
  {
    family: "Fraunces",
    src: "https://fonts.gstatic.com/s/fraunces/v26/6NUu8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7iQcIfJD58njU0oc7qv8.woff2",
    format: "woff2" as const,
    weight: 700,
  },
  {
    family: "Inter",
    src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2",
    format: "woff2" as const,
    weight: 400,
  },
  {
    family: "Inter",
    src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2",
    format: "woff2" as const,
    weight: 500,
  },
  {
    family: "Inter",
    src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiA.woff2",
    format: "woff2" as const,
    weight: 600,
  },
  {
    family: "Inter",
    src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2",
    format: "woff2" as const,
    weight: 700,
  },
];

export const viewingTheme = defineTheme({
  colors: {
    background: palette.sand,
    foreground: palette.charcoal,
    primary: palette.clay,
    primaryForeground: palette.white,
    muted: palette.muted,
    border: palette.border,
    accent: palette.clayPale,
    accentForeground: palette.clayDark,
    sand: palette.sand,
    sandDeep: palette.sandDeep,
    paper: palette.paper,
    clay: palette.clay,
    clayDark: palette.clayDark,
    charcoal: palette.charcoal,
  },
  fonts: {
    body: fontStacks.body,
    heading: fontStacks.display,
  },
  fontSizes: { body: 16 },
  lineHeights: { body: 1.6 },
  radii: { card: 10, pill: 999 },
  elements: {
    Heading: {
      by: {
        level: {
          1: { fontSize: 38, lineHeight: 1.1, fontWeight: 600, letterSpacing: -0.4, mobile: { fontSize: 29 } },
          2: { fontSize: 25, lineHeight: 1.2, fontWeight: 600, letterSpacing: -0.2, mobile: { fontSize: 21 } },
          3: { fontSize: 18, lineHeight: 1.3, fontWeight: 600 },
        },
      },
    },
    Button: {
      backgroundColor: "{colors.primary}",
      color: "{colors.primaryForeground}",
      fontSize: 15,
      fontWeight: 600,
      padding: [13, 26],
      borderRadius: 999,
      hover: { backgroundColor: "{colors.clayDark}" },
      variants: {
        outline: {
          backgroundColor: "transparent",
          color: "{colors.clayDark}",
          border: { width: 1.5, style: "solid", color: "{colors.clay}" },
          hover: { backgroundColor: "{colors.accent}" },
        },
      },
    },
    Link: {
      color: "{colors.clayDark}",
      fontWeight: 600,
    },
  },
  styles: {
    /** A paper sheet on the sand ground. */
    panel: {
      backgroundColor: "{colors.paper}",
      border: { width: 1, style: "solid", color: "{colors.border}" },
      borderRadius: 10,
      padding: 28,
      gap: 16,
    },
    /** Small terracotta capitals that introduce a block. */
    kicker: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 2.4,
      textTransform: "uppercase",
      lineHeight: 1.4,
      color: "{colors.clay}",
    },
    /** A quiet label over a fact. */
    factLabel: {
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: 1.6,
      textTransform: "uppercase",
      lineHeight: 1.4,
      color: "{colors.muted}",
    },
    /** A sand chip, e.g. the viewing reference. */
    chip: {
      backgroundColor: "{colors.sandDeep}",
      color: "{colors.charcoal}",
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: 0.6,
      padding: [7, 14],
      borderRadius: 999,
    },
  },
  formats: {
    email: {
      elements: {
        Heading: {
          by: {
            level: {
              1: { fontSize: 34, mobile: { fontSize: 27 } },
              2: { fontSize: 23, mobile: { fontSize: 20 } },
            },
          },
        },
      },
    },
  },
});

/** Type every token name in templates. */
declare module "@hyper-elements/react" {
  interface Register {
    theme: typeof viewingTheme;
  }
}
