/** array that has the die sizes */
this.DICETYPE = [3,4,6,8,10,12,20,100];

/** root variables to the various image paths used.*/
this.IMAGEROOT = "https://commondatastorage.googleapis.com/dicestream/images";
this.DICEROOT = "/standard";
this.PNG = ".png";

/** Sets the number of dice per row. */
this.NUM_DICE_PER_ROW=10;

/** Vertical offset for canvas objects */
this.CANVAS_V_OFFSET = -.055;

/** Vertical offest for string overlays */
this.STRING_OVERLAY_V_OFFSET = .06;

/** Space between rows of dice*/
this.DICE_ROW_OFFSET = .08;

/** Space between columns of dice */
this.DICE_COL_OFFSET = .125;

/** offset for circle and hex overlays */ 
this.SELECTION_OFFSET_X = .05475;
this.SELECTION_OFFSET_Y = .1

/** lower 3rd position values */
this.MAIN_WIDTH = 485;
this.MAIN_HEIGHT = 26;
this.MAIN_POS_X = .05;
this.MAIN_POS_Y = .52;
	
this.SEC_WIDTH = 434;
this.SEC_HEIGHT = 18;
this.SEC_POS_X = .07;
this.SEC_POS_Y = .59;

/** selection overlay types */
this.SELECTION_NONE = 0;
this.SELECTION_CIRCLE = 1;
this.SELECTION_HEX = 2;
this.SELECTION_X = 3;

/** permissions for overlay types */
this.SELECTION_ALLOW = [true, true, true, true];

/** dice image overlay colors */
this.SELECTION_COLOR = ['transparent', '#54A954','#000000','#802015'];

/** lower 3rd overlay values*/
this.main_context_bg;
this.main_context_text;
this.second_context_bg;
this.second_context_text;

/** max height variable, changed on resize */
this.max_height = $(window).height();

/** lower 3rd secondary background color*/
this.lower_3rd_secondary = '#105080';

/** append dice to existing roll*/
this.append_to_roll = true;

/** clear selection after roll*/
this.clear_die_selection = true;

/** initializes the various arrays used to hold the overlays */
this.rolledDiceOverlayArray = [];
this.effectOverlayArray = [];
this.stringsOverlayArray = [];

/** counter image and counter */
this.counter_image;
this.counter_overlay;
this.counter_image_resource;
this.counter_context;

/** file reader for avatar upload*/
this.fileReader = new FileReader();

/** avatar overlay */
this.avatar_overlay;
	
/** when the hangout is ready, initialize the app */
function init() {
	// When API is ready...                                                         
	gapi.hangout.onApiReady.add(
	function(eventObj) {
		if(eventObj.isApiReady) {
			//Needed for Firefox which hides the display at startup
			document.getElementById('app-gui').style.visibility = 'visible';
			initDiceUI();
			initWidgets();
			initPPOverlays();
			setPP(1);	
			scale();
		}
	});
};

/** takes the input text and creates a text overlay on the screen */
function makeText(text){
	var canvasContext = createTextContext(text);
	this.stringsOverlayArray.push(makeOverlayFromContext(canvasContext, 1, 0, .40 - (this.stringsOverlayArray.length * this.STRING_OVERLAY_V_OFFSET) ) );
	createTextCheckbox(text);
};

function createTextContext(text, color, font){
	var canvas = $('#textCanvas').clone();
	var textContext = canvas[0].getContext("2d");
	textContext.font = font ? font : "20px Verdana";
	textContext.fillStyle = color ? color : "#000000";
	textContext.fillText(text, 20, 20);
	return textContext;
};

function makeLower3rd(main, sec){
	make3rdMain(main);
	make3rdSec(sec);
	makeAvatar()
	$('#toggle3rd').attr('checked', true);
};

