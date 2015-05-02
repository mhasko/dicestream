'use strict';

var overlayObject = angular.module('overlayObject', []);

overlayObject.directive('overlayObject', [function() {
    return {
        restrict: 'E',
        scope: {
//            id: '@dieid',
//            side: '@sides',
//            imageroot: '@',
//            dieimage: '@'//+dieside+'.png'
        },
        templateUrl: '<canvas height="254px" width="254px"></canvas>',
        controller: function($scope){

            
        },
        link: function(scope, element, attrs) {

//            scope.incDieCount = function() {
//                if(scope.diedata.count < 99) {
//                    if(scope.diedata.count == 0) {
//                        scope.diedata.count = 1;
//                    } else {
//                        scope.diedata.count += 1;
//                    }
//                }
//            };
//            
//            scope.decDieCount = function() {
//                if(scope.diedata.count > 0) {
//                    scope.diedata.count -= 1;
//                }  
            };
        }
    };
}]);