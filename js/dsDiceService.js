'use strict';

var dsDiceService = angular.module('diceService', ['overlayService', 'imageService']);

dsDiceService.factory('diceService', ['$rootScope', '$compile', 'overlayService', 'imageService', function($rootScope, $compile, dsOverlayService, dsImageService) {
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
    //      imgRoot: path/to/image/dir
    //      explode: false}
    // ]
    var diceService = {};
    var guiDiceArray = {};
    var rolledDiceArray = [];
    
    /** initializes the various arrays used to hold the overlays */
    var effectOverlayArray = [];
    
    diceService.getRolledDiceArray = function(){
        return rolledDiceArray;   
    };
    
    diceService.getGuiDiceArray = function(){
        return guiDiceArray;
    };
    
    diceService.clearDice = function() {
        for(var die in guiDiceArray) {
            if(!guiDiceArray.hasOwnProperty(die)) {continue;}
            guiDiceArray[die].count = 0;   
        }
        
        rolledDiceArray.length = 0;
    };
    
    diceService.setDice = function(id, side, count, root) {
        if(!guiDiceArray[id]){guiDiceArray[id] = {};}
        guiDiceArray[id].side = side;
        guiDiceArray[id].count = count;
        if(root){guiDiceArray[id].imageroot = root;}
    };
    
    diceService.rollDice = function() {
        for(var die in guiDiceArray) {
            if(!guiDiceArray.hasOwnProperty(die)) {continue;}
            //Use the seedrandom RNG to use a better RNG than Math.random.
            //seedrandom uses many sources of entropy and/or any browser 
            //based crypto random functions.
            Math.seedrandom();
            for(var i=0;i<guiDiceArray[die].count;i++)
            {
                this.rollSpecificDice(guiDiceArray[die]);
                //hack for exploding dice
//                if(dice.explode && value==dice.side){j--;}
            }
			
        };
    };

    diceService.rollSpecificDice = function(die){
        // use seedrandom to actualy generate a psuedo-random number.  
        // This is, like, actually rolling a die. 
        var value = Math.ceil(die.side*Math.random());
        
//        var imageurl = dsImageService.imageURLFromDie(die, value);
        
        // Create the die overlay
        var overlay = dsOverlayService.createOverlay(die, value);
        
        // Add rolled die to the rolledDieArray, so the rolled die div can
        // display the correct image
        rolledDiceArray.push({side:die.side,value:value,url:dsImageService.imageURLFromDie(die, value)});

        //position and display the dice overlay on the video screen
        dsOverlayService.positionOverlays(overlay, true);
        
//        var newDiv = $compile('<rolled-dice size=dice face=value></rolled-dice>')(angular.element(this).scope());
//        
//        angular.element(document.getElementById('diceDiv')).append(newDiv);
        
        //

//        var diceDiv = document.createElement("span");
//        $(diceDiv).data("die", {size: dice, face: value, position: rolledDiceOverlayArray.length, overlay: DICESTREAM.EFFECTS.SELECTION_NONE});
//
//        //Enable selection of overlay dice by clicking the matching die in the control panel
//        $(diceDiv).addClass("rolledDice").prepend("<img src='"+imageUrl+"' />").click(function(){
//            selectDieOverlay(this);
//        });
//        $("#rolledDiceDiv").append(diceDiv);
//        return value;
    };
    
    return diceService;
		
}]);