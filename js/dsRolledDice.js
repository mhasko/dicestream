'use strict';

var dsRolledDice = angular.module('dsRolledDice', []);

dsRolledDice.directive('dsRolledDice', ['config', '$compile', function(config, $compile) {
    return {
        restrict: 'E',
        scope: {
//            dieData: '@',
            die: '@',
            value: '@',
            url: '@',
            position: '@'
        },
        templateUrl: config.filePrefix + 'partials/rolledDice.html'
        ,controller: function($scope){
        }
        ,link: function(scope, element, attrs) {
            console.log(scope.dieData);
            
            scope.selectDieOverlay = function(){
                var something = 1;
                alert('click');
            };            
        }
//  
//    -/-create rolledice directive
//    -/-pass in die data state (rolledDie), position
//    -/-has onClick() function, toggleOverlay, uses position  
//    -/-view uses data state

        
    };
}]);