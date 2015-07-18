'use strict';

var dsTextCardService = angular.module('textCardService', ['overlayService']);

dsTextCardService.factory('textCardService', ['overlayService', 'config', function(overlayService, config) {
    
    var textCardService = {};
    
    var textCardArray = [];
    
    var TEXT_X_LEFT_POSITION = -.18;
    var TEXT_Y_POSITION = .07;
    
    textCardService.getCards = function(){
        return textCardArray;
    };
    
    textCardService.addNewCard = function(card) {
        // add the card to the backing textCardArray
        textCardArray.push(card);
        // create the text overlay for the card, based on its position in the array, and display it
        overlayService.addNewCard(drawTextCard(card.text, card.textcolor, card.bgcolor, textCardArray.length-1));
    };
    
    textCardService.deleteCardAt = function(index) {
        // delete the card from the backing textCardArray
        textCardArray.splice(index, 1);
        // overlays aren't AngularJS-ified, so we're going to brute force a referesh by 
        // deleting all the textcard overlays and rebuilding them in order
        overlayService.clearTextCardArrays();
        for(var i = 0;i<textCardArray.length;i++) {
            overlayService.addNewCard(drawTextCard(textCardArray[i].text, textCardArray[i].textcolor, textCardArray[i].bgcolor, i));
        }
    };
    
    textCardService.getCardAt = function(index) {
        if(0 <= index < textCardArray.length) {
            return textCardArray[index];
        }
    };
        
//    //todo make replace card at? 
//    //1) replace card with new card
//    //2) remove and recreated card at that position
//    textCardService.redrawCards = function() {
//        overlayService.clearTextCardArrays();
//        for(var i = 0;i<textCardArray.length;i++) {
//            overlayService.addNewCard(drawTextCard(textCardArray[i].text, textCardArray[i].textcolor, textCardArray[i].bgcolor, i));
//        }
//        
//    };
    
    textCardService.redrawCardAt = function(index) {
        // get the data for the card we want to redraw
        var card = textCardService.getCardAt(index);
        // create a new card overlay using the existing card data
        var overlay = drawTextCard(card.text, card.textcolor, card.bgcolor, index);
        overlayService.redrawCardAt(index, overlay);

    };
    
    var drawTextCard = function(text, textColor, bgColor, index) {
        var textContext= overlayService.createTextOverlay(text, textColor, bgColor, 1, 0, 0);
        var overlay = overlayService.createOverlayFromContext(textContext, .5, TEXT_X_LEFT_POSITION, TEXT_Y_POSITION*index);  
        return overlay;
    };
            
    return textCardService;
}]);