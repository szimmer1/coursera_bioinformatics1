/**
 * Created by mzimmerman on 7/6/15.
 */

/**
 * @param genome
 * @return [indeces i s.t. genome[i] = index of max skew]
 */
var maxSkew = function(lines, callback) {
    var genome = lines[0];
    var skew = 0,
        maxSkew = Number.MIN_VALUE,
        maxSkews = [];
    for (var i = 0; i < genome.length; i++) {
        switch (genome[i]) {
            case 'C':
                skew -= 1;
                break;
            case 'G':
                skew += 1;
                break;
            default:
                break;
        }
        if (skew > maxSkew) {
            maxSkew = skew;
            maxSkews = [i];
        }
        else if (skew === maxSkew) {
            maxSkews.push(i);
        }
    }
    callback();
    return maxSkews;
}

module.exports = {
    name: "Max Skew",
    compute: maxSkew
}