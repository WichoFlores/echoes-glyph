import { describe, it, expect } from "vitest";
import { generateAvatarSvg } from "../src";

describe("determinism", () => {
  it("returns identical SVG for same input", () => {
    const a = generateAvatarSvg("user-123", { version: 1 });
    const b = generateAvatarSvg("user-123", { version: 1 });

    expect(a).toBe(b);
  });

  it("changes output when version changes", () => {
    const v1 = generateAvatarSvg("user-123", { version: 1 });
    const v2 = generateAvatarSvg("user-123", { version: 2 });

    expect(v1).not.toBe(v2);
  });
});
