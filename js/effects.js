var DICESTREAM = DICESTREAM || {};

if(!DICESTREAM.EFFECTS) {

	EFFECTS = function() {
		var _this = {};
		
		/** Vertical offset for canvas objects */
		var CANVAS_V_OFFSET = -.055;
				
		/** initializes the various arrays used to hold the overlays */
		var stringsOverlayArray = [];
		
		/** offset for text lists*/
		_this.STRING_OFFSET = 0.05;
		
		/** Vertical offest for string overlays */
		_this.STRING_OVERLAY_V_OFFSET = .06;
		
		/** selection overlay types */
		_this.SELECTION_NONE = 0;
		_this.SELECTION_CIRCLE = 1;
		_this.SELECTION_HEX = 2;
		_this.SELECTION_X = 3;
		
		/** dice image overlay colors */
		_this.SELECTION_COLOR = ['transparent', '#54A954','#000000','#802015'];
		
		/** counter image and counter */
		_this.counter_overlay;
		_this.counter_context;
		_this.counter_image;
		_this.counter_image_resource;

		/** helper to draw a Hex */
		_this.drawHex = function(x,y,L,thick){
			return _this.drawPolygon(x,y,6,L,thick);
		};

		/** draw a regular polygon on an HTML5 canvas object */
		_this.drawPolygon = function(x0,y0,numOfSides,L,lineThickness) {
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
		_this.drawCircle = function(x0,y0,radius,lineThickness) {
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
		_this.drawX = function(lineThickness) {
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
		
		/** creat a Hangout overlay from a Hangout resource */
		_this.makeOverlay = function(resource, scale, xval, yval){
			var overlay = resource.createOverlay({});
			overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
			overlay.setPosition({x: xval, y: yval});// + _this.CANVAS_V_OFFSET});
			overlay.setVisible(true);
			return overlay;
		};
		
		/** TODO - remove this and use the clone existing cavnas elements for specific things.
		helper method to create canvas contexts on the fly*/
		_this.createContext = function(w, h) {
			var canvas = DICESTREAM.DOM_BUILDER.createElement("canvas").height(h).width(w)[0];
			var context = canvas.getContext("2d");
			return context;
		}
		
		/** create a hangout overlay from an HTML5 canvas context */
		_this.makeOverlayFromContext = function(context, scale, xval, yval){
			var canvasImage = gapi.hangout.av.effects.createImageResource(context.canvas.toDataURL());
			return _this.makeOverlay(canvasImage, scale, xval, yval);
		};
		
		//TODO NOT NEEDED?
		function modifyText(id){
			stringsOverlayArray.splice(id, 1);
		};
		
		/** helper to push to stringsOverlay */
		_this.addString = function(overlay){
			stringsOverlayArray.push(overlay);
		};
		
		_this.stringCount = function(){
			return stringsOverlayArray.length;
		};

		/** edit the text in a overlay */
		_this.editText = function(data, text){
			var inverseLocation = stringsOverlayArray.length - $("ul").index(data);	
			data.data('text', text);
			var rrggbb = data.data('color');
			stringsOverlayArray[inverseLocation].setVisible(false);
			stringsOverlayArray[inverseLocation].dispose();
			stringsOverlayArray[inverseLocation] = DICESTREAM.EFFECTS.makeOverlayFromContext(DICESTREAM.ACTIONS.createTextContext(text, rrggbb), 1, _this.STRING_OFFSET, .40 - (inverseLocation * _this.STRING_OVERLAY_V_OFFSET) );
		};

		/** edit the color in an overlay */
		_this.editTextColor = function(data, rrggbb){
			var inverseLocation = stringsOverlayArray.length - $("ul").index(data);	
			var text = data.data('text');
			data.data('color', rrggbb);
			stringsOverlayArray[inverseLocation].setVisible(false);
			stringsOverlayArray[inverseLocation].dispose();
			stringsOverlayArray[inverseLocation] = DICESTREAM.EFFECTS.makeOverlayFromContext(DICESTREAM.ACTIONS.createTextContext(text, rrggbb), 1, _this.STRING_OFFSET, .40 - (inverseLocation * _this.STRING_OVERLAY_V_OFFSET) );
		};

		/** remove the text overlay from the screen and its matching text
			check box in the GUI */
		_this.removeText = function(data){
			//remove the overlay information.  We reverse the ul list in the GUI, so we need to grab the
			//'inverse location' of the ul list to correctly map to the array position
			var inverseLocation = stringsOverlayArray.length - $("ul").index(data);	

			stringsOverlayArray[inverseLocation].setVisible(false);
			stringsOverlayArray[inverseLocation].dispose();	

			//splice to modify the size of the array...
			stringsOverlayArray.splice(inverseLocation,1);
			//...because the remove will modify the size of the ul list.
			$(data).remove();

			//redraw the overlays, starting at the location where the item was removed
			for(;inverseLocation < stringsOverlayArray.length;inverseLocation++)
			{
				var existingText = stringsOverlayArray[inverseLocation];
				stringsOverlayArray[inverseLocation].setPosition({x: existingText.getPosition().x, y: existingText.getPosition().y + _this.STRING_OVERLAY_V_OFFSET});
			}
		};
		
		_this.isVideoMirrored = function (mirrored){
			gapi.hangout.av.setLocalParticipantVideoMirrored(!mirrored.checked);
		}
		
		_this.toggleSelectionAction = function(cb){
			switch($(cb).attr('id'))
			{
				case 'toggleCircle':
					DICESTREAM.DICE.SELECTION_ALLOW[SELECTION_CIRCLE]=cb.checked;
					break;
				case 'toggleHex':
					DICESTREAM.DICE.SELECTION_ALLOW[SELECTION_HEX]=cb.checked;
					break;
				case 'toggleX':
					DICESTREAM.DICE.SELECTION_ALLOW[SELECTION_X]=cb.checked;
					break;			
			}
		};

		function selectDiceAction(value){
			setDice(value);
		};

		function selectThemeAction(value){
			switch(value)
			{
				case 'fate':
					$("#diceDiv").text("");
					fateFudgeDOM();
					break;
			}
		};
		
		var createContext = function(w, h) {
			return _this.createContext(w, h);
		};
		
		return _this;
	};

	DICESTREAM.EFFECTS = EFFECTS();
};