/**
 * Starting point for a custom kuroshiro analyzer, NOT a general tokenizer.
 * Replace the sample engine in init() with your tokenizer and field mapping.
 */
class Analyzer {
    constructor() {
        this._analyzer = null;
    }

    /** Initialize resources once. Resolve when parse() is ready to use. */
    init() {
        return Promise.resolve().then(() => {
            if (this._analyzer !== null) {
                throw new Error("This analyzer has already been initialized.");
            }
            // Demonstration only: recognize 黒白 and preserve whitespace.
            // Real adapters should initialize their dictionary/service here.
            this._analyzer = {
                analyze: str => str.split(/(\s+)/).filter(part => part.length > 0).map((part) => {
                    if (/^\s+$/.test(part)) {
                        return { surface_form: part, pos: "記号", pos_detail_1: "空白" };
                    }
                    if (part !== "黒白") {
                        throw new Error("The seed only recognizes 黒白 and whitespace. Replace the sample tokenizer to handle other text.");
                    }
                    return {
                        surface_form: part,
                        pos: "名詞",
                        basic_form: part,
                        reading: "クロシロ",
                        pronunciation: "クロシロ"
                    };
                })
            };
        });
    }

    /**
     * Return a Promise of fresh, ordered tokens without dropping input.
     * @param {string} [str=""] Input text
     * @returns {Promise<Array>} Tokens in kuroshiro's analyzer format
     */
    parse(str = "") {
        // A Promise chain propagates both synchronous engine errors and
        // rejected asynchronous engine results to kuroshiro's caller.
        return Promise.resolve().then(() => {
            if (typeof str !== "string") {
                throw new TypeError("Input must be a string.");
            }
            if (this._analyzer === null) {
                throw new Error("Initialize the analyzer before parsing.");
            }
            if (str.length === 0) return [];
            return this._analyzer.analyze(str);
        });
    }
}

export default Analyzer;
