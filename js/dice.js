var DICESTREAM = DICESTREAM || {};

if(!DICESTREAM.DICE) {

	DICE = function() {
		var _this = {};
		
		/** initializes the various arrays used to hold the overlays */
		var rolledDiceOverlayArray = [];
		var effectOverlayArray = [];
		
		/** array that has the die sizes */
		var DICETYPE = [3,4,6,8,10,12,20,100];
				
		/** Number of dice positions to offset for the Google+ watermark */
		var WATERMARK_OFFSET = 3;
		
		/** Space between rows of dice*/
		var DICE_ROW_OFFSET = .08;

		/** Space between columns of dice */
		var DICE_COL_OFFSET = .125;
		
		/** Sets the number of dice per row. */
		var NUM_DICE_PER_ROW = 10;
		
		/** offset for circle and hex overlays */ 
		var SELECTION_OFFSET_X = .054;
		var SELECTION_OFFSET_Y = .15;
		
		/** root variables to the various image paths used.*/
		var IMAGEROOT = "https://commondatastorage.googleapis.com/dicestream/images";
		var DICEROOT = "/standard";
		var PNG = ".png";
		
		/** permissions for overlay types */
		_this.SELECTION_ALLOW = [true, true, true, true];

		_this.rollDice = function() {
			var i = 0;
			for(;i<DICETYPE.length;i++)
			{
				var j=0;
				var count = $("#d"+DICETYPE[i]+"count").text();
				for(;j<count;j++)
				{
					var value = Math.ceil(DICETYPE[i]*Math.random());
					var imageUrl = IMAGEROOT + DICEROOT + '/d' + DICETYPE[i] + '-' + value + PNG;			
					var dieImage = gapi.hangout.av.effects.createImageResource(imageUrl);
					var overlay = dieImage.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
					rolledDiceOverlayArray.push(overlay);

					//position and display the dice overlay on the video screen
					positionOverlays(overlay, rolledDiceOverlayArray.length-1, true);

					var diceDiv = document.createElement("span");
					$(diceDiv).data("die", {size: DICETYPE[i], face: value, position: rolledDiceOverlayArray.length, overlay: DICESTREAM.EFFECTS.SELECTION_NONE});

					//Enable selection of overlay dice by clicking the matching die in the control panel
					$(diceDiv).addClass("rolledDice").prepend("<img src='"+imageUrl+"' />").click(function(){
						selectDieOverlay(this);
					});
					$("#rolledDiceDiv").append(diceDiv);
				}
			}
		};
		
		/** changes the dice skin to be used */
		_this.setDice = function(value){
			_this.DICEROOT = $("#selectDieSet").val();
		};
		
		_this.clearDice = function() {
			clearDiceArrays();
			rolledDiceOverlayArray.length = 0;
			effectOverlayArray.length = 0;
			modifyTotal('=', 0);
		};
		
		/** displays the dice overlays across the top of the screen */
		function positionOverlays(value, index, display){
			//index is an array index.  We need to use that value along with the constant
			//for the allowable number of dice in a row to first determine the 'grid' 
			//position of the die, then use the offset value to computer the position
			//values for the overlay.
			var watermarkedIndex = index + WATERMARK_OFFSET;
			var rowOffset = ((watermarkedIndex - (watermarkedIndex % NUM_DICE_PER_ROW)) / NUM_DICE_PER_ROW) * DICE_COL_OFFSET;
			var columnOffset = (watermarkedIndex % NUM_DICE_PER_ROW ) * DICE_ROW_OFFSET;
			value.setPosition({x: -.45 + columnOffset, y:-.425 + rowOffset});
			value.setVisible(display);
		};
		
		function selectDieOverlay(div){
		//Special rules for Marvel, don't allow selection of rolled 1s
			//if($(this).data('die').face > 1)
			//{
			var diePosition = $(div).data('die').position - 1;
			var newx = rolledDiceOverlayArray[diePosition].getPosition().x+.5;
			var newy = rolledDiceOverlayArray[diePosition].getPosition().y+.5;
				
			var nextSelection = findNextOverlay($(div).data('die').overlay);
			switch(nextSelection){
				case DICESTREAM.EFFECTS.SELECTION_CIRCLE:
					$(div).css({'background-color':DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_CIRCLE]});
					//TODO modifyTotal('+', $(div).data('die').face);
					//make the circle overlay
					if(effectOverlayArray[diePosition]){
						effectOverlayArray[diePosition].setVisible(false);
						effectOverlayArray[diePosition].dispose();
					}						
					var circleContext = DICESTREAM.EFFECTS.drawCircle(16,16,12,3);
					effectOverlayArray[diePosition]=DICESTREAM.EFFECTS.makeOverlayFromContext(circleContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
					break;
				case DICESTREAM.EFFECTS.SELECTION_HEX:
					$(div).css({'background-color':DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_HEX]});
					//TODO modifyTotal('-', $(div).data('die').face);
					//make the hex overlay
					var hexContext = DICESTREAM.EFFECTS.drawHex(16,16,12,3);
					if(effectOverlayArray[diePosition]){
						effectOverlayArray[diePosition].setVisible(false);
						effectOverlayArray[diePosition].dispose();
					}
					effectOverlayArray[diePosition]=DICESTREAM.EFFECTS.makeOverlayFromContext(hexContext, 1, newx - SELECTION_OFFSET_X , newy-SELECTION_OFFSET_Y);	
					break;
				case DICESTREAM.EFFECTS.SELECTION_X:
					$(div).css({'background-color':DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_X]});
					var xContext = DICESTREAM.EFFECTS.drawX(3);
					//remove the effect overlay
					if(effectOverlayArray[diePosition]){
						effectOverlayArray[diePosition].setVisible(false);
						effectOverlayArray[diePosition].dispose();
					}		
					effectOverlayArray[diePosition]=DICESTREAM.EFFECTS.makeOverlayFromContext(xContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);	
					break;
				case DICESTREAM.EFFECTS.SELECTION_NONE:
				default:
					$(div).css({'background-color':DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_NONE]});
					//remove the effect overlay
					if(effectOverlayArray[diePosition]){
						effectOverlayArray[diePosition].setVisible(false);
					}		

			}
			$(div).data('die').overlay = nextSelection;
			//}
		};
		
		function clearDiceArrays() {
			rolledDiceOverlayArray.forEach(setDieArrayFalse);
			effectOverlayArray.forEach(setDieArrayFalse);
		};

		function setDieArrayFalse(value, index, array) {
			value.dispose();
		};
		
		function findNextOverlay(pos){
			if(pos+1 >= _this.SELECTION_ALLOW.length)
			{
				return DICESTREAM.EFFECTS.SELECTION_NONE;
			}
			else if(_this.SELECTION_ALLOW[pos+1])
			{
				return pos + 1;
			}
			else
			{
				return findNextOverlay(pos+1);
			}
		};
		
		/** keeps a running sum of 'selected' dice as they're selected and deselected
			TODO -- currently not used, add as an option later (rolled dice vs selected*/
		function modifyTotal(operation, value){
			var existingValue = parseInt($("#diceTotal").text(),10);
			switch(operation){
				case "+":
					$("#diceTotal").text(existingValue + parseInt(value,10));
					break;
				case "=":
					$("#diceTotal").text(value);
					break;
				case "-":
					$("#diceTotal").text(existingValue - parseInt(value,10));
					break;
				default:
			}
		};
		
		return _this;
	};

	DICESTREAM.DICE = DICE();
};