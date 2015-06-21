'use strict';

var dsApp = angular.module('dicestreamApp');

dsApp.controller('diceTabCtrl', ['$scope', 'diceService', function ($scope, diceService) {
    $scope.roll = function() {
        diceService.rollDice();
    };
    
    $scope.clear = function() {
        diceService.clearDice();
    };
    
    $scope.getDicetray = function() {
        return diceService.getDicetrayArray();
    };
}]);

dsApp.controller('textTabCtrl', ['$scope', 'textCardService', function($scope, textCardService) {
    //[{text: "test1",
    //  textcolor: "#000000",
    //  bgcolor: "#ffffff"},...]
        
    $scope.getTextCards = function() {
        return textCardService.getCards();
    };
    
    $scope.addCard = function(cardtext) {
        textCardService.addNewCard({text:cardtext, textcolor:"#000000", bgcolor:"#ffffff"});    
    };
}]);
