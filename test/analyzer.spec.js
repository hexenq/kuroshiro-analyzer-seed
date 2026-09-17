import Analyzer from "../src";

// These checks exercise the starter's interface, not Japanese tokenization.
describe("Starter interface", () => {
    let analyzer;
    beforeEach(() => { analyzer = new Analyzer(); });

    it("initializes and rejects repeated initialization", async () => {
        await expect(analyzer.init()).resolves.toBeUndefined();
        await expect(analyzer.init()).rejects.toThrow("already been initialized");
    });

    it("rejects parsing before initialization through a Promise", async () => {
        const pending = analyzer.parse("input");
        expect(typeof pending.then).toBe("function");
        await expect(pending).rejects.toThrow("Initialize");
    });

    it("returns no tokens for empty or omitted input", async () => {
        await analyzer.init();
        await expect(analyzer.parse()).resolves.toEqual([]);
        await expect(analyzer.parse("")).resolves.toEqual([]);
    });

    it.each([null, 1, {}, [], true])("rejects non-string input %p", async (value) => {
        await analyzer.init();
        await expect(analyzer.parse(value)).rejects.toThrow(TypeError);
    });

    it("passes the input to the engine and awaits its result", async () => {
        await analyzer.init();
        const tokens = [{ surface_form: "別", reading: "ベツ" }];
        analyzer._analyzer.analyze = jest.fn(() => Promise.resolve(tokens));
        await expect(analyzer.parse("別")).resolves.toBe(tokens);
        expect(analyzer._analyzer.analyze).toHaveBeenCalledWith("別");
    });

    it.each(["throw", "reject"])("propagates engine failures (%s)", async (kind) => {
        await analyzer.init();
        const error = new Error("engine failed");
        analyzer._analyzer.analyze = () => {
            if (kind === "throw") throw error;
            return Promise.reject(error);
        };
        await expect(analyzer.parse("input")).rejects.toBe(error);
    });
});

// Replace these fixtures when you replace the hardcoded demonstration engine.
// Recognizing only 黒白 is a sample limitation, not a kuroshiro requirement.
describe("Demonstration engine (no dictionary)", () => {
    let analyzer;
    beforeEach(async () => {
        analyzer = new Analyzer();
        await analyzer.init();
    });

    it("returns the documented sample token", async () => {
        await expect(analyzer.parse("黒白")).resolves.toEqual([{
            surface_form: "黒白", pos: "名詞", basic_form: "黒白",
            reading: "クロシロ", pronunciation: "クロシロ"
        }]);
    });

    it.each([" \t\n　", " 黒白\t黒白\n"])("preserves order and whitespace in %p", async (text) => {
        const tokens = await analyzer.parse(text);
        expect(tokens.map(token => token.surface_form).join("")).toBe(text);
        for (const token of tokens.filter(token => /^\s+$/.test(token.surface_form))) {
            expect(token.pos_detail_1).toBe("空白");
        }
    });

    it("rejects unsupported sample input instead of silently discarding it", async () => {
        await expect(analyzer.parse("黒白 日本語")).rejects.toThrow("Replace the sample tokenizer");
    });

    it("does not reuse arrays or tokens that kuroshiro or a caller may mutate", async () => {
        const first = await analyzer.parse("黒白 黒白");
        first[0].reading = "changed";
        first[1].surface_form = "changed";
        const second = await analyzer.parse("黒白 黒白");
        expect(second).not.toBe(first);
        expect(second[0]).not.toBe(first[0]);
        expect(second[0]).not.toBe(second[2]);
        expect(second[0].reading).toBe("クロシロ");
        expect(second.map(token => token.surface_form).join("")).toBe("黒白 黒白");
    });
});
