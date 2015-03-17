'use strict';

var dsOverlayService = angular.module('overlayService', []);

dsOverlayService.factory('overlayService', function() {
    var overlayService = {};
    
    var rolledDiceOverlayArray = [];
    
    /** Number of dice positions to offset for the Google+ watermark */
    var WATERMARK_OFFSET = 3;

    /** Space between rows of dice*/
    var DICE_ROW_OFFSET = .08;

    /** Space between columns of dice */
    var DICE_COL_OFFSET = .125;

    /** Sets the number of dice per row. */
    var NUM_DICE_PER_ROW = 9;
    
    /** root variables to the various image paths used.*/
    var IMAGEROOT = "https://s3.amazonaws.com/dicestream/images"
    //var DICEROOT = "/standard";
    var DICEROOT = "/captaingothnog";
    var PNG = ".png";
    
    /** creates the dice overlay */
    overlayService.createOverlay = function(dice, value){
        // construct the url to the image for the specified die. 
        // TODO: replace this with xml images?
        var imageUrl = IMAGEROOT + DICEROOT + '/d' + dice + '-' + value + PNG;			
        // create the google hangout image resource from the image
        var dieImage = gapi.hangout.av.effects.createImageResource(imageUrl);
        // create the google hangout overlay object
        var overlay = dieImage.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
        rolledDiceOverlayArray.push(overlay);
        return overlay;
    }

    /** displays the dice overlays across the top of the screen */
    overlayService.positionOverlays = function(value, display){//index, display){
        //index is an array index.  We need to use that value along with the constant
        //for the allowable number of dice in a row to first determine the 'grid' 
        //position of the die, then use the offset value to computer the position
        //values for the overlay.
//        var watermarkedIndex = index + WATERMARK_OFFSET;
        var watermarkedIndex = rolledDiceOverlayArray.length - 1 + WATERMARK_OFFSET;
        var rowOffset = ((watermarkedIndex - (watermarkedIndex % NUM_DICE_PER_ROW)) / NUM_DICE_PER_ROW) * DICE_COL_OFFSET;
        var columnOffset = (watermarkedIndex % NUM_DICE_PER_ROW ) * DICE_ROW_OFFSET;
        value.setPosition({x: -.40 + columnOffset, y:-.425 + rowOffset});
        value.setVisible(display);
    };
    


    
    return overlayService;
});