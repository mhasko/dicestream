'use strict';

var diceButton = angular.module('diceButton', ['diceService']);

diceButton.directive('diceButton', ['diceService', function(dsDiceService) {
    return {
        restrict: 'E',
        scope: {
            dieside: '@die',
            side: '@',
            diecount: '=?'
        },
        templateUrl: 'https://dl.dropbox.com/u/1177409/dicestream/partials/diceButton.html',
        controller: function($scope){
            dsDiceService.setDice('d'+$scope.dieside, $scope.dieside, 0);
            // bind the diedata value to the matching value in the diceService.  
            $scope.diedata = dsDiceService.getGuiDiceArray()['d'+$scope.dieside];
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