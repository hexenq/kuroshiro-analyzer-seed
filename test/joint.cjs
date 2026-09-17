const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { JSDOM } = require("jsdom");

// Accept another built core package directory for release/integration checks.
const corePackage = process.env.KUROSHIRO_PACKAGE || "kuroshiro";
const coreEntry = require.resolve(corePackage);
const coreRoot = path.dirname(require.resolve(corePackage + "/package.json"));
function constructorOf(value) {
    while (typeof value !== "function" && value && value.default) value = value.default;
    assert.equal(typeof value, "function");
    return value;
}
// Feed known sample tokens through the real core to check adapter integration.
// No dictionary is involved; this does not validate Japanese tokenization.
async function check(Core, Analyzer, label) {
    const core = new (constructorOf(Core))();
    await core.init(new (constructorOf(Analyzer))());
    assert.equal(await core.convert("黒白"), "くろしろ", label);
    assert.equal(await core.convert(" 黒白\t黒白\n"), " くろしろ\tくろしろ\n", label);
    assert.equal(await core.convert("黒白", { to: "katakana" }), "クロシロ", label);
    for (const system of ["hepburn", "passport", "nippon"]) {
        assert.equal(await core.convert("黒白", { to: "romaji", romajiSystem: system }),
            system === "nippon" ? "kurosiro" : "kuroshiro", label);
    }
    assert.equal(await core.convert("黒白", { mode: "spaced" }), "くろしろ", label);
    assert.equal(await core.convert("黒白", { mode: "okurigana" }), "黒白(くろしろ)", label);
    assert.equal(await core.convert("黒白", { mode: "furigana" }),
        "<ruby>黒白<rp>(</rp><rt>くろしろ</rt><rp>)</rp></ruby>", label);
    assert.equal(await core.convert(""), "", label);
    // Conversion mutates tokens; subsequent parses must still have correct readings.
    assert.equal(await core.convert("黒白", { to: "romaji" }), "kuroshiro", label);
}
async function main() {
    await check(require(coreEntry), require(".."), "CommonJS");
    await check(await import(pathToFileURL(coreEntry).href), await import("../index.js"), "native ESM");
    for (const suffix of [".js", ".min.js"]) {
        const dom = new JSDOM("", { runScripts: "outside-only" });
        try {
            dom.window.eval(fs.readFileSync(path.join(coreRoot, "dist/kuroshiro" + suffix), "utf8"));
            dom.window.eval(fs.readFileSync(path.join(__dirname, "../dist/kuroshiro-analyzer-seed" + suffix), "utf8"));
            await check(dom.window.Kuroshiro, dom.window.SeedAnalyzer, "browser " + suffix);
        }
        finally { dom.window.close(); }
    }
    console.log("Seed integration passed with core at " + coreRoot);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
