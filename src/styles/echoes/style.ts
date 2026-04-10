import type { RenderContext } from "../registry";

type Palette = {
  bg0: string;
  bg1: string;
  ring: string;
  accent: string;
};

const PALETTES: readonly Palette[] = [
  // Sage & lavender — the core Echoes pairing
  { bg0: "#F4F8F5", bg1: "#F3F1F8", ring: "#7DB596", accent: "#C2B5D6" },
  // Warm peach & sage — approachable, human
  { bg0: "#FBF5EE", bg1: "#F2F7F4", ring: "#8BAF9A", accent: "#D4AA82" },
  // Deep sage & dusty rose — grounded warmth
  { bg0: "#F5F9F6", bg1: "#FBF3F0", ring: "#6B9E82", accent: "#C9918A" },
  // Lavender & soft sage — thoughtful, creative
  { bg0: "#F5F2F9", bg1: "#F0F6F2", ring: "#9B8EB5", accent: "#85B498" },
  // Moss & warm taupe — earthy, quiet
  { bg0: "#F7F4EF", bg1: "#F0F5F1", ring: "#7A9E85", accent: "#B5A08A" },
];

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function round(n: number, digits = 2): number {
  const p = Math.pow(10, digits);
  return Math.round(n * p) / p;
}

export function renderEchoes(ctx: RenderContext): string {
  const { size, rng, version } = ctx;

  if (version !== 1) {
    // For now, only v1 exists. Later you can branch per version here.
    // Keeping this explicit makes versioning intentional.
  }

  const palette = rng.pick(PALETTES);

  // Soft ring parameters
  const ringCount = rng.int(2, 4);
  const centerJitter = size * 0.08;

  const cx = round(size / 2 + (rng.next() - 0.5) * centerJitter, 2);
  const cy = round(size / 2 + (rng.next() - 0.5) * centerJitter, 2);

  const baseRadius = size * 0.18 + rng.next() * (size * 0.06);
  const gap = size * 0.08 + rng.next() * (size * 0.03);

  const ringOpacity = round(clamp(0.22 + rng.next() * 0.18, 0.18, 0.45), 3);
  const ringWidth = round(clamp(size * (0.06 + rng.next() * 0.03), size * 0.05, size * 0.1), 2);

  // Accent dot
  const dotAngle = rng.next() * Math.PI * 2;
  const dotR = baseRadius + gap * (ringCount - 0.5);
  const dx = round(cx + Math.cos(dotAngle) * dotR, 2);
  const dy = round(cy + Math.sin(dotAngle) * dotR, 2);
  const dotSize = round(clamp(size * (0.035 + rng.next() * 0.02), size * 0.03, size * 0.06), 2);

  // A subtle “presence” glow at center
  const glowRadius = round(clamp(size * (0.22 + rng.next() * 0.06), size * 0.2, size * 0.32), 2);

  const rings = Array.from({ length: ringCount }).map((_, i) => {
    const r = round(baseRadius + gap * i, 2);
    const o = round(clamp(ringOpacity - i * 0.03, 0.08, 0.45), 3);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${palette.ring}" stroke-opacity="${o}" stroke-width="${ringWidth}" />`;
  });

  // Use a deterministic id so multiple avatars on the same page do not clash
  const gradId = `echoes-bg-${Math.floor(rng.next() * 1e9)}`;
  const glowId = `echoes-glow-${Math.floor(rng.next() * 1e9)}`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bg0}" />
      <stop offset="100%" stop-color="${palette.bg1}" />
    </linearGradient>

    <radialGradient id="${glowId}" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.35" />
      <stop offset="60%" stop-color="${palette.accent}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${size}" height="${size}" fill="url(#${gradId})" />
  <circle cx="${cx}" cy="${cy}" r="${glowRadius}" fill="url(#${glowId})" />
  ${rings.join("\n  ")}
  <circle cx="${dx}" cy="${dy}" r="${dotSize}" fill="${palette.accent}" fill-opacity="0.65" />
</svg>
  `.trim();

  return svg;
}
