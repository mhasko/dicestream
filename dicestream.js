/** array that has the die sizes */
this.DICETYPE = [3,4,6,8,10,12,20]; //100

/** root variables to the various image paths used.*/
this.IMAGEROOT = "https://commondatastorage.googleapis.com/dicestream/images";
this.DICEROOT = "/marvel";
this.PNG = ".png";

/** Sets the number of dice per row. */
this.NUM_DICE_PER_ROW=10;

/** Vertical offset for canvas objects */
this.CANVAS_V_OFFSET = -.055;

/** Vertical offest for string overlays */
this.STRING_OVERLAY_V_OFFSET = .08;

/** Space between rows of dice*/
this.DICE_ROW_OFFSET = .08;

/** Space between columns of dice */
this.DICE_COL_OFFSET = .125;

/** offset for circle and hex overlays */ 
this.SELECTION_OFFSET_X = .0525;
this.SELECTION_OFFSET_Y = .1

/** selection overlay types */
this.SELECTION_NONE = 0;
this.SELECTION_CIRCLE = 1;
this.SELECTION_HEX = 2;
this.SELECTION_X = 3;

/** permissions for overlay types */
this.SELECTION_ALLOW = [true, true, true, true];

/** current overlay type */
this.SELECTION_IS = SELECTION_NONE;

/** dice image overlay colors */
this.SELECTION_COLOR = ['transparent', '#00ff00','#000000','#ff0000'];

/** lower 3rd overlay values*/
this.MAIN_CONTEXT_BG;
this.MAIN_CONTEXT_TEXT;
this.SECOND_CONTEXT_BG;
this.SECOND_CONTEXT_TEXT;

/** lower 3rd position values */
this.MAIN_WIDTH = 200;
this.MAIN_HEIGHT = 14;
this.MAIN_POS_X = .05;
this.MAIN_POS_Y = .885;
	
this.SEC_WIDTH = 200;
this.SEC_HEIGHT = 9;
this.SEC_POS_X = .07;
this.SEC_POS_Y = .94

/** lower 3rd secondary background color*/
this.LOWER_3RD_SECONDARY = '#00ff00';

this.arraySize = 0;

/** initializes the various arrays used to hold the overlays */
this.rolledDiceOverlayArray = [];
this.effectOverlayArray = [];
this.stringsOverlayArray = [];

//TODO rename all pp variables to either avatar or counter
this.AVATAR_IMAGE;
this.AVATAR_OVERLAY;
this.AVATAR_IMAGE_RESOURCE;
this.AVATAR_CONTEXT;
	
/** when the hangout is ready, initialize the app */
function init() {
	// When API is ready...                                                         
	gapi.hangout.onApiReady.add(
	function(eventObj) {
		if(eventObj.isApiReady) {
			initWidgets();
			initPPOverlays();
			setPP(1);			
		}
	});
};

/** takes the input text and creates a text overlay on the screen */
function makeText(text){
	var canvasContext = createTextContext(text);
	this.stringsOverlayArray.push(makeLayoverFromContext(canvasContext, .75, -.11, .45 - (this.stringsOverlayArray.length * this.STRING_OVERLAY_V_OFFSET) ) );
	createTextCheckbox(text);
};

function createTextContext(text, color){
	var textContext = createContext(200, 70);
	textContext.font = "18px Verdana";
	textContext.fillStyle = color ? color : "#000000";
	textContext.fillText(text, 0, 70);
	return textContext;
};

function makeLower3rd(main, sec){
	make3rdMain(main);
	make3rdSec(sec);
	$('#toggle3rd').attr('checked', true);
};

function make3rdMain(main){
	disposeLayover(this.MAIN_CONTEXT_BG);
	var mainContextBg = createContext(MAIN_WIDTH, MAIN_HEIGHT);
	mainContextBg.fillStyle = "#ffffff";
	mainContextBg.fillRect(0, 0, MAIN_WIDTH, MAIN_HEIGHT);
	this.MAIN_CONTEXT_BG = makeLayoverFromContext(mainContextBg, 1, MAIN_POS_X, MAIN_POS_Y);
	
	disposeLayover(this.MAIN_CONTEXT_TEXT);
	var mainContextText = createContext(MAIN_WIDTH, MAIN_HEIGHT);
	mainContextText.font = "12px Verdana";
	mainContextText.lineWidth = 1;
	mainContextText.fillStyle = "#000000";
	mainContextText.fillText(main, 0, MAIN_HEIGHT);
	this.MAIN_CONTEXT_TEXT =makeLayoverFromContext(mainContextText, 1, MAIN_POS_X, MAIN_POS_Y - .03);
};

