'use strict';

angular
    .module('textCardService', ['overlayService'])
    .factory('textCardService', textCardService);

textCardService.$inject = ['overlayService', 'config'];

function textCardService(overlayService, config) {
    var textCardArray = [];
    
    var TEXT_X_LEFT_POSITION = -.18;
    var TEXT_Y_POSITION = .07;

    var textCardService = {
        getCards:getCards,
        addNewCard:addNewCard,
        deleteCardAt:deleteCardAt,
        getCardAt:getCardAt,
        redrawCardAt:redrawCardAt
    };

    return textCardService;

    function getCards(){
        return textCardArray;
    }

    function addNewCard(card) {
        // add the card to the backing textCardArray
        textCardArray.push(card);
        // create the text overlay for the card, based on its position in the array, and display it
        overlayService.addNewCard(drawTextCard(card.text, card.textcolor, card.bgcolor, textCardArray.length-1));
    }

    function deleteCardAt(index) {
        // delete the card from the backing textCardArray
        textCardArray.splice(index, 1);
        // overlays aren't AngularJS-ified, so we're going to brute force a referesh by 
        // deleting all the textcard overlays and rebuilding them in order
        overlayService.clearTextCardArrays();
        for(var i = 0;i<textCardArray.length;i++) {
            overlayService.addNewCard(drawTextCard(textCardArray[i].text, textCardArray[i].textcolor, textCardArray[i].bgcolor, i));
        }
    }

    function getCardAt(index) {
        if(0 <= index < textCardArray.length) {
            return textCardArray[index];
        }
    }

    function redrawCardAt(index) {
        // get the data for the card we want to redraw
        var card = textCardService.getCardAt(index);
        // create a new card overlay using the existing card data
        var overlay = drawTextCard(card.text, card.textcolor, card.bgcolor, index);
        overlayService.redrawCardAt(index, overlay);

    }
    
    function drawTextCard(text, textColor, bgColor, index) {
        var textContext= overlayService.createTextOverlay(text, textColor, bgColor, 1, 0, 0);
        var overlay = overlayService.createOverlayFromContext(textContext, .5, TEXT_X_LEFT_POSITION, TEXT_Y_POSITION*index);  
        return overlay;
    }
}