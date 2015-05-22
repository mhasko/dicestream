'use strict';

var dsOverlayService = angular.module('overlayService', ['imageService']);

dsOverlayService.factory('overlayService', ['imageService', function(dsImageService) {
    var overlayService = {};
    
    var rolledDiceOverlayArray = [];
    var effectOverlayArray = [];
    
    /** Number of dice positions to offset for the Google+ watermark */
    var WATERMARK_OFFSET = 3;

    /** Space between rows of dice*/
    var DICE_ROW_OFFSET = .08;

    /** Space between columns of dice */
    var DICE_COL_OFFSET = .125;

    /** Sets the number of dice per row. */
    var NUM_DICE_PER_ROW = 9;
    
    /** permissions for overlay types - none, circle, hex, X*/
    var SELECTION_ALLOW = [true, true, true, true];
    
    /** selection overlay types */
    overlayService.SELECTION_NONE = 0;
    overlayService.SELECTION_CIRCLE = 1;
    overlayService.SELECTION_HEX = 2;
    overlayService.SELECTION_X = 3;
		
    /** dice image overlay colors */
    overlayService.SELECTION_COLOR = ['transparent', '#54A954','#000000','#802015'];
    
    overlayService.getRolledDiceOverlayArray = function(){
        return rolledDiceOverlayArray;
    };
    
    overlayService.getEffectOverlayArray = function() {
        return effectOverlayArray;
    };
    
    overlayService.clearOverlayArrays = function(){
        rolledDiceOverlayArray.forEach(setDieArrayFalse);
        rolledDiceOverlayArray.length = 0;
    };
            
    function setDieArrayFalse(value, index, array) {
        value.setVisible(false);
    };
    
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
    
//    /** creat a Hangout overlay from a Hangout resource */
//    overlayService.makeOverlay = function(resource, scale, xval, yval){
//        var overlay = resource.createOverlay({});
//        overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
//        overlay.setPosition({x: xval, y: yval});// + _this.CANVAS_V_OFFSET});
//        overlay.setVisible(true);
//        return overlay;
//    };
		
    /** create a hangout overlay from an HTML5 canvas context */
    overlayService.makeOverlayFromContext = function(context, scale, xval, yval){
        var canvasImage = gapi.hangout.av.effects.createImageResource(context.canvas.toDataURL());
//        return _this.makeOverlay(canvasImage, scale, xval, yval);
//            var overlay = resource.createOverlay({});
        var overlay = canvasImage.createOverlay({});
        overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
        overlay.setPosition({x: xval, y: yval});// + _this.CANVAS_V_OFFSET});
        overlay.setVisible(true);
        return overlay;
    };
    
    //recursive function that finds the next valid overlay type and returns it.
    overlayService.findNextOverlay = function(pos){
        if(parseInt(pos)+1 >= SELECTION_ALLOW.length) {
            return overlayService.SELECTION_NONE;
        } else if(SELECTION_ALLOW[parseInt(pos)+1]) {
            return parseInt(pos) + 1;
        } else {
            return overlayService.findNextOverlay(pos+1);
        }
    };
    
    /** helper to draw a Hex */
    overlayService.drawHex = function(x,y,L,thick){
		return overlayService.drawPolygon(x,y,6,L,thick);
    };

    /** draw a regular polygon on an HTML5 canvas object */
	overlayService.drawPolygon = function(x0,y0,numOfSides,L,lineThickness) {
        var canvas = $('#overlayCanvas').clone();
        var shapeContext = canvas[0].getContext("2d");
        var firstX;
        var firstY;
        shapeContext.translate(0.5, 0.5);
        shapeContext.strokeStyle = overlayService.SELECTION_COLOR[overlayService.SELECTION_HEX];
        shapeContext.lineWidth = lineThickness;
        shapeContext.beginPath();
        for(var i=0;i<numOfSides;i++)
        {
            var x = L * Math.cos(2*Math.PI*i/numOfSides) + x0;
            var y = L * Math.sin(2*Math.PI*i/numOfSides) + y0;
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
        var canvas = $('#overlayCanvas').clone();
        var circleContext = canvas[0].getContext("2d");
        circleContext.translate(0.5, 0.5);
        circleContext.beginPath();
        circleContext.arc(x0, y0, radius, 0, 2 * Math.PI, false);
        circleContext.lineWidth = lineThickness;
        circleContext.strokeStyle = overlayService.SELECTION_COLOR[overlayService.SELECTION_CIRCLE];
        circleContext.stroke();
        return circleContext;
    };

	/** draw an x on an HTML5 canvas object */
    overlayService.drawX = function(lineThickness) {
        var canvas = $('#overlayCanvas').clone();
        var xContext = canvas[0].getContext("2d");
        xContext.translate(0.5, 0.5);
        xContext.lineWidth = lineThickness;
        xContext.strokeStyle = overlayService.SELECTION_COLOR[overlayService.SELECTION_X];
        xContext.beginPath();

        xContext.moveTo(48, 48);
        xContext.lineTo(464, 464);

        xContext.moveTo(464, 48);
        xContext.lineTo(48, 464);
        xContext.stroke();
        return xContext;
    };
    
    return overlayService;
}]);