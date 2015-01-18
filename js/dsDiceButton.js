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
            // check if it was defined.  If not - set a default
            $scope.diecount = $scope.diecount || '0';
        },
        link: function(scope, element, attrs) {

            scope.incDieCount = function() {
                if(scope.diecount < 99) {
                    if(scope.diecount == 0) {
                        scope.diecount = 1;
                    } else {
                        scope.diecount += 1;
                    }
                }
                dsDiceService.addDice('d'+scope.dieside, scope.dieside, scope.diecount);
            };
            
            scope.decDieCount = function() {
                if(scope.diecount > 0) {
                    scope.diecount -= 1;
                }
                dsDiceService.removeDice(scope.dieside, scope.dieside, scope.diecount);
            };

        }
    };
}]);