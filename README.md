# @echoes/glyph

Deterministic SVG avatar generator with a dreamy vibe.

- **Deterministic**: same inputs → same SVG output
- **Small + fast**: returns a single SVG string
- **Typed**: TypeScript types included

## Install

```bash
npm i @echoes/glyph
```

## Usage

```ts
import { generateAvatarSvg, getAvailableStyles } from "@echoes/glyph";

const svg = generateAvatarSvg("echoes-user-123", {
  size: 256,
  style: "echoes",
  version: 1,
  variant: 0,
});

console.log(svg);
console.log(getAvailableStyles()); // ["echoes"]
```

### Browser example

```ts
import { generateAvatarSvg } from "@echoes/glyph";

const el = document.getElementById("avatar");
if (!el) throw new Error("Missing #avatar");

el.innerHTML = generateAvatarSvg("echoes-user-123", { size: 128 });
```

## API

### `generateAvatarSvg(seed, options?)`

Generates an SVG string.

- **seed**: non-empty string (required)
- **options**:
  - **size**: number (default: `128`)
  - **style**: string (default: `"echoes"`)
  - **version**: number (default: `1`)
  - **variant**: number (default: `0`)
  - **background**: boolean (currently reserved for later)

Determinism is based on the tuple `(seed, style, version, variant)`.

### `getAvailableStyles()`

Returns a list of registered style names.

## Local development

```bash
# Build to dist/
npm run build

# Run snapshot tests (vitest)
npm test

# Generate avatar.svg in the repo root
npm run preview -- "echoes-user-123"
```

The `preview` script writes `avatar.svg` in the project root using the built `dist/` output.

## License

MIT

