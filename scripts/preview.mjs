import { writeFileSync } from "node:fs";
import { generateAvatarSvg } from "../dist/index.js";

const seeds = [
  "echoes-user-123",
  "luis",
  "00000000-0000-0000-0000-000000000000",
  "550e8400-e29b-41d4-a716-446655440000",
  "quiet-room",
  "vulnerability",
  "safe-here",
  "11111111-1111-1111-1111-111111111111",
];

// Single SVG file (accepts optional CLI seed)
const seed = process.argv[2] ?? seeds[0];
const svg = generateAvatarSvg(seed, { version: 1, size: 256, style: "echoes" });
writeFileSync("avatar.svg", svg, "utf8");
console.log("Wrote avatar.svg for seed:", seed);

// HTML gallery showing all seeds at multiple sizes
const gallery = seeds
  .map((s) => {
    const large = generateAvatarSvg(s, { version: 1, size: 200, style: "echoes" });
    const small = generateAvatarSvg(s, { version: 1, size: 48, style: "echoes" });
    const encodeLarge = `data:image/svg+xml;base64,${Buffer.from(large).toString("base64")}`;
    const encodeSmall = `data:image/svg+xml;base64,${Buffer.from(small).toString("base64")}`;
    return `
    <div style="text-align:center">
      <img src="${encodeLarge}" width="200" height="200" style="border-radius:50%;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <div style="margin-top:12px">
        <img src="${encodeSmall}" width="48" height="48" style="border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <img src="${encodeSmall}" width="32" height="32" style="border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-left:8px">
      </div>
      <p style="font-family:'DM Sans',system-ui,sans-serif;color:#666;font-size:12px;margin-top:8px">${s}</p>
    </div>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html>
<head>
  <title>Glyph Preview</title>
  <style>
    body {
      background: #f5f7f5;
      padding: 48px 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 36px;
      justify-content: center;
      font-family: 'DM Sans', system-ui, sans-serif;
    }
    h1 {
      width: 100%;
      text-align: center;
      font-family: 'Lora', Georgia, serif;
      color: #3a5a42;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
  </style>
</head>
<body>
  <h1>Echoes Glyph Avatars</h1>
  ${gallery}
</body>
</html>`;

writeFileSync("preview.html", html, "utf8");
console.log("Wrote preview.html with", seeds.length, "avatars");
