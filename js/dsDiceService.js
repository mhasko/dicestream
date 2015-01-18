'use strict';

var dsDiceService = angular.module('diceService', ['overlayService']);

dsDiceService.factory('diceService', ['overlayService', function(dsOverlayService) {
    // diceArray is the backing data object for the dice, so we know 
    // what to display and what to roll. 
    // [id1:{
    //      side: 6,
    //      count: 1,
    //      color: #0099FF,
    //      explode: true},
    //   id2:{
    //      side: 6,
    //      count: 2,
    //      color: #FF90cc,
    //      explode: false},
    //   id3:{
    //      side: 20,
    //      count: 1,
    //      color: #9f9f9f,
    //      explode: false}
    // ]
    var diceService = {};
    var diceArray = {};
    
    /** initializes the various arrays used to hold the overlays */
    var rolledDiceOverlayArray = [];
    var effectOverlayArray = [];

    /** root variables to the various image paths used.*/
    var IMAGEROOT = "https://s3.amazonaws.com/dicestream/images"
    //var DICEROOT = "/standard";
    var DICEROOT = "/captaingothnog";
    var PNG = ".png";
    
//    /** offset for circle and hex overlays */ 
//    var SELECTION_OFFSET_X = .054;
//    var SELECTION_OFFSET_Y = .15;

    diceService.addDice = function(id, side, count) {
        diceArray[id] = {side:side,count:count};
    };
    
    diceService.removeDice = function(id, side, count) {
        if(count === 0){
 			delete diceArray[id];
 		}else{
            diceArray[id] = {side:side,count:count};
        }
    };
    
    diceService.rollDice = function() {
        for(var die in diceArray) {
            if(!diceArray.hasOwnProperty(die)) {continue;}
            //Use the seedrandom RNG to use a better RNG than Math.random.
            //seedrandom uses many sources of entropy and/or any browser 
            //based crypto random functions.
            Math.seedrandom();
            for(var i=0;i<diceArray[die].count;i++)
            {
                this.rollSpecificDice(diceArray[die].side);
                //hack for exploding dice
//                if(dice.explode && value==dice.side){j--;}
            }
			
        };
    };

    diceService.rollSpecificDice = function(dice){
        var value = Math.ceil(dice*Math.random());

        var imageUrl = IMAGEROOT + DICEROOT + '/d' + dice + '-' + value + PNG;			
        var dieImage = gapi.hangout.av.effects.createImageResource(imageUrl);
        var overlay = dieImage.createOverlay({scale: {magnitude: .075, reference: gapi.hangout.av.effects.ScaleReference.WIDTH}});
        rolledDiceOverlayArray.push(overlay);

        //position and display the dice overlay on the video screen
        dsOverlayService.positionOverlays(overlay, rolledDiceOverlayArray.length-1, true);

        var diceDiv = document.createElement("span");
        $(diceDiv).data("die", {size: dice, face: value, position: rolledDiceOverlayArray.length, overlay: DICESTREAM.EFFECTS.SELECTION_NONE});

        //Enable selection of overlay dice by clicking the matching die in the control panel
        $(diceDiv).addClass("rolledDice").prepend("<img src='"+imageUrl+"' />").click(function(){
            selectDieOverlay(this);
        });
        $("#rolledDiceDiv").append(diceDiv);
        return value;
    };
    
    return diceService;
		
}]);