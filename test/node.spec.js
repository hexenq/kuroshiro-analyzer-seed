/**
 * @jest-environment node
 */

import Analyzer from "../src";

describe("kuroshiro-analyzer-seed Node Test", () => {
    const EXAMPLE_TEXT = "すもももももも";

    let analyzer;

    it("Initialization", async (done) => {
        analyzer = new Analyzer();
        await analyzer.init();
        done();
    });

    it("Repeated Initialization", async (done) => {
        analyzer = new Analyzer();
        try {
            await analyzer.init();
            await analyzer.init();
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });

    it("Parse Sentence", async (done) => {
        analyzer = new Analyzer();
        await analyzer.init();

        const ori = EXAMPLE_TEXT;
        analyzer.parse(ori)
            .then((result) => {
                // console.debug(result);
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(1);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("Parse Null", async (done) => {
        analyzer = new Analyzer();
        await analyzer.init();

        analyzer.parse()
            .then((result) => {
                // console.debug(result);
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(1);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
