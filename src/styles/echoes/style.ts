import type { RenderContext } from "../registry";

/* ------------------------------------------------------------------ *
 *  Palette — derived from the Echoes design system
 *
 *  Primary:   Sage green  HSL(148, 34%, 62%)
 *  Secondary: Warm peach  HSL(37, 61%, 93%)
 *  Accent:    Lavender    HSL(262, 23%, 83%)
 *
 *  Each palette composes these hues into a layered, organic avatar
 *  that mirrors the app's living background: soft color washes,
 *  warm glows over a breathing gradient.
 * ------------------------------------------------------------------ */

type Palette = {
  bg: string;
  field: string;
  orb0: string;
  orb1: string;
  glow: string;
};

const PALETTES: readonly Palette[] = [
  // Sage & lavender — the core Echoes pairing
  {
    bg: "#E8F0EB", field: "#ECE8F2",
    orb0: "#7DB596", orb1: "#C2B5D6",
    glow: "#F2E6D0",
  },
  // Warm peach & sage — approachable, human
  {
    bg: "#F2ECE2", field: "#E8F0EB",
    orb0: "#D4AA82", orb1: "#85B498",
    glow: "#F5DCC6",
  },
  // Deep sage & dusty rose — grounded warmth
  {
    bg: "#E6EEE8", field: "#F0E8E8",
    orb0: "#6B9E82", orb1: "#C9918A",
    glow: "#F0E2CC",
  },
  // Lavender & soft sage — thoughtful, creative
  {
    bg: "#EBE8F2", field: "#E8F0EB",
    orb0: "#9B8EB5", orb1: "#85B498",
    glow: "#D8CEE8",
  },
  // Moss & warm taupe — earthy, quiet
  {
    bg: "#ECE9E2", field: "#E8EEE8",
    orb0: "#7A9E85", orb1: "#B5A08A",
    glow: "#E6DAC8",
  },
  // Rose & lavender — tender vulnerability
  {
    bg: "#F0E8E8", field: "#EBE8F2",
    orb0: "#C9918A", orb1: "#B5A8CC",
    glow: "#EED8D2",
  },
  // Sage & amber — warm growth
  {
    bg: "#E8F0EB", field: "#EEEAD8",
    orb0: "#7DB596", orb1: "#CCA860",
    glow: "#F2E8CA",
  },
];

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function round(n: number, digits = 2): number {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export function renderEchoes(ctx: RenderContext): string {
  const { size, rng } = ctx;
  const h = size / 2;

  const palette = rng.pick(PALETTES);
  const uid = Math.floor(rng.next() * 1e9);

  /* --- Background gradient (slightly off-center for organic feel) --- */
  const bgCx = round(h + (rng.next() - 0.5) * size * 0.2);
  const bgCy = round(h + (rng.next() - 0.5) * size * 0.2);

  /* --- Organic orbs: 2-3 soft elliptical color washes --- */
  const orbCount = rng.int(2, 3);
  const orbColors = [palette.orb0, palette.orb1, palette.glow];

  const orbs = Array.from({ length: orbCount }, (_, i) => {
    const color = orbColors[i];
    const cx = round(size * (0.15 + rng.next() * 0.7));
    const cy = round(size * (0.15 + rng.next() * 0.7));
    const rx = round(size * (0.28 + rng.next() * 0.22));
    const ry = round(size * (0.28 + rng.next() * 0.22));
    const angle = round(rng.next() * 180);
    const peakOpacity = round(clamp(0.4 + rng.next() * 0.2, 0.4, 0.6), 2);
    return { color, cx, cy, rx, ry, angle, peakOpacity, id: `o${i}-${uid}` };
  });

  /* --- Warm glow (subtle center presence) --- */
  const glowCx = round(h + (rng.next() - 0.5) * size * 0.25);
  const glowCy = round(h + (rng.next() - 0.5) * size * 0.25);
  const glowR = round(size * (0.22 + rng.next() * 0.12));

  /* --- Assemble SVG --- */
  const defs = [
    `<radialGradient id="bg-${uid}" gradientUnits="userSpaceOnUse" cx="${bgCx}" cy="${bgCy}" r="${round(size * 0.75)}">`,
    `  <stop offset="0%" stop-color="${palette.bg}" />`,
    `  <stop offset="100%" stop-color="${palette.field}" />`,
    `</radialGradient>`,
    ...orbs.flatMap((o) => [
      `<radialGradient id="${o.id}">`,
      `  <stop offset="0%" stop-color="${o.color}" stop-opacity="${o.peakOpacity}" />`,
      `  <stop offset="60%" stop-color="${o.color}" stop-opacity="${round(o.peakOpacity * 0.35, 2)}" />`,
      `  <stop offset="100%" stop-color="${o.color}" stop-opacity="0" />`,
      `</radialGradient>`,
    ]),
    `<radialGradient id="gl-${uid}">`,
    `  <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.4" />`,
    `  <stop offset="50%" stop-color="${palette.glow}" stop-opacity="0.15" />`,
    `  <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />`,
    `</radialGradient>`,
  ];

  const elements = [
    `<rect width="${size}" height="${size}" fill="url(#bg-${uid})" />`,
    ...orbs.map(
      (o) =>
        `<ellipse cx="${o.cx}" cy="${o.cy}" rx="${o.rx}" ry="${o.ry}" fill="url(#${o.id})" transform="rotate(${o.angle} ${o.cx} ${o.cy})" />`,
    ),
    `<circle cx="${glowCx}" cy="${glowCy}" r="${glowR}" fill="url(#gl-${uid})" />`,
  ];

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `  <defs>`,
    ...defs.map((l) => `    ${l}`),
    `  </defs>`,
    ...elements.map((l) => `  ${l}`),
    `</svg>`,
  ].join("\n");
}