function make3rdSec(sec){
	disposeLayover(this.SECOND_CONTEXT_BG);
	var secondContextBg = createContext(SEC_WIDTH, SEC_HEIGHT);
	secondContextBg.fillStyle = this.LOWER_3RD_SECONDARY;
	secondContextBg.fillRect(0, 0, SEC_WIDTH, SEC_HEIGHT);
	this.SECOND_CONTEXT_BG = makeLayoverFromContext(secondContextBg, 1, SEC_POS_X, SEC_POS_Y);
	
	disposeLayover(this.SECOND_CONTEXT_TEXT);
	var secondContextText= createContext(SEC_WIDTH, SEC_HEIGHT);
	secondContextText.font = "9px Verdana";
	secondContextText.lineWidth = 1;
	secondContextText.fillStyle = "#000000";
	secondContextText.fillText(sec, 0, SEC_HEIGHT);
	this.SECOND_CONTEXT_TEXT = makeLayoverFromContext(secondContextText, 1, SEC_POS_X, SEC_POS_Y );	
};

/** helper method to dispose of hangout layovers */
function disposeLayover(layover){
	if(layover){
		layover.setVisible(false);
		layover.dispose();
	}
};

/** create a hangout layover from an HTML5 canvas context */
function makeLayoverFromContext(context, scale, xval, yval){
	var canvasImage = gapi.hangout.av.effects.createImageResource(context.canvas.toDataURL());
	var overlay = canvasImage.createOverlay({});
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
						editText(textControl, text, $(this).val());
					});
	var closeButton = createElement("a",{"display": "inline", "type": "button", "class": "btn btn-danger btn-mini", "href": "#"})
					.append("<i class='icon-remove'></i>")
					.click(function(){
						removeText(textControl);
					});
	//TODO allow modification of the string
	var label = createElement("label",{"display": "inline", "class": "textCheckbox"}).text(text);
	$(label).prepend(closeButton);
	$(label).prepend(colorPicker);
	$(textControl).append(label);
	
	$("#stringList").prepend(textControl);//append(textControl);
	$.minicolors.init();
};

/** helper method to create canvas contexts on the fly*/
function createContext(w, h) {
    var canvas = createElement("canvas").height(h).width(w)[0];
    var context = canvas.getContext("2d");
    context.webkitImageSmoothingEnabled = true;
    return context;
}

/** actions that are tied to UI listeners */

function rollDiceButton(){
	rollDice();	
};

function clearDiceButton(){
	initInputFields();
	initDiceFields();
	clearDice();
};

function togglePPAction(cb){
	this.AVATAR_OVERLAY.setVisible(cb.checked);
	this.AVATAR_IMAGE.setVisible(cb.checked);

	$("#ppcount").toggleClass('disabled');
	$("#ppadd").toggleClass('disabled');
	$("#ppminus").toggleClass('disabled');
};

function toggle3rdAction(third){
	MAIN_CONTEXT_BG.setVisible(third.checked);
	MAIN_CONTEXT_TEXT.setVisible(third.checked);
	SECOND_CONTEXT_BG.setVisible(third.checked);
	SECOND_CONTEXT_TEXT.setVisible(third.checked);
};


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

function selectDiceAction(value){
	setDice(value);
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
	$(this).find('i').toggleClass('icon-circle-arrow-down');
	$(this).find('i').toggleClass('icon-circle-arrow-left');
	//<i class="icon-circle-arrow-down"></i>
	//<i class="icon-circle-arrow-left"></i>
};

function modifyText(id){
	this.stringsOverlayArray.splice(id, 1);
};

/** edit the text overlay */
function editText(data, text, rrggbb){
	var location = $("ul").index(data);
	this.stringsOverlayArray[$("ul").index(data)].setVisible(false);
	this.stringsOverlayArray[$("ul").index(data)].dispose();
	this.stringsOverlayArray[$("ul").index(data)] = makeLayoverFromContext(createTextContext(text, rrggbb), .75, -.11, .45 - (location * this.STRING_OVERLAY_V_OFFSET) );
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
	this.arraySize = rolledDiceOverlayArray.length;
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
			$(diceDiv).data("die", {size: DICETYPE[i], face: value, position: rolledDiceOverlayArray.length});
			
			//Enable selection of overlay dice by clicking the matching die in the control panel
			$(diceDiv).addClass("rolledDice").prepend("<img src='"+imageUrl+"' />").click(function(){
				selectDieOverlay(this);
			});
			$("#rolledDiceDiv").append(diceDiv);
		}
	}
	initInputFields();
};

