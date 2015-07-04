(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/3/15.
 */

(function(angular) {

    /**
     * CHANGE THIS TO YOUR DESIRED MODULE
     */
    var bio = require('./approx_frequent_words');

    angular.module('app', [])
        .directive('bioinformaticsSolver', function() {
            return {
                restrict: 'AE',
                link: function(scope, ele, attr) {
                    scope.uploadedData = ["No uploaded data yet"];
                    scope.result = "No computation yet performed";
                    scope.computer = {
                        inputs: [],
                        percentUploaded: 0,
                        compute: bio.compute
                    };

                    scope.uploadMessage = {
                        class:"label label-default",
                        text:"Upload not started"
                    };
                    scope.computeMessage = {
                        class:"label label-default",
                        text:"Computation not started"
                    };

                    scope.uploadHandler = function(event) {
                        var uploadError = function(e) {
                            scope.uploadMessage = {
                                class:"label label-danger",
                                text:"Upload failed"
                            };
                            scope.computer.uploadError = true;
                            scope.$apply();
                        }
                        console.log("Registered change in " + event.target);
                        var element = event.target;
                        if (element.type === "text") {
                            scope.uploadedData = element.value;
                            scope.uploadMessage = {
                                class:"label label-success",
                                text:"Upload complete"
                            }
                            scope.$apply();
                        }
                        else if (element.type === "file") {
                            var file = element.files[0];
                            if (!file.type.match("text*")) return uploadError();
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                scope.uploadedData = this.result.split('\n');
                                scope.uploadMessage = {
                                    class:"label label-success",
                                    text:"Upload complete"
                                };

                                // new data, reset compute state
                                scope.computeMessage = {
                                    class:"label label-default",
                                    text:"Computation not started"
                                }
                                scope.computer.percentUploaded = 0;
                                scope.$apply();
                            };
                            reader.onprogress = function(e) {
                                if (scope.computer.percentUploaded === 0) {
                                    scope.uploadMessage = {
                                        class:"label label-warning",
                                        text:"Upload in progress"
                                    };
                                }
                                if (e.lengthComputable) {
                                    scope.computer.percentUploaded = Math.round((e.loaded / e.total) * 100);
                                }
                                scope.$apply();
                            };
                            reader.onerror = uploadError;
                            reader.readAsText(file);
                        }
                    };

                    scope.triggerCompute = function(event) {
                        scope.computeMessage = {
                            class:"label label-warning",
                            text:"Computation in progress"
                        }
                        scope.$apply();
                        try {
                            scope.result = scope.computer.compute(scope.uploadedData, function (err) {
                                if (err) {
                                    scope.computeMessage = {
                                        class: "label label-danger",
                                        text: "Computation error"
                                    }
                                }
                                else {
                                    scope.computeMessage = {
                                        class: "label label-success",
                                        text: "Computation success"
                                    }
                                }
                            })
                        } catch (e) {
                            scope.computeMessage = {
                                class: "label label-danger",
                                text: "Computation error"
                            }
                            console.error(e);
                        }
                        scope.$apply();
                    }

                    var inputs = ele.find('input');
                    scope.computer.inputs = inputs;
                    inputs.bind('change', scope.uploadHandler.bind(scope));

                    var triggerComputation = angular.element("<button ng-click='triggerCompute' class='btn btn-primary'>Compute</button>");
                    triggerComputation.bind('click', scope.triggerCompute.bind(scope));

                    // append button to trigger computation
                    ele.prepend(triggerComputation);

                    // append static title, don't watch for changes
                    ele.prepend("<h1 class='bio-title'>" + bio.name + "</h1>");
                }
            }
        })
        .controller('MainController', ['$scope', function($scope) {
        }])

})(angular || {});
},{"./approx_frequent_words":2}],2:[function(require,module,exports){
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
},{"./approx_patterns":3,"./util":5}],3:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/3/15.
 */

var hammingDistance = require('./hamming_distance').compute;
var error = require('./util').error;

var approxPatterns = function(lines, callback) {
    if (!lines || lines.length && lines.length < 3) return error(callback);

    var pattern = lines[0],
        genome = lines[1],
        d = lines[2];
        res = [];
    if (!pattern || !genome || isNaN(d)) return error(callback);

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
},{"./hamming_distance":4,"./util":5}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}]},{},[1]);