function make3rdMain(main){
	disposeOverlay(this.main_context_bg);
	var canvas = $('#mainThirdCanvas').clone();
	var mainContextBg = canvas[0].getContext("2d");
	mainContextBg.fillStyle = "#ffffff";
	mainContextBg.fillRect(0, 0, MAIN_WIDTH, 28);
	this.main_context_bg = makeOverlayFromContext(mainContextBg, 1, MAIN_POS_X, MAIN_POS_Y);
	
	disposeOverlay(this.main_context_text);
	var canvas2 = $('#mainThirdCanvas').clone();
		var mainContextText = canvas2[0].getContext("2d");
	mainContextText.font = "24px Verdana";
	mainContextText.lineWidth = 1;
	mainContextText.fillStyle = "#000000";
	mainContextText.fillText(main, 0, MAIN_HEIGHT);
	this.main_context_text =makeOverlayFromContext(mainContextText, 1, MAIN_POS_X, MAIN_POS_Y - .01);
};

function make3rdSec(sec){
	disposeOverlay(this.second_context_bg);
	var canvas3 = $('#secThirdCanvas').clone();
	var secondContextBg = canvas3[0].getContext("2d");
	secondContextBg.fillStyle = this.lower_3rd_secondary;
	secondContextBg.fillRect(0, 0, SEC_WIDTH, 18);
	this.second_context_bg = makeOverlayFromContext(secondContextBg, 1, SEC_POS_X, SEC_POS_Y);
	
	disposeOverlay(this.second_context_text);
	var canvas4 = $('#secThirdCanvas').clone();
	var secondContextText = canvas4[0].getContext("2d");
	secondContextText.font = "16px Verdana";
	secondContextText.lineWidth = 1;
	secondContextText.fillStyle = "#000000";
	secondContextText.fillText(sec, 0, SEC_HEIGHT);
	this.second_context_text = makeOverlayFromContext(secondContextText, 1, SEC_POS_X, SEC_POS_Y - .01);	
};

/** quick, hacky way to upload an avatar, 256 x 256 only*/
function makeAvatar(){
	readImageFromInput(document.getElementById("avatarFile"), function(data){
		if(data === false || data.result === false){
			return;
		}

		disposeOverlay(this.avatar_overlay);
		var imageCanvas = $('#imgThirdCanvas').clone();
		var imageContext = imageCanvas[0].getContext("2d"); 
		this.avatar_overlay = this.makeOverlay(gapi.hangout.av.effects.createImageResource(data.result), .175, .385, .375);
	});
};

/** get a dataURL from a selected file*/
function readImageFromInput(input, callback){
	if(input.files.length == 0){
		callback.call(this, false);
		return false;
		}
	this.fileReader.onloadend = function(evt){
		callback.call(this, evt.target)
	}.bind(this);

	return this.fileReader.readAsDataURL(input.files[0]);
}

/** helper method to dispose of hangout overlay */
function disposeOverlay(overlay){
	if(overlay){
		overlay.setVisible(false);
		overlay.dispose();
	}
};

/** create a hangout overlay from an HTML5 canvas context */
function makeOverlayFromContext(context, scale, xval, yval){
	var canvasImage = gapi.hangout.av.effects.createImageResource(context.canvas.toDataURL());
	return makeOverlay(canvasImage, scale, xval, yval);
};
	
/** creat a Hangout overlay from a Hangout resource */
function makeOverlay(resource, scale, xval, yval){
	var overlay = resource.createOverlay({});
	overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
	overlay.setPosition({x: xval, y: yval + this.CANVAS_V_OFFSET});
	overlay.setVisible(true);
	return overlay;
};

//** create a checkbox and label with the string that 
function createTextCheckbox(text){
	var textControl = createElement("ul");	
	var colorPicker = createElement("input", {"type" : "minicolors", "data-textfield" : "false", "data-default" : "#000000"})
					.change(function(){
	 				// callback of 'minicolor' color selection widget, $(this).val() will 
					// get the hex value of the currently selected color in the widget
						editTextColor(textControl, $(this).val());
					});
	var closeButton = createElement("a",{"display": "inline", "type": "button", "class": "btn btn-danger btn-mini removeText", "href": "#"})
					.append("<i class='icon-remove'></i>")
					.click(function(){
						removeText(textControl);
					});
	var label = createElement("input",{"display": "inline", "class": "textCheckbox", "type": "text"}).val(text)
					.change(function(){
						editText(textControl, $(this).val());
					});
	$(textControl).append(colorPicker);
	$(textControl).append(closeButton);
	$(textControl).append(label);
	$(textControl).data("color", $(colorPicker).val());
	$(textControl).data("text", $(label).val());
	
	$("#stringList").prepend(textControl);
	$.minicolors.init();
};

