/**
 * Created by mzimmerman on 7/4/15.
 */

var error = require('./util').error,
    count = require('./approx_patterns').compute;

var approxPatternCount = function(lines, callback) {
    if (!lines || lines.length && lines.length < 3) return error(callback);
    return count(lines, callback).length;
}

module.exports = {
    name: "Approximate Pattern Count",
    compute: approxPatternCount
}