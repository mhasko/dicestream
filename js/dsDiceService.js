'use strict';

var dsDiceService = angular.module('diceService', ['overlayService', 'imageService']);

dsDiceService.factory('diceService', ['overlayService', 'imageService', function(dsOverlayService, dsImageService) {
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
    
    /** array of json formatted 'dice' is used to roll dice
        The diceButtons 'register' themselves by entering their data into this array when they
        are created.  If the count value are >0 for a given type, when a roll happens the type
        will be rolled 'count' number of times */
    var diceToRollArray = {};
    
    /** array of json formatted 'dice' that has been rolled and is displayed via overlays.
        Dice in here are considered in the 'dicetray' and persist until cleared*/
    var dicetrayArray = [];
    
    diceService.getDicetrayArray = function(){
        return dicetrayArray;   
    };
    
    diceService.getDiceToRollArray = function(){
        return diceToRollArray;
    };
    
    diceService.clearDice = function() {
        for(var die in diceToRollArray) {
            if(!diceToRollArray.hasOwnProperty(die)) {continue;}
            diceToRollArray[die].count = 0;   
        }
        
        dicetrayArray.length = 0;
        dsOverlayService.clearOverlayArrays();
    };
    
    diceService.setDice = function(id, side, count, root) {
        if(!diceToRollArray[id]){diceToRollArray[id] = {};}
        diceToRollArray[id].side = side;
        diceToRollArray[id].count = count;
        if(root){diceToRollArray[id].imageroot = root;}
    };
    
    diceService.rollDice = function() {
        for(var die in diceToRollArray) {
            if(!diceToRollArray.hasOwnProperty(die)) {continue;}
            //Use the seedrandom RNG to use a better RNG than Math.random.
            //seedrandom uses many sources of entropy and/or any browser 
            //based crypto random functions.
            Math.seedrandom();
            for(var i=0;i<diceToRollArray[die].count;i++)
            {
                this.rollSpecificDice(diceToRollArray[die]);
            }
        };
    };

    diceService.rollSpecificDice = function(die){
        // use seedrandom to actualy generate a psuedo-random number.  
        // This is, like, actually rolling a die. 
        var value = Math.ceil(die.side*Math.random());

        // Create the die overlay
        var overlay = dsOverlayService.createDieOverlay(die, value);
        
        // Add rolled die to the dicetrayArray, so the tray div can
        // display the correct image
        dicetrayArray.push({side:die.side,value:value,url:dsImageService.imageURLFromDie(die, value)});

        //position and display the dice overlay on the video screen
        dsOverlayService.positionOverlays(overlay, true);
    };
    
    return diceService;
		
}]);