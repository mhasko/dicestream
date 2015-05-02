'use strict';

var dsOverlayService = angular.module('overlayService', ['imageService']);

dsOverlayService.factory('overlayService', ['imageService', function(dsImageService) {
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
    var IMAGEROOT = "https://s3.amazonaws.com/dicestream/images/"
    var PNG = ".png";
    
    overlayService.getRolledDiceOverlayArray = function(){
        return rolledDiceOverlayArray;
    };
    
    overlayService.clearOverlayArrays = function(){
        rolledDiceOverlayArray.forEach(setDieArrayFalse);
        rolledDiceOverlayArray.length = 0;
    }
            
    function setDieArrayFalse(value, index, array) {
        value.setVisible(false);
    }
    /** creates the dice overlay */
    overlayService.createOverlay = function(die, value){
        // create the google hangout image resource from the image
        var dieImage = gapi.hangout.av.effects.createImageResource(dsImageService.imageURLFromDie(die, value));
        // create the google hangout overlay object
        var overlay = dieImage.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
        rolledDiceOverlayArray.push(overlay);
        return overlay;
    };

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
    
    /** helper to draw a Hex */
    overlayService.drawHex = function(x,y,L,thick){
		return _this.drawPolygon(x,y,6,L,thick);
    };

    /** draw a regular polygon on an HTML5 canvas object */
	overlayService.drawPolygon = function(x0,y0,numOfSides,L,lineThickness) {
		var shapeContext = createContext(256, 256);
			//var canvas = $('#overlayCanvas').clone();
			//var shapeContext = canvas[0].getContext("2d");
        var firstX;
        var firstY;
        shapeContext.translate(0.5, 0.5);
        shapeContext.strokeStyle = _this.SELECTION_COLOR[_this.SELECTION_HEX];
        shapeContext.lineWidth = lineThickness;
        shapeContext.beginPath();
        for(var i=0;i<numOfSides;i++)
        {
            x = L * Math.cos(2*Math.PI*i/numOfSides) + x0;
            y = L * Math.sin(2*Math.PI*i/numOfSides) + y0;
            if(i==0){
                shapeContext.moveTo(x, y);
                firstX = x;
                firstY = y;
            }
            else
            {
                shapeContext.lineTo(x, y);
            }

        }
        shapeContext.lineTo(firstX, firstY);
        shapeContext.closePath();
        shapeContext.stroke();

        return shapeContext;
    };

    /** draw a circle on an HTML5 canvas object */
    overlayService.drawCircle = function(x0,y0,radius,lineThickness) {
        var circleContext = createContext(256, 256);
        //var canvas = $('#overlayCanvas').clone();
        //var circleContext = canvas[0].getContext("2d");
        circleContext.translate(0.5, 0.5);
        circleContext.beginPath();
        circleContext.arc(x0, y0, radius, 0, 2 * Math.PI, false);
        circleContext.lineWidth = lineThickness;
        circleContext.strokeStyle = _this.SELECTION_COLOR[_this.SELECTION_CIRCLE];
        circleContext.stroke();
        return circleContext;
    };

	/** draw an x on an HTML5 canvas object */
    overlayService.drawX = function(lineThickness) {
        var xContext = createContext(256, 256);
        //var canvas = $('#overlayCanvas').clone();
        //var xContext = canvas[0].getContext("2d");
        xContext.translate(0.5, 0.5);
        xContext.lineWidth = lineThickness;
        xContext.strokeStyle = _this.SELECTION_COLOR[_this.SELECTION_X];
        xContext.beginPath();

        xContext.moveTo(4, 4);
        xContext.lineTo(28, 28);

        xContext.moveTo(28, 4);
        xContext.lineTo(4, 28);
        xContext.stroke();
        return xContext;
    };
    
    return overlayService;
}]);