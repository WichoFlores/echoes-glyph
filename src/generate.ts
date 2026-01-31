import { seedToUint32 } from "./seed/hash";
import { createRng } from "./seed/prng";
import { getStyleRenderer } from "./styles/registry";

export type AvatarOptions = {
  size?: number;
  version?: number;
  style?: string;
  variant?: number;
  background?: boolean; // reserved for later
};

export function generateAvatarSvg(seed: string, options: AvatarOptions = {}): string {
  if (typeof seed !== "string" || seed.length === 0) {
    throw new Error("seed must be a non-empty string");
  }

  const size = options.size ?? 128;
  const version = options.version ?? 1;
  const style = options.style ?? "echoes";
  const variant = options.variant ?? 0;

  // Combine inputs into deterministic seed parts
  const a = seedToUint32(seed, `a:${style}:v${version}:var${variant}`);
  const b = seedToUint32(seed, `b:${style}:v${version}:var${variant}`);
  const c = seedToUint32(seed, `c:${style}:v${version}:var${variant}`);
  const d = seedToUint32(seed, `d:${style}:v${version}:var${variant}`);

  const rng = createRng([a, b, c, d]);

  const renderer = getStyleRenderer(style);

  return renderer({
    seed,
    size,
    version,
    style,
    variant,
    rng,
  });
}
