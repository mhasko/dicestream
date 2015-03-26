'use strict';

var diceButton = angular.module('diceButton', ['diceService']);

diceButton.directive('diceButton', ['diceService', function(dsDiceService) {
    return {
        restrict: 'E',
        scope: {
            id: '@dieid',
            side: '@sides',
            imageroot: '@',
            dieimage: '@'//+dieside+'.png'
        },
        templateUrl: 'https://dl.dropbox.com/u/1177409/dicestream/partials/diceButton.html',
        controller: function($scope){
            // 'register' with the dice service so what ever die this button
            // is tracking can have its data backed in the service.
            dsDiceService.setDice($scope.id, $scope.side, 0, $scope.imageroot);
            // bind the diedata value to the matching value in the diceService.  
            $scope.diedata = dsDiceService.getGuiDiceArray()[$scope.id];
            
        },
        link: function(scope, element, attrs) {

            scope.incDieCount = function() {
                if(scope.diedata.count < 99) {
                    if(scope.diedata.count == 0) {
                        scope.diedata.count = 1;
                    } else {
                        scope.diedata.count += 1;
                    }
                }
            };
            
            scope.decDieCount = function() {
                if(scope.diedata.count > 0) {
                    scope.diedata.count -= 1;
                }  
            };
        }
    };
}]);