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
     *
     * Map your tokenizer's output to the fields below. Only surface_form and
     * reading (for Japanese tokens) are required; other fields are metadata
     * to supply when available. The sample engine does not use a dictionary.
     *
     * @example Japanese token with optional metadata
     * [{
     *     surface_form: "黒白",       // [Required] 表層形 (original text)
     *     pos: "名詞",                // 品詞 (part of speech)
     *     pos_detail_1: "一般",       // 品詞細分類1
     *     pos_detail_2: "*",          // 品詞細分類2
     *     pos_detail_3: "*",          // 品詞細分類3
     *     conjugated_type: "*",       // 活用型 (conjugation type)
     *     conjugated_form: "*",       // 活用形 (conjugation form)
     *     basic_form: "黒白",         // 基本形 (base form)
     *     reading: "クロシロ",        // [Required for Japanese tokens] 読み
     *     pronunciation: "クロシロ",  // 発音 (pronunciation)
     *     verbose: {}                 // Additional engine-specific data
     * }]
     *
     * @example Whitespace token (no reading required)
     * [{
     *     surface_form: " ",
     *     pos: "記号",
     *     pos_detail_1: "空白",
     *     pos_detail_2: "*",
     *     pos_detail_3: "*",
     *     conjugated_type: "*",
     *     conjugated_form: "*",
     *     basic_form: "*"
     * }]
     *
     * Preserve token order and whitespace so surface_form values reconstruct
     * the input. Return fresh arrays and objects: kuroshiro may modify them.
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
