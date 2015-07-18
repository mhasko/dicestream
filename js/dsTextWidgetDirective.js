'use strict';

var textWidget = angular.module('textWidget', ['textCardService', 'ui.bootstrap', 'color.picker',]);


textWidget.directive('textWidget', ['config', 'textCardService', function(config, textCardService) {
    return {
        restrict: 'E',
        scope: {
            cardtext: '@',
            textcolor: '@',
            bgcolor: '@',
            index: '@'
        },
        templateUrl: config.filePrefix + 'partials/textWidget.html',
        controller: function($scope){            
            $scope.colorOptionsHidden = true;
            $scope.toggleColors = function() {
                $scope.colorOptionsHidden = !$scope.colorOptionsHidden;
            };
            
            $scope.deleteCard = function() {
                textCardService.deleteCardAt($scope.index);
            };
            
            $scope.$watch(function(scope) { return scope.textcolor },
              function(newValue, oldValue) {
                if(newValue && textCardService.getCardAt($scope.index)) {
                    textCardService.getCardAt($scope.index).textcolor = newValue;
                    textCardService.redrawCardAt($scope.index);
                }
              }
            );
            
            $scope.$watch(function(scope) { return scope.bgcolor },
              function(newValue, oldValue) {
                if(newValue && textCardService.getCardAt($scope.index)) {
                    textCardService.getCardAt($scope.index).bgcolor = newValue;
                    textCardService.redrawCardAt($scope.index);
                }
              }
            );

        },
        link: function(scope, element, attrs) {

        }
    };
}]);
