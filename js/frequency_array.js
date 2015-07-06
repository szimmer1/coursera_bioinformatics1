/**
 * Created by mzimmerman on 7/4/15.
 */

var hammingDistance = require('./hamming_distance').compute;

var bases = ['A','C','G','T'];

var patternToInt = function(pattern) {
    var res = 0;
    for (var i = 0; i < pattern.length; i++) {
        res += bases.indexOf(pattern[pattern.length - i] * Math.pow(4,i));
    }
    return res;
}

var intToPattern = function(n) {
    
}

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

module.exports = {
    name: "Frequency Array and Approximate Neighbors Fns",
    intToPattern: intToPattern,
    patternToInt: patternToInt,
    neighbors: neighbors
}