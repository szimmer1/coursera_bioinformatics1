/**
 * Created by mzimmerman on 7/3/15.
 */

/**
 * compute fn should call callback(true) if error occurs, and
 *      return the appropriate error message, otherwise
 *      call callback(null)
 * @param lines {Array}
 * @param callback {Function}
 * @returns {string}
 */
var hammond_distance = function(lines, callback) {
    if (!lines || lines.length < 2) {
        callback(true);
        return "Bad data passed";
    }
    var str1 = lines[0];
    var str2 = lines[1];
    if (str1.length !== str2.length) {
        callback(true);
        return "Genome lengths unequal";
    }
    var res = 0;
    for (var i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) res++;
    }
    callback();
    return res;
}

module.exports = {
    name: "Hamming Distance",
    compute: hammond_distance
}