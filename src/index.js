class Analyzer {
    constructor() {
        this.isInitialized = false;
        // Variable Statement
        // ...
        //  if(isNode) { ... }
        //  else { ... }
        // ...
    }

    init(callback = () => {}) {
        if (this.isInitialized == false) {
            // Initialize the analyzer
            // ...
            // When finished, call back
            this.isInitialized = true;
            callback();
        } else {
            callback(new Error("This analyzer has already been initialized."));
        }
    }

    /**
     * Parse the input string
     * @param {*} str input string
     * @param {*} callback callback function invoked after parsing
     * @example output
     * {
     *     surface_form: '黒白',    // [Required] 表層形
     *     pos: '名詞',               // 品詞 (part of speech)
     *     pos_detail_1: '一般',      // 品詞細分類1
     *     pos_detail_2: '*',        // 品詞細分類2
     *     pos_detail_3: '*',        // 品詞細分類3
     *     conjugated_type: '*',     // 活用型
     *     conjugated_form: '*',     // 活用形
     *     basic_form: '黒白',      // 基本形
     *     reading: 'クロシロ',       // [Required] 読み
     *     pronunciation: 'クロシロ'  // 発音
     * }
     */
    parse(str = "", callback = () => {}) {
        // Parse the input string
        // ...
        callback(null, {
            surface_form: '黒白',
            reading: 'クロシロ'
        });
    }
}

export default Analyzer;