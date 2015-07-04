/**
 * Created by mzimmerman on 7/3/15.
 */

var hammingDistance = require('./hamming_distance').compute;
var error = require('./util').error;

var approxPatterns = function(lines, callback) {
    if (!lines || lines.length && lines.length < 3) return error();

    var pattern = lines[0],
        genome = lines[1],
        d = lines[2];
        res = [];
    if (!pattern || !genome || isNaN(d)) return error();

    for (var i = 0; i < genome.length - pattern.length + 1; i++) {
        var genomeSlice = genome.slice(i,i+pattern.length);
        if (hammingDistance([genomeSlice, pattern], callback) <= parseInt(d)) res.push(i);
    }
    return res;
}

module.exports = {
    name : "Approximate Patterns in a String",
    compute : approxPatterns
}