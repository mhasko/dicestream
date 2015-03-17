//use
var DICESTREAM = DICESTREAM || {};

if(!DICESTREAM.MAIN) {

	MAIN = function() {
		 var _this = {};

		/** max height variable, changed on resize */
		_this.max_height = $(window).height();

		/** when the hangout is ready, initialize the app */
		function init() {
			// When API is ready
			gapi.hangout.onApiReady.add(
			function(eventObj) {
				if(eventObj.isApiReady) {
					//Needed for Firefox which hides the display at startup
					document.getElementById('app-gui').style.visibility = 'visible';
//					initDiceUI();
//					initWidgets();
//					//initPPOverlays();
//					DICESTREAM.ACTIONS.setPP(1);	
					//Need a promise to hold, so we can scale once the init is done?
//					scale();
				}
			});
		};

//		//TODO determine the row offset for dice overlay*/
//		function rowOffset(index) {
//
//		};
//
//		//TODO having the position of canvas overlays be standarized
//		function positionCanvasOverlays(overlay, index, display){
//
//		};

		//TODO 
//		function initPPOverlays(){	
//			//DICESTREAM.EFFECTS.counter_image_resource = gapi.hangout.av.effects.createImageResource(IMAGEROOT + DICEROOT + '/shieldpp' + PNG);
//			DICESTREAM.EFFECTS.counter_image = DICESTREAM.EFFECTS.counter_image_resource.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
//			DICESTREAM.EFFECTS.counter_image.setPosition({x: .45, y:-.425});
//			DICESTREAM.EFFECTS.counter_image.setVisible(true);
//		};
//
//		function initDiceUI(){
//			DICESTREAM.DOM_BUILDER.defaultDOM();
//			DICESTREAM.DOM_BUILDER.textDOM();
//			DICESTREAM.DOM_BUILDER.thirdDOM();
//			DICESTREAM.DOM_BUILDER.settingsDOM();
//			$.minicolors.init();
//			$('#tabs').tabs();
//		};
//
//		function initWidgets(){
//			//create a callback to change the color of the pp counter
//			$("#ppcolor").change(function(){
//					// callback of 'minicolor' color selection widget, $(this).val() will 
//					// get the hex value of the currently selected color in the widget
//						DICESTREAM.ACTIONS.setPP($("#ppcount").text(), $(this).val());
//					});
//
//			$("#selectedcolorselect").change(function(){
//						DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_CIRCLE] = $(this).val();
//					});
//
//			$("#effectcolorselect").change(function(){
//						DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_HEX] = $(this).val();
//					});
//
//			$("#xcolorselect").change(function(){
//						DICESTREAM.EFFECTS.SELECTION_COLOR[DICESTREAM.EFFECTS.SELECTION_X] = $(this).val();
//					});
//
//			$("#lower3rdsecselect").change(function(){
//						DICESTREAM.LOWERTHIRD.change3rdColor($(this).val());
//					});
//		};
//
//		/** */
//		function scale(){
//			jQuery("#app-gui").height(_this.max_height-20);
//		};

		// Wait for gadget to load.                                                       
		gadgets.util.registerOnLoadHandler(init);
		gapi.hangout.av.setLocalParticipantVideoMirrored(true);
		//Resize the div size on a window resize.  
		$(window).on('resize', function(){
			_this.max_height = window.innerHeight;
//			scale();
		});

		return _this;
	};

	DICESTREAM.MAIN = MAIN();
};