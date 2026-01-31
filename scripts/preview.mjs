import { writeFileSync } from "node:fs";
import { generateAvatarSvg } from "../dist/index.js";

const seed = process.argv[2] ?? "echoes-user-123";
const svg = generateAvatarSvg(seed, { version: 1, size: 256, style: "echoes" });

writeFileSync("avatar.svg", svg, "utf8");
console.log("Wrote avatar.svg for seed:", seed);
