'use strict';

var dsApp = angular.module('dicestreamApp');

dsApp.controller('diceTabCtrl2', ['$scope', 'diceService', function ($scope, diceService) {
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

dsApp.controller('textTabCtrl2', ['$scope', 'textCardService', 'settingsService', function($scope, textCardService, current) {
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

dsApp.controller('lowerThirdTabCtrl2', ['$scope', 'lowerThirdService', 'settingsService', function($scope, lowerThirdService, current) {
    var lowerThirdOverlay;
    $scope.settings = current.settings;
    $scope.lowerThirdButtonText = "Create Lower Third";

    $scope.buildLowerThird = function(name, second, color) {
        if(lowerThirdOverlay) {
            clearLowerThird();
        }
        lowerThirdOverlay = lowerThirdService.createLowerThird(current.settings.LOWER_TEXT_FIRST.text,
            current.settings.LOWER_TEXT_SECOND.text,
            current.settings.LOWER_COLOR.color);
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
                lowerThirdOverlay = lowerThirdService.createLowerThird(current.settings.LOWER_TEXT_FIRST.text,
                    current.settings.LOWER_TEXT_SECOND.text,
                    current.settings.LOWER_COLOR.color);
                lowerThirdOverlay.setVisible(true);
            }
        }
    );
    
    var clearLowerThird = function(){
        lowerThirdOverlay.setVisible(false);
        //lowerThirdOverlay.dispose();
    };//
}]);

dsApp.controller('settingsCtrl2', ['$scope', 'settingsService', function($scope, current){

    $scope.settings = current.settings;

    $scope.save = function(){
        current.saveSettings();
    };

    $scope.toggleMirroredVideo = function(){
        gapi.hangout.av.setLocalParticipantVideoMirrored(current.settings.MISC.MIRROR_VID.enabled);
    };
}]);
