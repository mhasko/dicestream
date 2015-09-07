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
        // TODO use the default values here.
        textCardService.addNewCard({text:cardtext, textcolor:"#000000", bgcolor:"#ff9900"});    
    };
}]);

dsApp.controller('lowerThirdTabCtrl', ['$scope', 'lowerThirdService', function($scope, lowerThirdService) {
    var lowerThirdOverlay;
    $scope.lowerThirdButtonText = "Create Lower Third";
    
    $scope.buildLowerThird = function() {
        if(lowerThirdOverlay) {
            clearLowerThird();
        }
        lowerThirdOverlay = lowerThirdService.createLowerThird($scope.lowerThirdName, $scope.lowerThirdSecond, $scope.lowerThirdColor);  
        $scope.lowerThirdButtonText = "Update Lower Third";
    }; 
    
    $scope.$watch(function(scope) { return scope.lowerThirdColor },
        function(newValue, oldValue) {
            if(lowerThirdOverlay) {
                clearLowerThird();
                lowerThirdOverlay = lowerThirdService.createLowerThird($scope.lowerThirdName, $scope.lowerThirdSecond, newValue); 
            }
        }
    );
    
    var clearLowerThird = function(){
        lowerThirdOverlay.setVisible(false);
        lowerThirdOverlay.dispose();
    };
}]);

dsApp.controller('settingsCtrl', ['$scope', 'settingsService', function($scope, settingsService){

    $scope.settings = settingsService.currentSettings;
}]);
