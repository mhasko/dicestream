(function () {
    'use strict';

    angular
        .module('diceService', ['overlayService', 'imageService'])
        .factory('diceService', diceService);

    diceService.$inject = ['overlayService', 'imageService'];

    function diceService(dsOverlayService, dsImageService) {
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

        /** array of json formatted 'dice' is used to roll dice
         The diceButtons 'register' themselves by entering their data into this array when they
         are created.  If the count value are >0 for a given type, when a roll happens the type
         will be rolled 'count' number of times */
        var diceToRollArray = {};

        /** array of json formatted 'dice' that has been rolled and is displayed via overlays.
         Dice in here are considered in the 'dicetray' and persist until cleared*/
        var dicetrayArray = [];

        var diceService = {
            getDicetrayArray: getDicetrayArray,
            getDiceToRollArray: getDiceToRollArray,
            clearDice: clearDice,
            setDice: setDice,
            rollDice: rollDice,
            rollSpecificDice: rollSpecificDice
        };

        return diceService;

        function getDicetrayArray() {
            return dicetrayArray;
        }

        function getDiceToRollArray() {
            return diceToRollArray;
        }

        function clearDice() {
            for (var die in diceToRollArray) {
                if (!diceToRollArray.hasOwnProperty(die)) {
                    continue;
                }
                diceToRollArray[die].count = 0;
            }

            dicetrayArray.length = 0;
            dsOverlayService.clearOverlayArrays();
        }

        function setDice(id, side, count, root) {
            if (!diceToRollArray[id]) {
                diceToRollArray[id] = {};
            }
            diceToRollArray[id].side = side;
            diceToRollArray[id].count = count;
            if (root) {
                diceToRollArray[id].imageroot = root;
            }
        }

        function rollDice() {
            for (var die in diceToRollArray) {
                if (!diceToRollArray.hasOwnProperty(die)) {
                    continue;
                }
                //Use the seedrandom RNG to use a better RNG than Math.random.
                //seedrandom uses many sources of entropy and/or any browser
                //based crypto random functions.
                Math.seedrandom();
                for (var i = 0; i < diceToRollArray[die].count; i++) {
                    rollSpecificDice(diceToRollArray[die]);
                }
            }
        }

        function rollSpecificDice(die) {
            // use seedrandom to actualy generate a psuedo-random number.
            // This is, like, actually rolling a die.
            var value = Math.ceil(die.side * Math.random());

            // Create the die overlay
            var overlay = dsOverlayService.createDieOverlay(die, value);

            // Add rolled die to the dicetrayArray, so the tray div can
            // display the correct image
            dicetrayArray.push({side: die.side, value: value, url: dsImageService.imageURLFromDie(die, value)});

            //position and display the dice overlay on the video screen
            dsOverlayService.positionOverlays(overlay, true);
        }
    }
})();
