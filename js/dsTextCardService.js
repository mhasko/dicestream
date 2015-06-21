'use strict';

var dsTextCardService = angular.module('textCardService', ['overlayService']);

dsTextCardService.factory('textCardService', ['overlayService', 'config', function(overlayService, config) {
    
    var textCardService = {};
    
    var textCardArray = [];
    
    textCardService.getCards = function(){
        return textCardArray;
    };
    
    textCardService.addNewCard = function(card) {
        // add the card to the backing textCardArray
        textCardArray.push(card);
        // create the text overlay for the card, based on its position in the array, and display it
        var textContext= overlayService.createTextOverlay(card.text, 1, 0, 0);
        var overlay = overlayService.createOverlayFromContext(textContext, .5, 0, .1*(textCardArray.length-1));
        overlayService.addNewCard(overlay);
    };
    
    textCardService.deleteCardAt = function(index) {
        // delete the card from the backing textCardArray
        textCardArray.splice(index, 1);
        // overlays aren't AngularJS-ified, so we're going to brute force a referesh by 
        // deleting all the textcard overlays and rebuilding them in order
        overlayService.clearTextCardArrays();
        for(var i = 0;i<textCardArray.length;i++) {
            var textContext= overlayService.createTextOverlay(textCardArray[i].text, 1, 0, 0);
            var overlay = overlayService.createOverlayFromContext(textContext, .5, 0, .1*i);
            overlayService.addNewCard(overlay);
        }
    };
    
    textCardService.drawAllCards = function() {
          
    };
            
    return textCardService;
}]);