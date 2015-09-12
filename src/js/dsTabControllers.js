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

dsApp.controller('textTabCtrl', ['$scope', 'textCardService', 'settingsService', function($scope, textCardService, current) {
    //[{text: "test1",
    //  textcolor: "#000000",
    //  bgcolor: "#ffffff"},...]
        
    $scope.getTextCards = function() {
        return textCardService.getCards();
    };
    
    $scope.addCard = function(cardtext) {
        textCardService.addNewCard({text:cardtext, textcolor:current.settings.CARD_TEXT_COLOR.color, bgcolor:current.settings.CARD_BG_COLOR.color});
    };
}]);

dsApp.controller('lowerThirdTabCtrl', ['$scope', 'lowerThirdService', 'settingsService', function($scope, lowerThirdService, current) {
    var lowerThirdOverlay;
    $scope.lowerThirdButtonText = "Create Lower Third";

    //Load the defaults from the settings as a convience
    $scope.lowerThirdColor = current.settings.LOWER_COLOR.color;
    $scope.lowerThirdName  = current.settings.LOWER_TEXT_FIRST.text;
    $scope.lowerThirdSecond = current.settings.LOWER_TEXT_SECOND.text;

    $scope.buildLowerThird = function(name, second, color) {
        if(lowerThirdOverlay) {
            clearLowerThird();
        }
        lowerThirdOverlay = lowerThirdService.createLowerThird($scope.lowerThirdName, $scope.lowerThirdSecond, $scope.lowerThirdColor);
        lowerThirdOverlay.setVisible(true);
        $scope.lowerThirdButtonText = "Update Lower Third";
    };

    $scope.clear = function() {
        clearLowerThird();
        $scope.lowerThirdButtonText = "Create Lower Third";
    };
    
    $scope.$watch(function(scope) { return scope.lowerThirdColor },
        function(newValue, oldValue) {
            if(lowerThirdOverlay) {
                clearLowerThird();
                $scope.lowerThirdColor = newValue;
                lowerThirdOverlay = lowerThirdService.createLowerThird($scope.lowerThirdName, $scope.lowerThirdSecond, $scope.lowerThirdColor);
                lowerThirdOverlay.setVisible(true);
            }
        }
    );
    
    var clearLowerThird = function(){
        lowerThirdOverlay.setVisible(false);
        //lowerThirdOverlay.dispose();
    };
}]);

dsApp.controller('settingsCtrl', ['$scope', 'settingsService', function($scope, current){

    $scope.settings = current.settings;
}]);
