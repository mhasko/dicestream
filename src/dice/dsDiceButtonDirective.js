'use strict';

angular
    .module('diceButton', ['diceService'])
    .directive('diceButton', diceButton);

diceButton.$inject = ['config'];

function diceButton(config) {

    var directive = {
        restrict: 'E',
        scope: {
            id: '@dieid',
            side: '@sides',
            imageroot: '@',
            dieimage: '@',
            position: '@side'
        },
        templateUrl: config.filePrefix + '/dice/diceButton.html',
        controller: DiceButtonController,
        controllerAs: 'vm',
        bindToController: true,
        link: linkForDiceButton
    };

    return directive;
}

DiceButtonController.$inject = ['diceService'];

function DiceButtonController(diceService) {
    var vm = this;

    // 'register' with the dice service so what ever die this button
    //  is tracking can have its data backed in the service.
    diceService.setDice(vm.id, vm.side, 0, vm.imageroot);

    // bind the diedata value to the matching value in the diceService.
    vm.diedata = diceService.getDiceToRollArray()[vm.id];
}

function linkForDiceButton(scope, element, attrs, vm) {
    vm.incDieCount = increaseCount;
    vm.decDieCount = decreaseCount;

    function increaseCount() {
        if(vm.diedata.count < 99) {
            if(vm.diedata.count == 0) {
                vm.diedata.count = 1;
            } else {
                vm.diedata.count += 1;
            }
        }
    }

    function decreaseCount() {
        if(vm.diedata.count > 0) {
            vm.diedata.count -= 1;
        }
    }
}

