export type Rng = {
  next: () => number; // [0, 1)
  int: (min: number, max: number) => number; // inclusive
  pick: <T>(arr: readonly T[]) => T;
};

export function sfc32(a: number, b: number, c: number, d: number): () => number {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    const out = (t + d) | 0;
    c = (c + out) | 0;
    return (out >>> 0) / 4294967296;
  };
}

export function createRng(seedParts: [number, number, number, number]): Rng {
  const rand = sfc32(seedParts[0], seedParts[1], seedParts[2], seedParts[3]);

  return {
    next: () => rand(),
    int: (min: number, max: number) => {
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        throw new Error("int bounds must be finite");
      }
      if (max < min) [min, max] = [max, min];
      const n = Math.floor(rand() * (max - min + 1)) + min;
      return n;
    },
    pick: <T>(arr: readonly T[]) => {
      if (arr.length === 0) throw new Error("cannot pick from empty array");
      return arr[Math.floor(rand() * arr.length)];
    },
  };
}
