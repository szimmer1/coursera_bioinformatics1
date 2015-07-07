(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/3/15.
 */

(function(angular) {

    /**
     * CHANGE THIS TO YOUR DESIRED MODULE
     */
    var bio = require('./frequency_array');

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
},{"./frequency_array":3}],2:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/5/15.
 */
var bases = ['A','C','G','T'],
    compBases = {
        A:'T',
        T:'A',
        G:'C',
        C:'G'
    }

var reverseComplement = function(pattern) {
    var res = "";
    for (var i = 0; i < pattern.length; i++) {
        res = compBases[pattern[i]] + res;
    }
    return res;
}

var patternToInt = function(pattern) {
    var res = 0;
    for (var i = 0; i < pattern.length; i++) {
        res += bases.indexOf(pattern[pattern.length - i - 1]) * Math.pow(4,i);
    }
    return res;
}

var intToPattern = function(n,k) {
    var res = "",
        base;
    for (var i = 0; i < k; i++) {
        base = bases[Math.floor(n / Math.pow(4,i)) % 4] || 'A';
        res = base + res;
    }
    return res;
}

module.exports = {
    reverseComp: reverseComplement,
    intToPattern: intToPattern,
    patternToInt: patternToInt
}
},{}],3:[function(require,module,exports){
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
},{"./bio_util":2,"./hamming_distance":4}],4:[function(require,module,exports){
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
},{}]},{},[1]);
