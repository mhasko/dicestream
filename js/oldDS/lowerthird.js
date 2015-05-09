var DICESTREAM = DICESTREAM || {};

if(!DICESTREAM.LOWERTHIRD) {

	LOWERTHIRD = function() {
		var _this = {};
		
		/** lower 3rd position values */
		var MAIN_WIDTH = 485;
		var MAIN_HEIGHT = 26;
		var MAIN_POS_X = .07;
		var MAIN_POS_Y = .52;
	
		var SEC_WIDTH = 434;
		var SEC_HEIGHT = 18;
		var SEC_POS_X = .09;
		var SEC_POS_Y = .59;
		
		/** lower 3rd overlay values*/
		var main_context_bg;
		var main_context_text;
		var second_context_bg;
		var second_context_text;
		
		/** file reader for avatar upload*/
		var fileReader = new FileReader();

		/** avatar overlay */
		var avatar_overlay;
		
		/** lower 3rd secondary background color*/
		var lower_3rd_secondary = '#105080';
				
		_this.makeLower3rd = function(main, sec){
			make3rdMain(main);
			make3rdSec(sec);
			makeAvatar();
			$('#toggle3rd').attr('checked', true);
		};
		
		_this.toggle3rdAction = function(third){
			main_context_bg.setVisible(third.checked);
			main_context_text.setVisible(third.checked);
			second_context_bg.setVisible(third.checked);
			second_context_text.setVisible(third.checked); 
			if(avatar_overlay){avatar_overlay.setVisible(third.checked);}
		};
		
		//DICESTREAM.LOWERTHIRD.change3rdColor($(this).val());
		_this.change3rdColor = function(val){
			lower_3rd_secondary = val;
			if($('#toggle3rd').attr('checked')){
				make3rdSec($("#lower3rdsec").val());
			}
		};
		
		function make3rdMain(main){
			disposeOverlay(main_context_bg);
			var canvas = $('#mainThirdCanvas').clone();
			var mainContextBg = canvas[0].getContext("2d");
			mainContextBg.fillStyle = "#ffffff";
			mainContextBg.fillRect(0, 0, MAIN_WIDTH, 28);
			main_context_bg = DICESTREAM.EFFECTS.makeOverlayFromContext(mainContextBg, 1, MAIN_POS_X, MAIN_POS_Y);

			disposeOverlay(main_context_text);
			var canvas2 = $('#mainThirdCanvas').clone();
				var mainContextText = canvas2[0].getContext("2d");
			mainContextText.font = "24px Arial";
			mainContextText.lineWidth = 1;
			mainContextText.fillStyle = "#000000";
			mainContextText.fillText(main, 0, MAIN_HEIGHT);
			main_context_text = DICESTREAM.EFFECTS.makeOverlayFromContext(mainContextText, 1, MAIN_POS_X, MAIN_POS_Y - .01);
		};

		function make3rdSec(sec){
			disposeOverlay(second_context_bg);
			var canvas3 = $('#secThirdCanvas').clone();
			var secondContextBg = canvas3[0].getContext("2d");
			secondContextBg.fillStyle = lower_3rd_secondary;
			secondContextBg.fillRect(0, 0, SEC_WIDTH, 18);
			second_context_bg = DICESTREAM.EFFECTS.makeOverlayFromContext(secondContextBg, 1, SEC_POS_X, SEC_POS_Y);

			disposeOverlay(second_context_text);
			var canvas4 = $('#secThirdCanvas').clone();
			var secondContextText = canvas4[0].getContext("2d");
			secondContextText.font = "16px Arial";
			secondContextText.lineWidth = 1;
			secondContextText.fillStyle = "#000000";
			secondContextText.fillText(sec, 0, SEC_HEIGHT);
			second_context_text = DICESTREAM.EFFECTS.makeOverlayFromContext(secondContextText, 1, SEC_POS_X, SEC_POS_Y - .01);	
		};

		/** quick, hacky way to upload an avatar, 256 x 256 only*/
		function makeAvatar(){
			readImageFromInput(document.getElementById("avatarFile"), function(data){
				if(data === false || data.result === false){
					return;
				}

				disposeOverlay(avatar_overlay);
				var imageCanvas = $('#imgThirdCanvas').clone();
				var imageContext = imageCanvas[0].getContext("2d"); 
				avatar_overlay = DICESTREAM.EFFECTS.makeOverlay(gapi.hangout.av.effects.createImageResource(data.result), .175, .385, .375);
			});
		};
		
		/** get a dataURL from a selected file*/
		function readImageFromInput(input, callback){
			if(input.files.length == 0){
				callback.call(this, false);
				return false;
			}
			fileReader.onloadend = function(evt){
				callback.call(this, evt.target)
			}.bind(this);
	
			return fileReader.readAsDataURL(input.files[0]);
		}
		
		/** helper method to dispose of hangout overlay */
		function disposeOverlay(overlay){
			if(overlay){
				overlay.setVisible(false);
				overlay.dispose();
			}
		};
					
		return _this;
	};
	
		
	DICESTREAM.LOWERTHIRD = LOWERTHIRD();
};