function selectDieOverlay(div){
//Special rules for Marvel, don't allow selection of rolled 1s
	//if($(this).data('die').face > 1)
	//{
		var diePosition = $(div).data('die').position - 1;
		var newx = rolledDiceOverlayArray[diePosition].getPosition().x+.5;
		var newy = rolledDiceOverlayArray[diePosition].getPosition().y+.5;
		
		SELECTION_IS = findNextOverlay(SELECTION_IS);
		switch(SELECTION_IS){
			case SELECTION_CIRCLE:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_CIRCLE]});
				modifyTotal('+', $(div).data('die').face);
				//make the circle overlay
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					effectOverlayArray[diePosition].dispose();
				}						
				var circleContext = drawCircle(16,16,12,2);
				effectOverlayArray[diePosition]=makeLayoverFromContext(circleContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
				break;
			case SELECTION_HEX:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_HEX]});
				modifyTotal('-', $(div).data('die').face);
				//make the hex overlay
				var hexContext = drawHex(16,16,12,2);
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					effectOverlayArray[diePosition].dispose();
				}
				effectOverlayArray[diePosition]=makeLayoverFromContext(hexContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);	
				break;
			case SELECTION_X:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_X]});
				var xContext = drawX(3);
				//remove the effect overlay
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					effectOverlayArray[diePosition].dispose();
				}		
				effectOverlayArray[diePosition]=makeLayoverFromContext(xContext, 1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);	
				break;
			case SELECTION_NONE:
			default:
				$(div).css({'background-color':SELECTION_COLOR[SELECTION_NONE]});
				//remove the effect overlay
				if(effectOverlayArray[diePosition]){
					effectOverlayArray[diePosition].setVisible(false);
					//effectOverlayArray[diePosition].dispose();
				}		

		}
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
	if(this.AVATAR_OVERLAY){this.AVATAR_OVERLAY.setVisible(false);}
	
	this.AVATAR_CONTEXT = createContext(32, 32);
	this.AVATAR_CONTEXT.font = "20px Verdana";
	this.AVATAR_CONTEXT.fillStyle = color ? color : $("#ppcolor").val();
	this.AVATAR_CONTEXT.fillText(value, 0, 20);
	this.AVATAR_OVERLAY = makeLayoverFromContext(this.AVATAR_CONTEXT, 1, .93, 0);
};

//TODO 
function initPPOverlays(){	
	this.AVATAR_IMAGE_RESOURCE = gapi.hangout.av.effects.createImageResource(IMAGEROOT + DICEROOT + '/shieldpp' + PNG);
	this.AVATAR_IMAGE = this.AVATAR_IMAGE_RESOURCE.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
	this.AVATAR_IMAGE.setPosition({x: .45, y:-.425});
	this.AVATAR_IMAGE.setVisible(true);
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
				LOWER_3RD_SECONDARY = $(this).val();
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
	this.arraySize = 0;
};

/** keeps a running sum of 'selected' dice as they're selected and deselected*/
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
    var shapeContext = createContext(32, 32);
    var firstX;
    var firstY;
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
	var circleContext = createContext(32, 32);
	circleContext.beginPath();
	circleContext.arc(x0, y0, radius, 0, 2 * Math.PI, false);
	circleContext.lineWidth = lineThickness;
	circleContext.strokeStyle = this.SELECTION_COLOR[this.SELECTION_CIRCLE];
    circleContext.stroke();
    return circleContext;
};

/** draw an x on an HTML5 canvas object */
function drawX(lineThickness) {
	var xContext = createContext(32, 32);
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

/** DOM builders, this changes what interface is used. Default, Marvel, Dredsen*/

/** builds starter DOM */
function defaultDOM() {

};

/** builds Marvel DOM, and switches to Marvel dice set */
function marvelDOM() {

};

/** builds Dresden Files DOM, and switches to Dredsen Files dice set */
function dresdenDOM() {

};

/** builds Fiasco DOM, and switches to  Fiasco dice set */
function fiascoDOM() {

};


// Wait for gadget to load.                                                       
gadgets.util.registerOnLoadHandler(init);