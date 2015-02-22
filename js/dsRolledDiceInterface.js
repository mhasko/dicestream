'use strict';

var rolledDiceInterface = angular.module('rolledDiceInterface', []);

rolledDiceInterface.directive('rolledDiceInterface', ['$compile', function($compile) {
    return {
        restrict: 'E',
        scope: {
            data: '@'
        },
        templateUrl: 'https://dl.dropbox.com/u/1177409/dicestream/partials/rolledDiceInterface.html'
//        ,controller: function($scope){
            // check if it was defined.  If not - set a default
//            $scope.diecount = $scope.diecount || '0';
//        }
//        ,link: function(scope, element, attrs) {
//            angular.element(document.getElementById('diceDiv')).append($compile(element)(scope));
//            
//            scope.selectDieOverlay = function(){
//                var something = 1;
//            };            
//        }
    };
}]);