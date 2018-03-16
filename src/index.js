/**
 * Check where we are
 * @returns {boolean} if we are in node.js
 */
var isNode = function () {
    try { return this === global; } catch (e) { return false; }
};

function Analyzer({ dicPath } = {}) {
    this._analyzer = null;

    // Variable Statement
    // ...
    //  if(isNode()) { ... }
    //  else { ... }
    // ...
}

Analyzer.prototype.init = function (callback) {
    let self = this;
    if (this._analyzer == null) {
        kuromoji.builder({ dicPath: this._dicPath }).build(function (err, newAnalyzer) {
            if (err)
                return callback(err);

            self._analyzer = newAnalyzer;
            callback();
        });
    } else {
        callback(new Error("This analyzer has already been initialized."));
    }
};

Analyzer.prototype.parse = function (str, callback) {
    if (str.trim() == "") return callback(null, str);
    callback(null, this._analyzer.tokenize(str));
};

export default Analyzer;