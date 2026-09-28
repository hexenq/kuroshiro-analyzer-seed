const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");
const { pathToFileURL } = require("node:url");
const { parse } = require("acorn");
const { JSDOM } = require("jsdom");
const installPackedPackage = require("./packed-package.cjs");

// Check that each built entry can run the demonstration; this is not a
// tokenization accuracy test. Detailed starter behavior is tested separately.
async function check(Analyzer, label) {
    assert.equal(typeof Analyzer, "function", label);
    assert.equal(Analyzer.default, Analyzer, label);
    const analyzer = new Analyzer();
    await analyzer.init();
    const text = " 黒白\t黒白\n";
    const tokens = await analyzer.parse(text);
    assert.equal(tokens.map(token => token.surface_form).join(""), text, label);
    assert.equal(tokens.find(token => token.surface_form === "黒白").reading, "クロシロ", label);
}

async function checkPackage(root, metadata) {
    const requirePackage = createRequire(path.join(root, "package.json"));
    // Check lib before the package wrapper can add its default property.
    await check(requirePackage("./lib/index.js"), "legacy lib entry");
    const Analyzer = requirePackage("./index.js");
    await check(Analyzer, "CommonJS entry");
    const imported = await import(pathToFileURL(path.join(root, "index.js")));
    assert.equal(imported.default, Analyzer);
    await check(imported.default, "native ESM default import");
    for (const file of ["dist/kuroshiro-analyzer-seed.js", "dist/kuroshiro-analyzer-seed.min.js"]) {
        const code = fs.readFileSync(path.join(root, file), "utf8");
        parse(code, { ecmaVersion: 2015, sourceType: "script" });
        await check(requirePackage("./" + file), file + " CommonJS");
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
    const browserEntry = path.join(root, metadata.browser);
    parse(fs.readFileSync(browserEntry, "utf8"), { ecmaVersion: 2015, sourceType: "module" });
    await check((await import(pathToFileURL(browserEntry))).default, "browser ESM entry");
}

async function checkBundler(temp, metadata) {
    const entry = path.join(temp, "entry.js");
    fs.writeFileSync(entry, `export { default } from "${metadata.name}";`);
    const { build } = await import("vite");
    const result = await build({
        configFile: false, root: temp, publicDir: false, logLevel: "silent",
        build: {
            target: "es2015", write: false, minify: false,
            lib: { entry, formats: ["iife"], name: "SeedAnalyzer" }
        }
    });
    const outputs = Array.isArray(result) ? result : [result];
    const code = outputs.flatMap(output => output.output).find(file => file.type === "chunk").code;
    parse(code, { ecmaVersion: 2015 });
    const dom = new JSDOM("", { runScripts: "outside-only" });
    try {
        dom.window.eval(`${code}\nwindow.SeedAnalyzer = SeedAnalyzer;`);
        await check(dom.window.SeedAnalyzer, "packed Vite consumer");
    }
    finally { dom.window.close(); }
}

async function main() {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), "seed-package-"));
    try {
        const metadata = installPackedPackage(path.resolve(__dirname, ".."), temp);
        await checkPackage(path.join(temp, "node_modules", metadata.name), metadata);
        await checkBundler(temp, metadata);
        console.log("Packed CommonJS, native ESM, legacy, browser ESM, UMD and Vite consumer checks passed.");
    }
    finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
