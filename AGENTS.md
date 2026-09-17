# Repository Guidance

- This is a starter template, not a production morphological analyzer. Keep sample limitations explicit.
- Preserve Promise-based init()/parse(), token order and whitespace, and return fresh token objects.
- Preserve CommonJS constructor/default imports, native ESM default imports and the SeedAnalyzer browser global.
- Retain .babelrc. Edit source and configuration, not generated lib/ or dist/.
- Use npm ci for an unchanged lockfile; use npm install/uninstall for intentional dependency changes.
- Run npm test and npm pack --dry-run. The shared source tests must run in both Node and jsdom.
- Test generated browser bundles and integration with kuroshiro, not only mocked tokenizers.
- Keep development-tool requirements separate from runtime compatibility. Do not bump versions until release preparation.
- Write English Conventional Commits.