/** TODO - remove this and use the clone existing cavnas elements for specific things.
helper method to create canvas contexts on the fly*/
function createContext(w, h) {
	var canvas = createElement("canvas").height(h).width(w)[0];
    var context = canvas.getContext("2d");
    return context;
}

/** actions that are tied to UI listeners */

function rollDiceButton(){
	if(!append_to_roll)
	{
		clearDice();
		initDiceFields();
	}
	
	rollDice();	
	
	if(clear_die_selection)
	{
		initInputFields();
	}
};

function clearDiceButton(){
	initInputFields();
	initDiceFields();
	clearDice();
};

function togglePPAction(cb){
	this.counter_overlay.setVisible(cb.checked);
	this.counter_image.setVisible(cb.checked);

	$("#ppcount").toggleClass('disabled');
	$("#ppadd").toggleClass('disabled');
	$("#ppminus").toggleClass('disabled');
};

function toggle3rdAction(third){
	main_context_bg.setVisible(third.checked);
	main_context_text.setVisible(third.checked);
	second_context_bg.setVisible(third.checked);
	second_context_text.setVisible(third.checked);
	avatar_overlay.setVisible(third.checked);
};

function isVideoMirrored(mirrored){
	gapi.hangout.av.setLocalParticipantVideoMirrored(!mirrored.checked);
}


function toggleSelectionAction(cb){
	switch($(cb).attr('id'))
	{
		case 'toggleCircle':
			SELECTION_ALLOW[SELECTION_CIRCLE]=cb.checked;
			break;
		case 'toggleHex':
			SELECTION_ALLOW[SELECTION_HEX]=cb.checked;
			break;
		case 'toggleX':
			SELECTION_ALLOW[SELECTION_X]=cb.checked;
			break;			
	}
};

function toggleClearAfterRoll(cb){
	clear_die_selection = cb.checked;
};

