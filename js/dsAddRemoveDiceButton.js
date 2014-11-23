'use strict';

var addRemoveDiceButton = angular.module('addRemoveDiceButton', []);

addRemoveDiceButton.directive('addRemoveDiceButton', function() {
    return {
        restrict: 'E',
        scope: {
            text: '@'
        },
        replace: true,
        templateUrl: 'https://dl.dropbox.com/u/1177409/dicestream/partials/addRemoveDiceButton.html',
        controller: function($scope) {
            if($scope.text === '+') {
                $scope.modifyValue = '1';
            } else {
                $scope.modifyValue = '-1';
            }
        },
        link:  function(scope, element, attrs) {
            element.bind('click', function() {
                scope.$apply(function() {
                    return scope.modifyValue;
                });
            });
        }
    }
});