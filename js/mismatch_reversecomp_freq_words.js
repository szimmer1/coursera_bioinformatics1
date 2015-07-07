/**
 * Created by mzimmerman on 7/5/15.
 */

var mismatchFreqWords = require('./mismatch_frequent_words').mismatchFreqWords;

var mismatchReversecompFreqWords = function(lines, callback) {
    return mismatchFreqWords(lines, true, callback);
}

module.exports = {
    name: "Frequent Words Allowing Mismatches (d) and Reverse Complements",
    compute: mismatchReversecompFreqWords
}