function toggleAppendToRoll(cb){
	append_to_roll = cb.checked;
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


function ppadd(){
	add('ppcount', 99);
	setPP($("#ppcount").text());
};

function ppminus(){
	minus('ppcount', 0);
	setPP($("#ppcount").text());
};

/** for the selected id, if the value is less than the possible 
    max value, add 1 to it.*/
function add(id, max){
	var value = $("#" + id).text();
	if(value < max)
	{
		value++;
		$("#" + id).text(value);
	}
};

/** for the selected id, if the value is greater than the 
    possible min value, subtract 1 from it */
function minus(id, min){
	var value = $("#" + id).text();
	if(value > min)
	{
		value--;
		$("#" + id).text(value);
	}
};

function toggleDiv(div){
	$('#'+div).slideToggle();
	$('#'+div).prev().find('i').toggleClass('icon-circle-arrow-down');
	$('#'+div).prev().find('i').toggleClass('icon-circle-arrow-left');
};

function modifyText(id){
	this.stringsOverlayArray.splice(id, 1);
};

/** edit the text in a overlay */
function editText(data, text){
	var inverseLocation = this.stringsOverlayArray.length - $("ul").index(data) -1;	
	data.data('text', text);
	var rrggbb = data.data('color');
	this.stringsOverlayArray[inverseLocation].setVisible(false);
	this.stringsOverlayArray[inverseLocation].dispose();
	this.stringsOverlayArray[inverseLocation] = makeOverlayFromContext(createTextContext(text, rrggbb), 1, 0, .40 - (inverseLocation * this.STRING_OVERLAY_V_OFFSET) );
};

/** edit the color in an overlay */
function editTextColor(data, rrggbb){
	var inverseLocation = this.stringsOverlayArray.length - $("ul").index(data) -1;	
	var text = data.data('text');
	data.data('color', rrggbb);
	this.stringsOverlayArray[inverseLocation].setVisible(false);
	this.stringsOverlayArray[inverseLocation].dispose();
	this.stringsOverlayArray[inverseLocation] = makeOverlayFromContext(createTextContext(text, rrggbb), 1, 0, .40 - (inverseLocation * this.STRING_OVERLAY_V_OFFSET) );
};


/** remove the text overlay from the screen and its matching text
    check box in the GUI */
function removeText(data){
	//remove the overlay information.  We reverse the ul list in the GUI, so we need to grab the
	//'inverse location' of the ul list to correctly map to the array position
	var inverseLocation = this.stringsOverlayArray.length - $("ul").index(data) -1;	

	this.stringsOverlayArray[inverseLocation].setVisible(false);
	this.stringsOverlayArray[inverseLocation].dispose();	
	
	//splice to modify the size of the array...
	this.stringsOverlayArray.splice(inverseLocation,1);
	//...because the remove will modify the size of the ul list.
	$(data).remove();
	
	//redraw the overlays, starting at the location where the item was removed
	for(;inverseLocation<this.stringsOverlayArray.length;inverseLocation++)
	{
		var existingText = this.stringsOverlayArray[inverseLocation];
		this.stringsOverlayArray[inverseLocation].setPosition({x: existingText.getPosition().x, y: existingText.getPosition().y + this.STRING_OVERLAY_V_OFFSET});
	}
};

function rollDice() {
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
			positionOverlays(overlay, this.rolledDiceOverlayArray.length-1, true);
			
			var diceDiv = document.createElement("span");
			$(diceDiv).data("die", {size: DICETYPE[i], face: value, position: rolledDiceOverlayArray.length, overlay: SELECTION_NONE});
			
			//Enable selection of overlay dice by clicking the matching die in the control panel
			$(diceDiv).addClass("rolledDice").prepend("<img src='"+imageUrl+"' />").click(function(){
				selectDieOverlay(this);
			});
			$("#rolledDiceDiv").append(diceDiv);
		}
	}
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
			case SELECTION_CIRCLE:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_CIRCLE]});
				modifyTotal('+', $(div).data('die').face);
				//make the circle overlay
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					effectOverlayArray[diePosition].dispose();
				}						
				var circleContext = drawCircle(16,16,12,3);
				effectOverlayArray[diePosition]=makeOverlayFromContext(circleContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
				break;
			case SELECTION_HEX:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_HEX]});
				modifyTotal('-', $(div).data('die').face);
				//make the hex overlay
				var hexContext = drawHex(16,16,12,3);
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					effectOverlayArray[diePosition].dispose();
				}
				effectOverlayArray[diePosition]=makeOverlayFromContext(hexContext, 1, newx - SELECTION_OFFSET_X , newy-SELECTION_OFFSET_Y);	
				break;
			case SELECTION_X:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_X]});
				var xContext = drawX(3);
				//remove the effect overlay
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					effectOverlayArray[diePosition].dispose();
				}		
				effectOverlayArray[diePosition]=makeOverlayFromContext(xContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);	
				break;
			case SELECTION_NONE:
			default:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_NONE]});
				//remove the effect overlay
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
				}		

		}
		$(div).data('die').overlay = nextSelection;
	//}
};

function findNextOverlay(pos){
	if(pos+1 >= SELECTION_ALLOW.length)
	{
		return SELECTION_NONE;
	}
	else if(SELECTION_ALLOW[pos+1])
	{
		return pos + 1;
	}
	else
	{
		return findNextOverlay(pos+1);
	}
};

function clearDice() {
	clearDiceArrays();
	this.rolledDiceOverlayArray.length = 0;
	this.effectOverlayArray.length = 0;
	modifyTotal('=', 0);
};

function clearDiceArrays() {
	this.rolledDiceOverlayArray.forEach(setDieArrayFalse);
	this.effectOverlayArray.forEach(setDieArrayFalse);
};

function setDieArrayFalse(value, index, array) {
	value.dispose();
};

/** displays the dice overlays across the top of the screen */
function positionOverlays(value, index, display){
	var rowOffset = ((index - (index % NUM_DICE_PER_ROW)) / NUM_DICE_PER_ROW) * this.DICE_COL_OFFSET;
	var columnOffset = (index % NUM_DICE_PER_ROW ) * this.DICE_ROW_OFFSET;
	value.setPosition({x: -.45 + columnOffset, y:-.425 + rowOffset});
	value.setVisible(display);
};

