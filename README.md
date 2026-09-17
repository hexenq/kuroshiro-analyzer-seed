# kuroshiro-analyzer-seed

A starting point for creating a custom analyzer for [kuroshiro](https://github.com/hexenq/kuroshiro), not a production Japanese tokenizer.

The sample only recognizes `黒白` and whitespace; other non-empty input is rejected. Replace the sample engine before using it in an application. These maintenance changes are not yet published to npm.

## Getting started

Use Node.js 22.13+ (22.x) or 24+ for development.

```bash
npm ci
npm test
```

Replace the sample engine in `src/index.js` with your tokenizer and map its output to kuroshiro tokens. Before publishing your own analyzer, update the package metadata, browser global, output filenames and related tests. Platform support depends on your chosen tokenizer.

## Analyzer interface

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

Return fresh token objects on each call, since kuroshiro may modify them during conversion.

## Development

- `npm test`: run lint, shared Node/jsdom tests, builds, package checks and integration tests with kuroshiro.
- `npm run build`: build CommonJS and browser UMD bundles.
- `npm pack --dry-run`: inspect the publishable package.

Edit source files rather than generated `lib/` or `dist/` files.
