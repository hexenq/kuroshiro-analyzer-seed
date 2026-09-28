import SeedAnalyzer from "kuroshiro-analyzer-seed";

const analyzer = new SeedAnalyzer();
async function check() {
    await analyzer.init();
    const tokens: SeedAnalyzer.Token[] = await analyzer.parse("黒白");
    if (tokens.map(token => token.reading ?? token.surface_form).join("") !== "クロシロ") {
        throw new Error("Invalid native ESM analyzer");
    }
}
void check();
