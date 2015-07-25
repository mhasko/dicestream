'use strict';

var dsOverlayService = angular.module('overlayService', ['imageService']);

dsOverlayService.factory('overlayService', ['imageService', function(dsImageService) {
    var overlayService = {};
    
    var trayDiceOverlayArray = [];
    var dieSelectionOverlayArray = [];
    var cardsOverlayArray = [];  
    
    /** Number of dice positions to offset for the Google+ watermark */
    var WATERMARK_OFFSET = 0;

    /** Space between rows of dice*/
    var DICE_ROW_OFFSET = .08;

    /** Space between columns of dice */
    var DICE_COL_OFFSET = .125;

    /** Sets the number of dice per row. */
    var NUM_DICE_PER_ROW = 10;
    
    /** selection overlay types */
    overlayService.SELECTION_NONE = 0;
    overlayService.SELECTION_CIRCLE = 1;
    overlayService.SELECTION_HEX = 2;
    overlayService.SELECTION_X = 3;
    

    /** permissions for overlay types - none, circle, hex, X*/
    var validSelectionTypes = [true, true, true, true];
		
    /** css values for dice image overlay colors */
    overlayService.selectionColorFor = ['transparent', '#54A954','#000000','#802015'];
    
    /** default text color for new cards*/
    overlayService.cardTextColor = 'rgba(0,0,0,1)';
    
    /** default background color for new cards*/
    overlayService.cardBGColor = 'rgba(255,153,0, .5)';
    
    overlayService.getTrayDiceOverlayArray = function(){
        return trayDiceOverlayArray;
    };
    
    overlayService.getDieSelectionOverlayArray = function() {
        return dieSelectionOverlayArray;
    };
    
    overlayService.addNewCard = function(card) {
        cardsOverlayArray.push(card);
    };
    
    overlayService.getCardsOverlayArray = function() {
        return cardsOverlayArray;
    };
    
    overlayService.clearOverlayArrays = function(){
        trayDiceOverlayArray.forEach(setArrayFalse);
        trayDiceOverlayArray.length = 0;
        
        dieSelectionOverlayArray.forEach(setArrayFalse);
        dieSelectionOverlayArray.length = 0;
    };
    
    overlayService.clearTextCardArrays = function() {
        cardsOverlayArray.forEach(setArrayFalse);
        cardsOverlayArray.length = 0;
    };
            
    function setArrayFalse(value, index, array) {
        value.setVisible(false);
    };
    
    overlayService.redrawCardAt = function(index, newCardOverlay) {
        // get the old card overlay at the specified location and set it not visible
        var oldCardOverlay = cardsOverlayArray[index];
       
        
        cardsOverlayArray[index] = newCardOverlay;
        oldCardOverlay.setVisible(false);
        oldCardOverlay.dispose();
    };
    
    /** creates the dice overlay */
    overlayService.createDieOverlay = function(die, value){
        // create the google hangout image resource from the image
        var dieImage = gapi.hangout.av.effects.createImageResource(dsImageService.imageURLFromDie(die, value));
        // create the google hangout overlay object
        var overlay = dieImage.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
        trayDiceOverlayArray.push(overlay);
        return overlay;
    };

    /** displays the dice overlays across the top of the screen */
    overlayService.positionOverlays = function(value, display){//index, display){
        //index is an array index.  We need to use that value along with the constant
        //for the allowable number of dice in a row to first determine the 'grid' 
        //position of the die, then use the offset value to compute the position
        //values for the overlay.

        var watermarkedIndex = trayDiceOverlayArray.length - 1 + WATERMARK_OFFSET;
        var rowOffset = ((watermarkedIndex - (watermarkedIndex % NUM_DICE_PER_ROW)) / NUM_DICE_PER_ROW) * DICE_COL_OFFSET;
        var columnOffset = (watermarkedIndex % NUM_DICE_PER_ROW ) * DICE_ROW_OFFSET;
        value.setPosition({x: -.40 + columnOffset, y:-.425 + rowOffset});
        value.setVisible(display);
    };
		
    /** create a hangout overlay from an HTML5 canvas context */
    overlayService.createOverlayFromContext = function(context, scale, xval, yval){
        // create the google hangout image resource from html5 context
        var canvasImage = gapi.hangout.av.effects.createImageResource(context.canvas.toDataURL());
        // create the google hangout overlay object
        var overlay = canvasImage.createOverlay({});
        overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
        overlay.setPosition({x: xval, y: yval});
        overlay.setVisible(true);
        return overlay;
    };
    
    /** create a text overlay, using fabric.js*/
    overlayService.createTextOverlay = function(text, textColor, bgColor, scale, xpos, ypos) {
        var fcanvas = new fabric.Canvas($('#textCanvas').clone().attr('id'));
        
        //translate the #rrggbb value of the colors to rgba via a tinycolor.js object
        var bgColorTC = tinycolor(bgColor);
        bgColorTC.setAlpha(.4);
        var textColorTC = tinycolor(textColor);
        
        var textObj = new fabric.Text(text, {left: xpos, top: ypos, fontFamily: 'Roboto', textBackgroundColor: bgColorTC.toRgbString()});
        textObj.setColor(textColorTC.toRgbString());
        fcanvas.add(textObj);
        
        return fcanvas.getContext();
    };
    
    overlayService.createLowerThirdContext = function(firstLine, secondLine, color) {
        // create the fabric.js canvas we'll be adding hte various layers on
        // 600 x 100
        var fcanvas = new fabric.Canvas($('#mainThirdCanvas').clone().attr('id'));
        
        // create the rectangle that has the text strings
        var topRect = new fabric.Rect({left:25, top:25, fill:'white', width: 2200, height: 300, rx:20, ry:20, strokeWidth:1, stroke:'rgba(124,124,124,1)'});
        // TODO USE default color 'rgba(0,129,0,1)'
        topRect.setShadow({color: tinycolor(color).toRgbString(), offsetX:30, offsetY:30, blur:5, fillShadow: true, strokeShadow: false});
        fcanvas.add(topRect);
        
        
        var mainTitle = new fabric.Text(firstLine, {left:60, top:20, fontFamily:'Roboto', fontWeight:'bold', fontSize:200});
        fcanvas.add(mainTitle);
        
        var secTitle = new fabric.Text(secondLine, {left:60, top:230, fontFamily:'Roboto', fontSize:80});
        fcanvas.add(secTitle);
        return fcanvas.getContext();
    };
    
    /** recursive function that finds the next valid overlay type and returns it. */
    overlayService.findNextOverlay = function(pos){
        var nextOverlayValue = parseInt(pos)+1;
        // We've hit the end of the array, return the first array value /
        // no selection value.
        if(nextOverlayValue >= validSelectionTypes.length) {
            return overlayService.SELECTION_NONE;
        } 
        // This selection type is allowed, so return it
        else if(validSelectionTypes[nextOverlayValue]) {
            return nextOverlayValue;
        } 
        // The user has disallowed this selection, let's go to the next array
        // value and see if it's valid or not
        else {
            return overlayService.findNextOverlay(nextOverlayValue);
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
        shapeContext.strokeStyle = overlayService.selectionColorFor[overlayService.SELECTION_HEX];
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
        circleContext.strokeStyle = overlayService.selectionColorFor[overlayService.SELECTION_CIRCLE];
        circleContext.stroke();
        return circleContext;
    };

	/** draw an x on an HTML5 canvas object */
    overlayService.drawX = function(lineThickness) {
        var canvas = $('#overlayCanvas').clone();
        var xContext = canvas[0].getContext("2d");
        xContext.translate(0.5, 0.5);
        xContext.lineWidth = lineThickness;
        xContext.strokeStyle = overlayService.selectionColorFor[overlayService.SELECTION_X];
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