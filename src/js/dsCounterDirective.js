/**
 * Created by mhasko on 9/20/15.
 */
'use strict';

var dsCounter = angular.module('dsCounter', ['overlayService', 'settingsService']);

dsCounter.directive('dsCounter', ['config', 'overlayService', 'settingsService', function(config, overlayService, current) {
    return {
        restrict: 'E',
        scope: {
            //die: '@',
            //value: '@',
            //url: '@',
            //position: '@'
        },
        templateUrl: config.filePrefix + '/partials/counterInterface.html',
        controller: function($scope, overlayService){
            var overlay;
            $scope.counter = 0;

            $scope.$watch(function(scope) { return scope.counter },
                function(newValue, oldValue) {
                    if(overlay) {
                        overlay.setVisible(false);
                    }

                    var textContext= overlayService.createCounterOverlay(newValue.toString(), '#0099FF');//, .5, 0, 0);
                    overlay = overlayService.createOverlayFromContext(textContext,1,.87,-.38);
                }
            );

        },
        link: function(scope, element, attrs) {
            scope.incCount = function() {
                if(scope.counter < 99) {
                //    scope.diedata.count = 1;
                //} else {
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