//TOOD having the position of canvas overlays be standarized
function positionCanvasOverlays(overlay, index, display){
	
};

/** changes the dice skin to be used */
function setDice(value){
	this.DICEROOT = $("#selectDieSet").val();
};

function setPP(value, color){		
	if(this.counter_overlay){this.counter_overlay.setVisible(false);}
	
	this.counter_context = createContext(32, 32);
	this.counter_context.font = "20px Verdana";
	this.counter_context.fillStyle = color ? color : $("#ppcolor").val();
	this.counter_context.fillText(value, 0, 20);
	this.counter_overlay = makeOverlayFromContext(this.counter_context, 1, .93, 0);
};

//TODO 
function initPPOverlays(){	
	this.counter_image_resource = gapi.hangout.av.effects.createImageResource(IMAGEROOT + DICEROOT + '/shieldpp' + PNG);
	this.counter_image = this.counter_image_resource.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
	this.counter_image.setPosition({x: .45, y:-.425});
	this.counter_image.setVisible(true);
};

function initDiceUI(){
	defaultDOM();
};

function initWidgets(){
	//create a callback to change the color of the pp counter
	$("#ppcolor").change(function(){
			// callback of 'minicolor' color selection widget, $(this).val() will 
			// get the hex value of the currently selected color in the widget
				setPP($("#ppcount").text(), $(this).val());
			});

	$("#selectedcolorselect").change(function(){
				SELECTION_COLOR[SELECTION_CIRCLE] = $(this).val();
			});

	$("#effectcolorselect").change(function(){
				SELECTION_COLOR[SELECTION_HEX] = $(this).val();
			});
			
	$("#xcolorselect").change(function(){
				SELECTION_COLOR[SELECTION_X] = $(this).val();
			});
			
	$("#lower3rdsecselect").change(function(){
				lower_3rd_secondary = $(this).val();
				if($('#toggle3rd').attr('checked')){
					make3rdSec($("#lower3rdsec").val());
				}
			});
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
//	this.arraySize = 0;
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

function initDiceFields(){
	$("#rolledDiceDiv").text("");
};

/** helper to draw a Hex */
function drawHex(x,y,L,thick){
	return drawPolygon(x,y,6,L,thick);
};

/** draw a regular polygon on an HTML5 canvas object */
function drawPolygon(x0,y0,numOfSides,L,lineThickness) {
    var shapeContext = createContext(256, 256);
	//var canvas = $('#overlayCanvas').clone();
	//var shapeContext = canvas[0].getContext("2d");
    var firstX;
    var firstY;
    shapeContext.translate(0.5, 0.5);
    shapeContext.strokeStyle = this.SELECTION_COLOR[this.SELECTION_HEX];
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
function drawCircle(x0,y0,radius,lineThickness) {
	var circleContext = createContext(256, 256);
	//var canvas = $('#overlayCanvas').clone();
	//var circleContext = canvas[0].getContext("2d");
	circleContext.translate(0.5, 0.5);
	circleContext.beginPath();
	circleContext.arc(x0, y0, radius, 0, 2 * Math.PI, false);
	circleContext.lineWidth = lineThickness;
	circleContext.strokeStyle = this.SELECTION_COLOR[this.SELECTION_CIRCLE];
    circleContext.stroke();
    return circleContext;
};

/** draw an x on an HTML5 canvas object */
function drawX(lineThickness) {
	var xContext = createContext(256, 256);
	//var canvas = $('#overlayCanvas').clone();
	//var xContext = canvas[0].getContext("2d");
	xContext.translate(0.5, 0.5);
	xContext.lineWidth = lineThickness;
	xContext.strokeStyle = this.SELECTION_COLOR[this.SELECTION_X];
	xContext.beginPath();

    xContext.moveTo(4, 4);
    xContext.lineTo(28, 28);

    xContext.moveTo(28, 4);
    xContext.lineTo(4, 28);
    xContext.stroke();
	return xContext;
};

/** helper method to create an html element in jquery */
function createElement(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
};

/** */
function windowResize(event){
	this.max_height = window.innerHeight;
	this.scale();
};

/** */
function scale(){
	jQuery("#app-gui").height(this.max_height-84);
};

function makeDiceSpan(dieSize) {
	var dieVal = "d"+dieSize;
	var span = createElement("span");
	$(span).append(createElement("input", {"type" : "button", "class" : "button btn btn-mini", "id" : dieVal+"minus", "value" : "-"}).click(function(){minus(dieVal+"count", 0);}));
	$(span).append(createElement("span", {"class" : "rolledDice"}).append(createElement("img", {"src" : "https://commondatastorage.googleapis.com/dicestream/images/standard/"+dieVal+".png"})));
	$(span).append(createElement("input", {"type" : "button", "class" : "button btn btn-mini", "id" : dieVal+"plus", "value" : "+"}).click(function(){add(dieVal+"count", 99);}));
	$(span).append(createElement("span", {"class" : "dieCount label", "id" : dieVal+"count"}).text("0"));
	return span;
};

function makeDiceButtonDiv() {
	var row = createElement("div", {"class" : "row"});
	$(row).append(createElement("span", {"class" : "leftDice disabled"}).text("Current Total"));
	
	var span = createElement("span", {"class" : "rightDice"});
	var rollButton = createElement("input", {"class" : "button btn btn-primary", "type" : "button", "value" : "Roll", "id" : "roll"}).click(function(){rollDiceButton();});
	var clearButton = createElement("input", {"class" : "button btn btn-primary", "type" : "button", "value" : "Clear", "id" : "clear"}).click(function(){clearDiceButton();});
	$(span).append(rollButton);
	$(span).append(clearButton);
	
	$(row).append(span);

	return row;
};

function makeCounterDiv() {
	var row = createElement("div", {"class" : "row", "id" : "plotPointDiv"});
	var span = createElement("span", {"class" : "leftDice", "id" : "plotPointSpan"});
	$(span).append(createElement("input", {"id" : "ppcolor", "type" : "minicolors", "data-textfield" : "false", "data-default" : "#000000"}).text(""));
	$(span).append(createElement("input", {"id" : "togglePP", "type" : "checkbox", "checked":"checked"}).click(function () {togglePPAction(this);}));
	$(span).append(createElement("span", {"id" : "ppname", "class" : "button"}).text("Counter"));
	$(span).append(createElement("input", {"id" : "ppminus", "class" : "button btn btn-mini", "type" : "button", "value" : "-"}).click(function () {ppminus();}));
	$(span).append(createElement("input", {"id" : "ppadd", "class" : "button btn btn-mini", "type" : "button", "value" : "+"}).click(function () {ppadd();}));
	$(span).append(createElement("span", {"id" : "ppcount", "class" : "diecount label"}).text("1"));	
	$(row).append(span);
	return row;
};

/** DOM builders, this changes what interface is used*/

/** builds starter DOM
    all dice and counter*/
function defaultDOM() {
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
	$.minicolors.init();
};

/** builds layout for cortext+ games
    d4, d6, d8, d10, d12, and counter*/
function cortexDOM() {
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
	$.minicolors.init();
};

/** builds layout for fate and fudge games
    df and counter*/
function fateFudgeDOM() {
	row = createElement("div", {"class" : "row"});
	$(row).append(makeDiceSpan('3').addClass('leftDice'));
	$("#diceDiv").append(row);
	$("#diceDiv").append(makeDiceButtonDiv());
	$("#diceDiv").append(makeCounterDiv());
	$.minicolors.init();
};

/** builds Marvel DOM, and switches to Marvel dice set */
function marvelDOM() {

	$("#diceDiv").append(makeDiceButtonDiv());
	$("#diceDiv").append(makeCounterDiv());
	$.minicolors.init();
};

/** builds Dresden Files DOM, and switches to Dredsen Files dice set */
function dresdenDOM() {

	$("#diceDiv").append(makeDiceButtonDiv());
	$("#diceDiv").append(makeCounterDiv());
	$.minicolors.init();
};

/** builds Fiasco DOM, and switches to  Fiasco dice set */
function fiascoDOM() {

	$("#diceDiv").append(makeDiceButtonDiv());
};


// Wait for gadget to load.                                                       
gadgets.util.registerOnLoadHandler(init);
gapi.hangout.av.setLocalParticipantVideoMirrored(false);
jQuery(window).resize(this.windowResize.bind(this));