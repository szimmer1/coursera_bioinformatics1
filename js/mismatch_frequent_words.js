/**
 * Created by mzimmerman on 7/4/15.
 */

var freqArrayFns = require('./frequency_array'),
    approximatePatternCount = require('./approx_frequent_words').compute;
var patternToInt = freqArrayFns.patternToInt,
    intToPattern = freqArrayFns.intToPattern,
    neighbors = freqArrayFns.neighbors;

var f = function(lines, callback) {
    debugger;
    if (!lines || lines.length && lines.length < 2) return error(callback);
    try {
        var genome = lines[0],
            kd = lines[1].split(' ').map(function (n) {
                return parseInt(n)
            });
        var k = kd[0],
            d = kd[1]
    } catch (e) {
        callback(true);
        return "Bad data"
    }
    debugger;
    var fArray = new Array(Math.pow(4,k)),
        closeA = new Array(Math.pow(4,k)),
        maxFreq = 0,
        freqPatterns = [];
    //initialize arrays to 0
    for (var i = 0; i < fArray.length; i++) {
        fArray[i] = closeA[i] = 0;
    }
    //iterate through windows and calculate close indeces
    var neighborA, substr;
    for (var i = 0; i < genome.length - k + 1; i++) {
        substr = genome.slice(i,i+k);
        neighborA = neighbors(substr,d);
        _.each(neighborA, function(neighbor) {
            closeA[patternToInt(neighbor)] = 1;
        })
    }
    //iterate through close array and calculate approxPatternCount for neighbor k-mers
    for (var i = 0; i < closeA.length; i++) {
        if (closeA[i] === 1) {
            fArray[i] = approximatePatternCount([intToPattern(i,k),genome,d], callback);
            if (fArray[i] > maxFreq) maxFreq = fArray[i];
        }
    }
    //aggregate most frequent patterns
    for (var i = 0; i < fArray.length; i++) {
        if (fArray[i] === maxFreq) {
            freqPatterns.push(intToPattern(i,k))
        }
    }
    callback();
    return freqPatterns;
}

module.exports = {
    name: "Frequent Words with Mismatches",
    compute: f
}