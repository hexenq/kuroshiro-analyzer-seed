<a name="2.0.0-beta.1"></a>
## [2.0.0-beta.1](https://github.com/hexenq/kuroshiro-analyzer-seed/compare/1.1.0...2.0.0-beta.1) (2026-09-28)

### Breaking Changes

* Require Node.js 22 or later and native ES2015 browser support; Internet Explorer is not supported.
* Reject unsupported sample input instead of always returning a `黒白` token. The demonstration engine only recognizes `黒白` and whitespace; empty or omitted input now returns `[]` after initialization.
* Reject non-string input and provide an explicit error when parsing before initialization.

### Features

* Include TypeScript declarations for the constructor, optional token metadata, and `SeedAnalyzer` browser global.
* Provide a browser ESM bundle alongside standalone UMD bundles.

### Fixes

* Preserve token order and whitespace, and return fresh sample tokens for each parse.
* Preserve CommonJS constructor/default imports and native ESM default imports.

### Development

* Modernize build tooling and validate the packed package with Node, browser, Vite, TypeScript, and kuroshiro consumers.
* Run shared source tests in Node and jsdom, and CI on Node.js 22, 24, and 26.

<a name="1.1.0"></a>
## [1.1.0](https://github.com/hexenq/kuroshiro-analyzer-seed/compare/1.0.0...1.1.0) (2018-08-05)

### Build

* modify the name of umd file
