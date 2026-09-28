import SeedAnalyzer = require("kuroshiro-analyzer-seed");

const analyzer = new SeedAnalyzer();
const legacy: SeedAnalyzer = new SeedAnalyzer.default();

async function check() {
    const initialized: Promise<void> = analyzer.init();
    await initialized;
    const tokens: SeedAnalyzer.Token[] = await analyzer.parse(" 黒白\t黒白\n");
    if (tokens.map(token => token.surface_form).join("") !== " 黒白\t黒白\n") {
        throw new Error("Expected ordered tokens with whitespace");
    }
    if (tokens[0].reading !== undefined || tokens[1].reading !== "クロシロ") {
        throw new Error("Invalid sample readings");
    }
    if ((await analyzer.parse()).length) throw new Error("Expected empty parse");
}
void check();

function invalid(token: SeedAnalyzer.Token) {
    // @ts-expect-error The sample constructor has no options.
    new SeedAnalyzer({ dictPath: "dict/" });
    // @ts-expect-error parse accepts strings.
    analyzer.parse(1);
    // @ts-expect-error Parsing is asynchronous.
    const tokens: SeedAnalyzer.Token[] = analyzer.parse("黒白");
    // @ts-expect-error Whitespace tokens have no reading.
    const reading: string = token.reading;
    // @ts-expect-error Metadata is optional.
    const basic: string = token.basic_form;
    // @ts-expect-error Every token must have a surface form.
    const missing: SeedAnalyzer.Token = { reading: "クロシロ" };
    // @ts-expect-error Token fields are typed.
    const surface: number = token.surface_form;
}
