'use strict';

var dsOverlayService = angular.module('overlayService', []);

dsOverlayService.factory('overlayService', function() {
    var overlayService = {};
    
    /** Number of dice positions to offset for the Google+ watermark */
    var WATERMARK_OFFSET = 3;

    /** Space between rows of dice*/
    var DICE_ROW_OFFSET = .08;

    /** Space between columns of dice */
    var DICE_COL_OFFSET = .125;

    /** Sets the number of dice per row. */
    var NUM_DICE_PER_ROW = 9;

    /** displays the dice overlays across the top of the screen */
    overlayService.positionOverlays = function(value, index, display){
        //index is an array index.  We need to use that value along with the constant
        //for the allowable number of dice in a row to first determine the 'grid' 
        //position of the die, then use the offset value to computer the position
        //values for the overlay.
        var watermarkedIndex = index + WATERMARK_OFFSET;
        var rowOffset = ((watermarkedIndex - (watermarkedIndex % NUM_DICE_PER_ROW)) / NUM_DICE_PER_ROW) * DICE_COL_OFFSET;
        var columnOffset = (watermarkedIndex % NUM_DICE_PER_ROW ) * DICE_ROW_OFFSET;
        value.setPosition({x: -.40 + columnOffset, y:-.425 + rowOffset});
        value.setVisible(display);
    };
    
    return overlayService;
});