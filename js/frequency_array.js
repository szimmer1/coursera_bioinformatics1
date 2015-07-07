/**
 * Created by mzimmerman on 7/4/15.
 */

var hammingDistance = require('./hamming_distance').compute;
var bioUtil = require('./bio_util');

var patternToInt = bioUtil.patternToInt,
    intToPattern = bioUtil.intToPattern

function suffix(pattern) {
    return pattern && pattern.slice(1);
}

/**
 * Generator fn of possible patterns
 * @param pattern
 * @param d
 * @return null if error, generator
 */
var neighbors = function(pattern, d) {
    if (d === 0) {
        return [pattern]
    }
    else if (pattern.length === 1) {
        return ['A','C','T','G']
    }
    var neighborhood = [],
        suffixNeighborhood = neighbors(suffix(pattern),d);
    _.each(suffixNeighborhood, function(suff) {
        if (hammingDistance([suff, suffix(pattern)], function(){}) < d) {
            _.each(['A','C','T','G'], function(base) {
                neighborhood.push(base+suff);
            })
        }
        else {
            neighborhood.push(pattern[0]+suff)
        }
    })
    return neighborhood;
}

var findNeighbors = function(lines, callback) {
    if (!lines || lines.length < 2) return callback(true);
    var pattern = lines[0],
        d = parseInt(lines[1]);
    var A = neighbors(pattern,d);
    return [A, A.length ]
}

module.exports = {
    name: "Frequency Array and Approximate Neighbors Fns",
    neighbors: neighbors,
    compute: findNeighbors
}