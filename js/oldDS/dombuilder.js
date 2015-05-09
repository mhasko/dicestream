var DICESTREAM = DICESTREAM || {};

if(!DICESTREAM.DOM_BUILDER) {

	DOM_BUILDER = function() {
		var _this = {};
		
		var VERSION = "v" + "2.0.0";
		var DICE_CREDITS = "Dice icons by Alex Guillotte";  
        var HELP_CREDITS = "Help text by Stephanie Bryant";

		/** DOM builders, this changes what interface is used*/

		/** builds starter DOM all dice and counter*/
		_this.defaultDOM = function() {
			var row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('4').addClass('leftDice'));
			$(row).append(makeDiceSpan('6').addClass('rightDice'));
			$("#diceDiv").append(row);

			row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('8').addClass('leftDice'));
			$(row).append(makeDiceSpan('10').addClass('rightDice'));
			$("#diceDiv").append(row);

			row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('12').addClass('leftDice'));
			$(row).append(makeDiceSpan('20').addClass('rightDice'));
			$("#diceDiv").append(row);

			row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('3').addClass('leftDice'));
			$(row).append(makeDiceSpan('100').addClass('rightDice'));
			$("#diceDiv").append(row);

			$("#diceDiv").append(makeDiceButtonDiv());
			$("#diceDiv").append(makeCounterDiv());
            $("#diceDiv").append(makeRolledDiceDiv());
			$("#diceDiv").append(makeDiceHelpDiv());
			$.minicolors.init();
		};

		/** builds layout for cortext+ games d4, d6, d8, d10, d12, and counter*/
		_this.cortexDOM = function() {
			var row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('4').addClass('leftDice'));
			$(row).append(makeDiceSpan('6').addClass('rightDice'));
			$("#diceDiv").append(row);

			row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('8').addClass('leftDice'));
			$(row).append(makeDiceSpan('10').addClass('rightDice'));
			$("#diceDiv").append(row);

			row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('12').addClass('leftDice'));
			$(row).append(makeDiceSpan('20').addClass('rightDice'));
			$("#diceDiv").append(row);

			$("#diceDiv").append(makeDiceButtonDiv());
			$("#diceDiv").append(makeCounterDiv());
            $("#diceDiv").append(makeRolledDiceDiv());
			$("#diceDiv").append(makeDiceHelpDiv());
			//$(row).minicolors();
		};

		/** builds layout for fate and fudge games df and counter*/
		_this.fateFudgeDOM = function() {
			row = createElement("div", {"class" : "row"});
			$(row).append(makeDiceSpan('3').addClass('leftDice'));
			$("#diceDiv").append(row);
			$("#diceDiv").append(makeDiceButtonDiv());
			$("#diceDiv").append(makeCounterDiv());
            $("#diceDiv").append(makeRolledDiceDiv());
			$("#diceDiv").append(makeDiceHelpDiv());
			$.minicolors.init();
		};

		/** builds Marvel DOM, and switches to Marvel dice set */
		_this.marvelDOM = function() {

			$("#diceDiv").append(makeDiceButtonDiv());
			$("#diceDiv").append(makeCounterDiv());
            $("#diceDiv").append(makeRolledDiceDiv());
			$("#diceDiv").append(makeDiceHelpDiv());
			$.minicolors.init();
		};

		/** builds Dresden Files DOM, and switches to Dredsen Files dice set */
		_this.dresdenDOM = function() {

			$("#diceDiv").append(makeDiceButtonDiv());
			$("#diceDiv").append(makeCounterDiv());
            $("#diceDiv").append(makeRolledDiceDiv());
			$("#diceDiv").append(makeDiceHelpDiv());
			$.minicolors.init();
		};

		/** builds Fiasco DOM, and switches to  Fiasco dice set */
		_this.fiascoDOM = function(){
			$("#diceDiv").append(makeDiceButtonDiv());
            $("#diceDiv").append(makeRolledDiceDiv());
			$("#diceDiv").append(makeDiceHelpDiv());
		};
		
		_this.textDOM = function(){
			$("#textTab").append(makeTextDiv());
		};
		
		_this.thirdDOM = function(){
			$("#lowerThirdTab").append(makeThirdDiv());
		
		};
		
		_this.settingsDOM = function(){
			$("#settingsTab").append(makeSettingsDiv());
		
		};
		
		//** create a checkbox and label with the string that 
		_this.createTextCheckbox = function(text){
			var textControl = createElement("ul");	
			var colorPicker = createElement("input", {"type" : "minicolors", "data-textfield" : "false", "data-default" : "#000000"})
							.change(function(){
							// callback of 'minicolor' color selection widget, $(this).val() will 
							// get the hex value of the currently selected color in the widget
								DICESTREAM.EFFECTS.editTextColor(textControl, $(this).val());
							});
			var closeButton = createElement("a",{"display": "inline", "type": "button", "class": "btn btn-danger btn-mini removeText", "href": "#"})
							.append("<i class='icon-remove'></i>")
							.click(function(){
								DICESTREAM.EFFECTS.removeText(textControl);
							});
			var label = createElement("input",{"display": "inline", "class": "textCheckbox", "type": "text"}).val(text)
							.change(function(){
								DICESTREAM.EFFECTS.editText(textControl, $(this).val());
							});
			$(textControl).append(colorPicker);
			$(textControl).append(closeButton);
			$(textControl).append(label);
			$(textControl).data("color", $(colorPicker).val());
			$(textControl).data("text", $(label).val());

			$("#stringList").prepend(textControl);
			$.minicolors.init();
		};
		
		/** helper method to create an html element in jquery */
		_this.createElement = function(type, attr){
			return jQuery("<" + type + ">").attr(attr || {});
		};
		
		function createElement(type, attr) {
			return _this.createElement(type, attr);
		};
        
        function makeRolledDiceDiv() {
            var div = createElement("div", {"class" : "groupDiv", "id" : "rolledDiceDiv"});
            return div;
        };
		
		function makeDiceSpan(dieSize) {
			var dieVal = "d"+dieSize;
			var span = createElement("span");
			$(span).append(createElement("input", {"type" : "button", "class" : "button btn btn-mini", "id" : dieVal+"minus", "value" : "-"}).click(function(){DICESTREAM.ACTIONS.minus(dieVal+"count", 0);}));
			//TODO -- hard coded image path
			$(span).append(createElement("span", {"class" : "rolledDice"}).append(createElement("img", {"src" : "https://s3.amazonaws.com/dicestream/images/captaingothnog/"+dieVal+".png"}).click(function(){DICESTREAM.DICE.rollSpecificDice(dieSize);})));
			$(span).append(createElement("input", {"type" : "button", "class" : "button btn btn-mini", "id" : dieVal+"plus", "value" : "+"}).click(function(){DICESTREAM.ACTIONS.add(dieVal+"count", 99);}));
			$(span).append(createElement("span", {"class" : "dieCount label", "id" : dieVal+"count"}).text("0"));
			return span;
		};

		function makeDiceButtonDiv() {
			var row = createElement("div", {"class" : "row"});
			//$(row).append(createElement("span", {"class" : "leftDice disabled"}).text("Current Total"));

			var div = createElement("div", {"id" : "diceButtonDiv"});
			var rollButton = createElement("input", {"class" : "button btn btn-primary", "type" : "button", "value" : "Roll", "id" : "roll"}).click(function(){DICESTREAM.ACTIONS.rollDiceButton();});
			var clearButton = createElement("input", {"class" : "button btn btn-primary", "type" : "button", "value" : "Clear", "id" : "clear"}).click(function(){DICESTREAM.ACTIONS.clearDiceButton();});
			$(div).append(rollButton);
			$(div).append(clearButton);
			
			$(row).append(div);

			/*var debugDiv = createElement("div", {"id" : "debugDiv"});
			var debugInput = createElement("input", {"type" : "text", "id" : "debugtext"});
			var debugButton = createElement("input", {"class" : "button btn btn-primary", "type" : "button", "value" : "Debug", "id" : "debugbtn"}).click(function(){DICESTREAM.DICE.setOffset(debugtext.value);});
			$(debugDiv).append(debugInput);
			$(debugDiv).append(debugButton);
			$(row).append(debugDiv);*/

			return row;
		};
		
		function makeCounterDiv() {
			var row = createElement("div", {"class" : "row", "id" : "plotPointDiv"});
			var span = createElement("span", {"class" : "leftDice", "id" : "plotPointSpan"});
			$(span).append(createElement("input", {"id" : "ppcolor", "type" : "minicolors", "data-textfield" : "false", "data-default" : "#000000"}).text(""));
			$(span).append(createElement("input", {"id" : "togglePP", "class" : "checkbox", "type" : "checkbox", "checked":"checked"}).click(function () {DICESTREAM.ACTIONS.togglePPAction(this);}));
			$(span).append(createElement("span", {"id" : "ppname", "class" : "button"}).text("Counter"));
			$(span).append(createElement("input", {"id" : "ppminus", "class" : "button btn btn-mini", "type" : "button", "value" : "-"}).click(function () {DICESTREAM.ACTIONS.ppminus();}));
			$(span).append(createElement("input", {"id" : "ppadd", "class" : "button btn btn-mini", "type" : "button", "value" : "+"}).click(function () {DICESTREAM.ACTIONS.ppadd();}));
			$(span).append(createElement("span", {"id" : "ppcount", "class" : "diecount label"}).text("1"));	
			
			$(row).append(span);
			return row;
		};
		
		//TODO -- create generic 'createHelpDiv' function, keep help text in static json files
		function makeDiceHelpDiv(){
            var helpTxt = createElement("div", {"id" : "makeTextHelp", "class" : "helpDiv"});
			var header = createElement("span", {"class" : "helpTitle"}).text("Hide Help");
            $(helpTxt).css( 'cursor', 'pointer' );
			$(helpTxt).append(header).click(function(){
				$(".helpList").toggle();
				$(".helpTitle").text($(header).text() === "Display Help For Tab" ? "Hide Help" : "Display Help For Tab");
			});
			
			//$(helpTxt).append(createElement("span", {"class" : "helpHeader"}).text("Set up options for the rest of the tabs"));
			var helpList = createElement("ul", {"id" : "helpListDice", "class" : "helpList"}).text("Pick the number and type of dice and roll them! The Counter is for bennies/heroic points.");
			$(helpList).append(createElement("li").text("Click + and - to add dice to the roll."));
			$(helpList).append(createElement("li").text("Click the ROLL button to roll the dice."));
			$(helpList).append(createElement("li").text("Click CLEAR to deselect all dice and remove the results."));
			$(helpList).append(createElement("li").text("Click a die in the results to add a circle, hex, or X overlay. You can set the colors for these in the Settings tab."));
			$(helpList).append(createElement("li").text("The COUNTER displays a number in the upper right corner of your video feed. Select a color and check the box to have it appear. Click + or - to add and subtract to the count."));
			$(helpList).append(createElement("li").text("Note: There is no way to auto-add a modifier to a roll or automatically add up your dice results."));
			
			$(helpTxt).append(helpList);
			
			return helpTxt;
		};
		
		function makeTextDiv() {
			var dom = createElement("div", {"class" : "groupDiv", "id" : "stringDiv"});
			$(dom).append(createElement("input", {"id" : "txtField", "type" : "text"}));
			$(dom).append(createElement("input", {"id" : "textbtn", "class" : "button btn btn-success", "type" : "button", "value" : "Text"}).click(function () {DICESTREAM.ACTIONS.makeText(txtField.value);}));
			
			var div = createElement("div", {"id" : "screenStringDiv"});
			$(div).append(createElement("ol", {"id" : "stringList"}));
			$(dom).append(div);
			
            var helpTxt = createElement("div", {"id" : "makeTextHelp", "class" : "helpDiv"});
			var header = createElement("span", {"class" : "helpTitle"}).text("Hide Help");
            $(helpTxt).css( 'cursor', 'pointer' );
			$(helpTxt).append(header).click(function(){
				$(".helpList").toggle();
				$(".helpTitle").text($(header).text() === "Display Help For Tab" ? "Hide Help" : "Display Help For Tab");
			});
			
			var helpList = createElement("ul", {"class" : "helpList"}).text("Useful for displaying current statuses effects and aspects.");
			$(helpList).append(createElement("li").text("Write some text."));
			$(helpList).append(createElement("li").text("Click the TEXT button."));
			$(helpList).append(createElement("li").text("The text appears on your video feed in the lower left, above the lower-third bar. It also remains available in this tab."));
			$(helpList).append(createElement("li").text("To change the text color, after it's been added, click the color picker and select a new color."));
			$(helpList).append(createElement("li").text("Delete the text string using the X icon."));
			
			$(helpTxt).append(helpList);
			$(dom).append(helpTxt);
		
			return dom;			
		};
		
		function makeThirdDiv() {
			var dom = createElement("div", {"class" : "groupDiv", "id" : "lowerThird"});
			
			$(dom).append(createElement("span", {"class" : "lower3rdtitle"}).text("Main Title"));
			$(dom).append(createElement("input", {"class" : "lower3rdtextfield", "type" : "text", "id" : "lower3rdmain"}));
			$(dom).append(createElement("br"));
			$(dom).append(createElement("span", {"class" : "lower3rdtitle"}).text("Sub Title"));
			$(dom).append(createElement("input", {"class" : "lower3rdtextfield", "type" : "text", "id" : "lower3rdsec"}));
			$(dom).append(createElement("br"));
			
			var colorDiv = createElement("div");
			$(colorDiv).append(createElement("input", {"type" : "minicolors", "id" : "lower3rdsecselect", "data-textfield" : "false", "data-default" : "#105080"}));
			$(colorDiv).append(createElement("input", {"class" : "button btn", "type" : "button", "value" : "Create", "id" : "3rdbtn"}).click(function () {DICESTREAM.LOWERTHIRD.makeLower3rd(lower3rdmain.value, lower3rdsec.value);}));
			$(colorDiv).append(createElement("br"));
			$(colorDiv).append(createElement("input", {"type" : "checkbox", "class" : "checkbox", "id" : "toggle3rd"}).click(function () {DICESTREAM.LOWERTHIRD.toggle3rdAction(this);}));
			$(colorDiv).append(createElement("span" , {"class" : "checkboxText"}).text("Show/Hide Lower Third"));
			$(colorDiv).append(createElement("br"));
			$(dom).append(colorDiv);
			
			var uploadDiv = createElement("div", {"class" : "uploadAvatarDiv"});
			$(uploadDiv).append(createElement("span", {"value" : "Upload Avatar"}));
			$(uploadDiv).append(createElement("input", {"id" : "avatarFile", "type" : "file"}));
			$(dom).append(uploadDiv);
            
            var helpTxt = createElement("div", {"id" : "lowerThirdHelp", "class" : "helpDiv"});
			var header = createElement("span", {"class" : "helpTitle"}).text("Hide Help");
            $(helpTxt).css( 'cursor', 'pointer' );
			$(helpTxt).append(header).click(function(){
				$(".helpList").toggle();
				$(".helpTitle").text($(header).text() === "Display Help For Tab" ? "Hide Help" : "Display Help For Tab");
			});
			
			var helpList = createElement("ul", {"class" : "helpList"}).text("The Lower Third displays a static Title/Sub Title bar at the bottom of your video feed.");
			
			$(helpList).append(createElement("li").text("The Main Title displays as large black text on white background."));
			$(helpList).append(createElement("li").text("The Sub Title displays as smaller black text on whatever color you choose in the color picker."));
			$(helpList).append(createElement("li").text("Click the Choose File button to select an icon to appear to the right of the bar."));
			
			$(helpTxt).append(helpList);
			$(dom).append(helpTxt);
			
			$.minicolors.init();
			
			return dom;
		};
		
		function makeSettingsDiv() {
			var dom = createElement("div", {"class" : "groupDiv", "id" : "settingsDiv"});
			var selectionColors = createElement("div",{"id" : "selectionColors"});
			
			var circle = createElement("span", {"id" : "selectedColor"});
			//$(circle).append(createElement("input", {"type" : "minicolors", "id" : "selectedcolorselect", "data-textfield" : "false", "data-default" : "#54A954"}));
			$(circle).append(createElement("input", {"type" : "minicolors", "id" : "selectedcolorselect", "class" : "colorInputField", "data-textfield" : "false", "data-default" : "#54A954"}));
			$(circle).append(createElement("input", {"id" : "toggleCircle", "type" : "checkbox", "checked" : "checked", "class" : "button"}).click(function () {DICESTREAM.EFFECTS.toggleSelectionAction(this);}));
			$(circle).append(createElement("span", {"class" : "checkboxtext"}).text("Circle Color"));
			$(circle).append(createElement("br"));
			$(selectionColors).append(circle);
			
			var hex = createElement("span", {"id" : "effectColor"});
			$(hex).append(createElement("input", {"type" : "minicolors", "id" : "effectcolorselect", "class" : "colorInputField", "data-textfield" : "false", "data-default" : "#000000"}));
			$(hex).append(createElement("input", {"id" : "toggleHex", "type" : "checkbox", "checked" : "checked", "class" : "button"}).click(function () {DICESTREAM.EFFECTS.toggleSelectionAction(this);}));
			$(hex).append(createElement("span", {"class" : "checkboxtext"}).text("Hex Color"));
			$(hex).append(createElement("br"));
			$(selectionColors).append(hex);
			
			var xoverlay = createElement("span", {"id" : "xColor"});
			$(xoverlay).append(createElement("input", {"type" : "minicolors", "id" : "xcolorselect", "class" : "colorInputField", "data-textfield" : "false", "data-default" : "#802015"}));
			$(xoverlay).append(createElement("input", {"id" : "toggleX", "type" : "checkbox", "checked" : "checked", "class" : "button"}).click(function () {DICESTREAM.EFFECTS.toggleSelectionAction(this);}));
			$(xoverlay).append(createElement("span", {"class" : "checkboxtext"}).text("X Color"));
			$(xoverlay).append(createElement("br"));
			$(selectionColors).append(xoverlay);
			
			$(dom).append(selectionColors);
			
			$.minicolors.init();
			//<!--div>
			//	<select onchange="selectDiceAction()" id="selectDieSet"><option value="/marvel">Marvel Dice</option><option value="/real">Real Dice</option></select>
			//</div-->
			
			var diceReset = createElement("div", {"id" : "diceResetSettings"});
			$(diceReset).append(createElement("input", {"type" : "checkbox", "id" : "clearAfterRoll", "class" : "checkbox", "checked" : "checked"}).click(function() {DICESTREAM.ACTIONS.toggleClearAfterRoll(this);}));
			$(diceReset).append(createElement("span", {"class" : "checkboxText"}).text("Clear Dice Selection After Roll"));
			$(diceReset).append(createElement("br"));
			$(diceReset).append(createElement("input", {"type" : "checkbox", "id" : "appendToRoll", "class" : "checkbox"}).click(function() {DICESTREAM.ACTIONS.toggleAppendToRoll(this);}));
			$(diceReset).append(createElement("span", {"class" : "checkboxText"}).text("Clear Dice Before New Roll"));
			$(diceReset).append(createElement("br"));
			
			$(dom).append(diceReset);
			
			var mirrorVideo = createElement("div", {"id" : "mirrorVideoDiv"});
			$(mirrorVideo).append(createElement("input", {"type" : "checkbox", "id" : "mirrorVideo", "class" : "checkbox", "checked" : "checked"}).click(function() {DICESTREAM.EFFECTS.isVideoMirrored(this);}));
			$(mirrorVideo).append(createElement("span", {"class" : "checkboxText"}).text("Mirror Video"));
		
			$(dom).append(mirrorVideo);
			
			var explodeDice = createElement("div", {"id" : "explodeDiceDiv"});
			$(explodeDice).append(createElement("input", {"type" : "checkbox", "id" : "explodeDice", "class" : "checkbox"}).click(function(){DICESTREAM.DICE.toggleExplodeDice(this)}));
			$(explodeDice).append(createElement("span", {"class" : "checkboxText"}).text("Explode All Dice"));
			$(explodeDice).append(createElement("br"));
			$(explodeDice).append(createElement("br"));
			
			$(dom).append(explodeDice);
            
            var themeSelect = createElement("div", {"id" : "themeSelect"});
            var themeCombo = createElement("select", {"id" : "selectThemeSet"}).click(function(){DICESTREAM.EFFECTS.selectThemeAction(this)});
            $(themeCombo).append(createElement("option", {"value" : "default"}).text("Default"));
            $(themeCombo).append(createElement("option", {"value" : "fate"}).text("Fate"));
//			<div id="themeSelect">
//				<select onChange="selectThemeAction(this)" id="selectThemeSet">
//					<option value="default">Default</option>
//					<option value="fate">Fate</option>
//				</select>
//			</div>
            $(themeSelect).append(themeCombo);
            $(dom).append(themeSelect);

			var helpTxt = createElement("div", {"id" : "settingsHelp", "class" : "helpDiv"});
			var header = createElement("span", {"class" : "helpTitle"}).text("Hide Help");
            $(helpTxt).css( 'cursor', 'pointer' );
			$(helpTxt).append(header).click(function(){
				$(".helpList").toggle();
				$(".helpTitle").text($(header).text() === "Display Help For Tab" ? "Hide Help" : "Display Help For Tab");
			});
			
			//$(helpTxt).append(createElement("span", {"class" : "helpHeader"}).text("Set up options for the rest of the tabs"));
			var helpList = createElement("ul", {"class" : "helpList"}).text("Set up options for the rest of the tabs");
			$(helpList).append(createElement("li").text("Circle, Hex, X Colors are used for the overlay colors when you click the rolled dice."));
			$(helpList).append(createElement("li").text("Clear Dice Selection: If checked, after you roll, all the dice you rolled will be reset to 0."));
			$(helpList).append(createElement("li").text("Clear Dice Before New Roll: If checked, the dice you rolled will be removed from the screen before any new dice will be added."));
			$(helpList).append(createElement("li").text("Mirror Video: Flips your video feed. Used for most built-in webcams like iSight."));
			$(helpList).append(createElement("li").text("Explode All Dice: If you roll the maximum on a die, the die will automatically reroll."));
			
			$(helpTxt).append(helpList);
			$(dom).append(helpTxt);

//			var div = createElement("div", {"id" : "screenStringDiv"});
//			$(div).append(createElement("ol", {"id" : "stringList"}));
//			$(dom).append(div);
//			return dom;		
			
			var version = createElement("div", {"id" : "version"});
			$(version).append(VERSION);
			$(dom).append(version);
			
			var credits = createElement("div", {"id" : "imageCredit"});
			$(credits).append(DICE_CREDITS);
            $(credits).append(createElement("br"));
            $(credits).append(HELP_CREDITS);
			$(dom).append(credits);
			
			return dom; 
		};
		
		return _this;
	};

	DICESTREAM.DOM_BUILDER = DOM_BUILDER();
};
