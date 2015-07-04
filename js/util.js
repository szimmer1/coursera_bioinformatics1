/**
 * Created by mzimmerman on 7/3/15.
 */

module.exports = {
    /**
     * Assumes callback of form callback([err])
     * @param callback
     */
    error: function(callback) {
        callback(true);
        return "Bad data";
    }
}