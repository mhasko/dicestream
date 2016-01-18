(function () {
    'use strict';

    angular
        .module('dicestreamApp')
        .controller('diceTabCtrl', DicetabCtrl);

    DicetabCtrl.$inject = ['diceService'];

    function DicetabCtrl(diceService) {
        var vm = this;

        vm.roll = function () {
            diceService.rollDice();
        };

        vm.clear = function() {
            diceService.clearDice();
        };

        vm.getDicetray = function() {
            return diceService.getDicetrayArray();
        };
    }
})();