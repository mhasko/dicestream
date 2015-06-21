'use strict';

var textWidget = angular.module('textWidget', ['textCardService']);


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
            
            $scope.deleteCard = function() {
                textCardService.deleteCardAt($scope.index);
            };
        },
        link: function(scope, element, attrs) {

        }
    };
}]);