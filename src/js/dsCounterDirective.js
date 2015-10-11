/**
 * Created by mhasko on 9/20/15.
 */
'use strict';

var dsCounter = angular.module('dsCounter', ['overlayService', 'settingsService']);

dsCounter.directive('dsCounter', ['config', 'overlayService', 'settingsService', function(config, overlayService, current) {
    return {
        restrict: 'E',
        scope: {
            //showChecked: '=',
            //counterColor: '='
        },
        templateUrl: config.filePrefix + '/partials/counterInterface.html',
        controller: function($scope, overlayService){
            var overlay;
            $scope.showCounter = true;
            //$scope.counterColor
            $scope.counter = 0;

            $scope.$watch(function(scope) { return scope.counter },
                function(newValue, oldValue) {
                    redrawCounter(newValue.toString(), $scope.counterColor);
                }
            );

            $scope.$watch(function(scope) { return scope.counterColor},
                function(newValue, oldValue) {
                    //if(newValue) {
                        redrawCounter($scope.counter.toString(), newValue);
                    //}
                }
            );

            var redrawCounter = function(text, color) {
                if(overlay) {
                    overlay.setVisible(false);
                }

                var textContext= overlayService.createCounterOverlay(text, color);
                overlay = overlayService.createOverlayFromContext(textContext,1,.87,-.38);
            }

            $scope.toggleCounter = function() {
                overlay.setVisible($scope.showCounter);
            }
        },
        link: function(scope, element, attrs) {
            scope.incCount = function() {
                if(scope.counter < 99) {
                    scope.counter += 1;
                }
            };

            scope.decCount = function() {
                if(scope.counter > 0) {
                    scope.counter -= 1;
                }
            };
        }
    };
}]);