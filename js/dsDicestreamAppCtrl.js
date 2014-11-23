'use strict';

var dsApp = angular.module('dicestreamApp', ['ui.bootstrap', 'diceButton']);

dsApp.controller('diceTabCtrl', ['$scope', function ($scope) {
    $scope.roll = function() {
        alert("roll");
    };
    
    $scope.clear = function() {
        alert("clear");
    };
}]);

dsApp.config(function($sceDelegateProvider){
//   $sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube)\.com(/.*)?$', 'self']);
    $sceDelegateProvider.resourceUrlWhitelist(['https://dl.dropbox.com/u/1177409/**', 'self']);
});



