'use strict';

var dsApp = angular.module('dicestreamApp');

dsApp.controller('diceTabCtrl', ['$scope', 'diceService', function ($scope, diceService) {
    $scope.roll = function() {
        diceService.rollDice();
    };
    
    $scope.clear = function() {
        diceService.clearDice();
    };
    
    $scope.getRolledDice = function() {
        return diceService.getRolledDiceArray();
    };
    
//    $scope.toggleOverlay = function() {
//        alert("PRESSED THE BUTTON");  
//    };
}]);

//return dsApp;
