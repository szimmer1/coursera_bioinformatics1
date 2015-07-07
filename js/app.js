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