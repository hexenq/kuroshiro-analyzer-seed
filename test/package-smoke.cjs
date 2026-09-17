const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { parse } = require("acorn");
const { JSDOM } = require("jsdom");

async function check(Analyzer, label) {
    assert.equal(typeof Analyzer, "function", label);
    assert.equal(Analyzer.default, Analyzer, label);
    const analyzer = new Analyzer();
    await assert.rejects(analyzer.parse("黒白"), /Initialize/, label);
    await analyzer.init();
    assert.equal(JSON.stringify(await analyzer.parse()), "[]", label);
    const text = " 黒白\t黒白\n";
    const tokens = await analyzer.parse(text);
    assert.equal(tokens.map(token => token.surface_form).join(""), text, label);
    assert.equal(tokens.find(token => token.surface_form === "黒白").reading, "クロシロ", label);
    await assert.rejects(analyzer.parse("日本語"), /Replace the sample tokenizer/, label);
    await assert.rejects(analyzer.init(), /already been initialized/, label);
}

async function main() {
    const Analyzer = require("..");
    await check(Analyzer, "CommonJS entry");
    await check(require("../lib/index.js"), "legacy lib entry");
    const imported = await import("../index.js");
    assert.equal(imported.default, Analyzer);
    await check(imported.default, "native ESM default import");
    for (const file of ["dist/kuroshiro-analyzer-seed.js", "dist/kuroshiro-analyzer-seed.min.js"]) {
        const code = fs.readFileSync(file, "utf8");
        parse(code, { ecmaVersion: 2015, sourceType: "script" });
        await check(require("../" + file), file + " CommonJS");
        for (const alias of ["window", "self", "global"]) {
            const context = {};
            context[alias] = context;
            vm.runInNewContext(code, context);
            await check(context.SeedAnalyzer, file + " " + alias);
        }
        const bare = { globalThis: undefined };
        vm.runInNewContext(code, bare);
        await check(bare.SeedAnalyzer, file + " without globalThis");
        let amd;
        const context = {
            define: Object.assign((dependencies, factory) => {
                assert.equal(dependencies.length, 0);
                amd = factory();
            }, { amd: {} })
        };
        vm.runInNewContext(code, context);
        await check(amd, file + " AMD");
        const dom = new JSDOM("", { runScripts: "outside-only" });
        try {
            dom.window.eval(code);
            await check(dom.window.SeedAnalyzer, file + " DOM window");
        }
        finally { dom.window.close(); }
    }
    console.log("CommonJS, native ESM, legacy entry and both UMD bundles passed.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
