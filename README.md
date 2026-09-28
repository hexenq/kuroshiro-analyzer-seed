# kuroshiro-analyzer-seed

[![CI](https://github.com/hexenq/kuroshiro-analyzer-seed/actions/workflows/ci.yml/badge.svg)](https://github.com/hexenq/kuroshiro-analyzer-seed/actions/workflows/ci.yml)

A starting point for creating a custom analyzer for [kuroshiro](https://github.com/hexenq/kuroshiro), not a production Japanese tokenizer.

The sample only recognizes `黒白` and whitespace; other non-empty input is rejected. Replace the sample engine before using it in an application.

## Install

```sh
npm install kuroshiro-analyzer-seed@beta
```

The stable 1.x release remains available without the `@beta` tag.

Version 2 requires Node.js 22+ or a browser with native ES2015 support, including Promises. Internet Explorer is not supported. Platform support for a custom analyzer also depends on your chosen tokenizer.

## Usage

```js
import SeedAnalyzer from "kuroshiro-analyzer-seed";

const analyzer = new SeedAnalyzer();
await analyzer.init();
const tokens = await analyzer.parse(" 黒白\n");
```

CommonJS constructor imports are also supported:

```js
const SeedAnalyzer = require("kuroshiro-analyzer-seed");
```

To use the sample with a kuroshiro instance, pass a fresh analyzer to `await kuroshiro.init(new SeedAnalyzer())`; then `await kuroshiro.convert("黒白")` returns `くろしろ`. The package is tested with kuroshiro 1.x and the maintained 2.x core.

Browser bundlers can import the package normally. For a standalone browser setup, load `dist/kuroshiro-analyzer-seed.min.js` to expose the `SeedAnalyzer` constructor. `dist/kuroshiro-analyzer-seed.mjs` also provides a browser ESM default export.

### TypeScript

The 2.0 prerelease includes declarations; published 1.x releases do not.

```ts
import SeedAnalyzer from "kuroshiro-analyzer-seed";

const analyzer = new SeedAnalyzer();
await analyzer.init();
const tokens: SeedAnalyzer.Token[] = await analyzer.parse("黒白 ");
const readings = tokens.map(token => token.reading ?? token.surface_form);
```

Whitespace tokens have no reading. All metadata except `surface_form` is optional in the starter interface; adapt the declarations alongside your tokenizer.

For TypeScript compiled to CommonJS, use a default import with interop enabled (the default in TypeScript 7), or `import SeedAnalyzer = require("kuroshiro-analyzer-seed")`. Native Node ESM and bundler module resolution also support the default import. Non-module browser scripts can reference the package types for the `SeedAnalyzer` global; load the actual UMD script separately.

### Migrating from 1.x

Version 2 raises the runtime requirements listed above. The sample now preserves whitespace and returns fresh tokens on every call. It rejects unsupported input instead of returning unrelated sample tokens or discarding text. Parsing before initialization, non-string input, and repeated initialization reject through Promises. Empty or omitted input returns `[]` after initialization.

CommonJS constructor/default imports, native ESM default imports, the `SeedAnalyzer` browser global, and the asynchronous `init()` / `parse()` API remain available.

## Building your own analyzer

Replace the sample engine in `src/index.js` with your tokenizer and map its output to kuroshiro tokens. Before publishing your own analyzer, update the package metadata, declarations, browser global, output filenames and related tests.

- `init(): Promise<void>`: initialize the tokenizer; reject on failure.
- `parse(text): Promise<Token[]>`: return tokens in input order, preserving whitespace; return `[]` for empty input after initialization.

Each token needs a `surface_form`. Supply kana readings for Japanese tokens, for example:

```js
{
    surface_form: "黒白",
    pos: "名詞",
    reading: "クロシロ",
    pronunciation: "クロシロ"
}
```

Return fresh token objects on each call, since kuroshiro may modify them during conversion. See the comments on `parse()` in `src/index.js` for the full token field and whitespace examples.

## Development

Use Node.js 22.22.2+ on the 22.x line, 24.15.0+ on the 24.x line, or 26+ for development. These requirements are separate from the published library's Node.js 22+ runtime requirement.

```sh
npm ci
npm test
npm pack --dry-run
```

- `npm test`: run lint, shared Node/jsdom source tests, builds, packed-package import checks, TypeScript checks and integration tests with kuroshiro 1.x.
- `npm run build`: build CommonJS, browser ESM and standalone UMD bundles.
- `npm run test:types`: check editor configuration and packed declarations in CommonJS, native ESM, bundler and browser-global consumers using TypeScript 7.0.2.
- `KUROSHIRO_PACKAGE=/absolute/path/to/built/kuroshiro npm run test:joint`: test another built core package; CI also checks a pinned maintained core revision.

The package checks build a Vite consumer from the actual npm tarball. Browser output explicitly targets ES2015 and is exercised in jsdom; these checks do not replace testing in actual browsers. Tests cover the starter interface and demonstration engine, not real Japanese tokenization. Replace the sample fixtures with tests for your chosen tokenizer.

Edit source files rather than generated `lib/` or `dist/` files. `npm pack` rebuilds the package automatically. Use `npm install <package>` or `npm uninstall <package>` for intentional dependency changes and include the lockfile. Keep `.babelrc`; leave version changes to release preparation. Write commits in English using Conventional Commits.
