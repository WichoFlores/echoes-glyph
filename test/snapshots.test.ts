import { describe, it, expect } from "vitest";
import { generateAvatarSvg } from "../src";

describe("snapshots", () => {
  it("echoes style v1 snapshots", () => {
    const seeds = [
      "00000000-0000-0000-0000-000000000000",
      "11111111-1111-1111-1111-111111111111",
      "luis",
      "echoes-user-123",
      "550e8400-e29b-41d4-a716-446655440000",
    ];

    const svgs = seeds.map((seed) =>
      generateAvatarSvg(seed, { version: 1, size: 128, style: "echoes" })
    );

    expect(svgs).toMatchSnapshot();
  });
});
