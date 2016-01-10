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
					//Need a promise to hold, so we can scale once the init is done?
//					scale();
				}
			});
		};

//		/** */
//		function scale(){
//			jQuery("#app-gui").height(_this.max_height-20);
//		};

		// Wait for gadget to load.
		gadgets.util.registerOnLoadHandler(init);
		gapi.hangout.av.setLocalParticipantVideoMirrored(false);
		//Resize the div size on a window resize.
		$(window).on('resize', function(){
			_this.max_height = window.innerHeight;
//			scale();
		});

		return _this;
	};

	DICESTREAM.MAIN = MAIN();
};