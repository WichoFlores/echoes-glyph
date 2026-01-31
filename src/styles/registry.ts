import { renderEchoes } from "./echoes/style";

export type RenderContext = {
  seed: string;
  size: number;
  version: number;
  style: string;
  variant: number;
  rng: {
    next: () => number;
    int: (min: number, max: number) => number;
    pick: <T>(arr: readonly T[]) => T;
  };
};

export type StyleRenderer = (ctx: RenderContext) => string;

const registry: Record<string, StyleRenderer> = {
  echoes: renderEchoes,
};

export function getStyleRenderer(style: string): StyleRenderer {
  const renderer = registry[style];
  if (!renderer) throw new Error(`Unknown avatar style: ${style}`);
  return renderer;
}

export function getAvailableStyles(): string[] {
  return Object.keys(registry);
}
