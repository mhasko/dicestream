'use strict';

var dsApp = angular.module('dicestreamApp', ['ui.bootstrap', 'diceButton', 'diceService']);

//dsApp.controller('dicestreamMainCtrl', ['$scope', function ($scope) {
//
//}]);

dsApp.controller('diceTabCtrl', ['$scope', 'diceService', function ($scope, diceService) {
    //init the default set of dice
//    var defaultDice = [4,6,8,10,12,20,3];
//    
//    var dieButton = angular.element(document.createElement('diceButton'));
//    var el = $compile(dieButton)($scope);
//    
//    $scope.insertHere = el;
//        $scope.add = function(ev,attrs){//$on('insertItem',function(ev,attrs){
//      var chart = angular.element(document.createElement('chart'));
//      var el = $compile( chart )( $scope );
//      
//      //where do you want to place the new element?
//      angular.element(document.body).append(chart);
//      
//      $scope.insertHere = el;
//    };
    $scope.roll = function() {
//        DICESTREAM.DICE.rollSpecificDice('4');
        diceService.rollDice();
    };
    
    $scope.clear = function() {
        alert("clear");
    };
}]);

dsApp.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['https://dl.dropbox.com/u/1177409/**', 'https://s3.amazonaws.com/dicestream/**', 'self']);
});



