var DICESTREAM = DICESTREAM || {};

if(!DICESTREAM.ACTIONS) {

	ACTIONS = function() {
		var _this = {};
		
		/** append dice to existing roll*/
		var append_to_roll = true;
		
		/** clear selection after roll*/
		var clear_die_selection = true;
	
		/** for the selected id, if the value is less than the possible 
			max value, add 1 to it.*/
		_this.add = function(id, max){
			var value = $("#" + id).text();
			if(value < max)
			{
				value++;
				$("#" + id).text(value);
			}
		};

		/** for the selected id, if the value is greater than the 
			possible min value, subtract 1 from it */
		_this.minus = function(id, min){
			var value = $("#" + id).text();
			if(value > min)
			{
				value--;
				$("#" + id).text(value);
			}
		};
		
		_this.ppadd = function(){
			_this.add('ppcount', 99);
			_this.setPP($("#ppcount").text());
		};

		_this.ppminus = function(){
			_this.minus('ppcount', 0);
			_this.setPP($("#ppcount").text());
		};			
		

		_this.rollDiceButton = function(){
			if(!append_to_roll)
			{
				DICESTREAM.DICE.clearDice();
				initDiceFields();
			}

			DICESTREAM.DICE.rollDice();	

			if(clear_die_selection)
			{
				initInputFields();
			}
		};

		_this.clearDiceButton = function(){
			initInputFields();
			initDiceFields();
			DICESTREAM.DICE.clearDice();
		};

		_this.togglePPAction = function(cb){
			//_this.
			DICESTREAM.EFFECTS.counter_overlay.setVisible(cb.checked);
			//_this.
			//DICESTREAM.EFFECTS.counter_image.setVisible(cb.checked);

			$("#ppcount").toggleClass('disabled');
			$("#ppadd").toggleClass('disabled');
			$("#ppminus").toggleClass('disabled');
		};
		
		_this.setPP = function(value, color){		
			if(DICESTREAM.EFFECTS.counter_overlay){DICESTREAM.EFFECTS.counter_overlay.setVisible(false);}
	
			var canvas = $('#counterCanvas').clone();
			DICESTREAM.EFFECTS.counter_context = canvas[0].getContext("2d");
			DICESTREAM.EFFECTS.counter_context.font = "48px Arial";
			DICESTREAM.EFFECTS.counter_context.fillStyle = color ? color : $("#ppcolor").val();
			DICESTREAM.EFFECTS.counter_context.fillText(value, 0, 80);
			DICESTREAM.EFFECTS.counter_overlay = DICESTREAM.EFFECTS.makeOverlayFromContext(DICESTREAM.EFFECTS.counter_context, 1, .9, -.4);
		};
		
		/** takes the input text and creates a text overlay on the screen */
		_this.makeText = function(text){
			var canvasContext = _this.createTextContext(text);
			DICESTREAM.EFFECTS.addString(DICESTREAM.EFFECTS.makeOverlayFromContext(canvasContext, 1, DICESTREAM.EFFECTS.STRING_OFFSET, .40 - (DICESTREAM.EFFECTS.stringCount() * DICESTREAM.EFFECTS.STRING_OVERLAY_V_OFFSET) ) );
			DICESTREAM.DOM_BUILDER.createTextCheckbox(text);
		};
		
		_this.createTextContext = function(text, color, font){
			var canvas = $('#textCanvas').clone();
			var textContext = canvas[0].getContext("2d");
			textContext.font = font ? font : "20px Arial";
			textContext.fillStyle = color ? color : "#000000";
			textContext.fillText(text, 20, 20);
			return textContext;
		};
		
		_this.toggleClearAfterRoll = function(cb){
			clear_die_selection = cb.checked;
		};

		_this.toggleAppendToRoll = function(cb){
			append_to_roll = cb.checked;
		};
		
		function initDiceFields(){
			$("#rolledDiceDiv").text("");
		};
		
		function initInputFields(){
			$("#d3count").text("0");
			$("#d4count").text("0");
			$("#d6count").text("0");
			$("#d8count").text("0");
			$("#d10count").text("0");
			$("#d12count").text("0");
			$("#d20count").text("0");
			$("#d100count").text("0");
		//	_this.arraySize = 0;
		};
		
		return _this;
	};
	
	DICESTREAM.ACTIONS = ACTIONS();
};