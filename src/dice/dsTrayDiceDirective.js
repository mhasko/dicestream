(function() {
    'use strict';

    angular
        .module('dsTrayDice', ['overlayService', 'settingsService'])
        .directive('dsTrayDice', dsTrayDice);

    dsTrayDice.$inject = ['config'];

    function dsTrayDice(config) {
        var directive = {
            restrict: 'E',
            scope: {
                die: '@',
                value: '@',
                url: '@',
                position: '@'
            },
            templateUrl: config.filePrefix + '/dice/trayDie.html',
            controller: DiceTrayController,
            controllerAs: 'vm',
            bindAsController: true,
            //link: linkForDiceTray
        };

        return directive;
    }

    DiceTrayController.$inject = ['$scope','overlayService', 'settingsService'];

    function DiceTrayController($scope, overlayService, current) {
        var vm = this;

        vm.currentSelection = 0;
        vm.selectDieOverlay = getDieOverlay;

        function getDieOverlay() {
            // Set up some variables that determine where the die image overlay will appear
            var SELECTION_OFFSET_X = .054;
            var SELECTION_OFFSET_Y = .15;
            var STROKE_WIDTH = 45;
            var newx = overlayService.getTrayDiceOverlayArray()[$scope.position].getPosition().x + .055;
            var newy = overlayService.getTrayDiceOverlayArray()[$scope.position].getPosition().y + .15;

            // If we have a selection on this die, remove it
            if (vm.currentSelection > overlayService.SELECTION_NONE &&
                overlayService.getDieSelectionOverlayArray()[vm.position]) {
                overlayService.getDieSelectionOverlayArray()[vm.position].setVisible(false);
                overlayService.getDieSelectionOverlayArray()[vm.position].dispose();
            }

            // Die selections overlays run on a cycle of none->circle->hex->x->none, but
            //  any of the non-none options can be enabled or disabled in user settings
            var nextOverlay = overlayService.findNextOverlay(vm.currentSelection);
            vm.currentSelection = nextOverlay;

            switch (nextOverlay) {
                //TODO ANGULARIZE the bgcolors more better
                case overlayService.SELECTION_CIRCLE:
                    vm.trayDieSpan = {'background-color': current.settings.DICE.SELECTIONS.CIRCLE.color};
                    var effectContext = overlayService.drawCircle(256, 256, 220, STROKE_WIDTH);
                    overlayService.getDieSelectionOverlayArray()[vm.position] = overlayService.createOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy - SELECTION_OFFSET_Y);
                    break;
                case overlayService.SELECTION_HEX:
                    vm.trayDieSpan = {'background-color': current.settings.DICE.SELECTIONS.HEX.color};
                    var effectContext = overlayService.drawHex(256, 256, 220, STROKE_WIDTH);
                    overlayService.getDieSelectionOverlayArray()[vm.position] = overlayService.createOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy - SELECTION_OFFSET_Y);
                    break;
                case overlayService.SELECTION_X:
                    vm.trayDieSpan = {'background-color': current.settings.DICE.SELECTIONS.X.color};
                    // We want kind of a fatter x.
                    var effectContext = overlayService.drawX(STROKE_WIDTH + 15);
                    overlayService.getDieSelectionOverlayArray()[vm.position] = overlayService.createOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy - SELECTION_OFFSET_Y);
                    break;
                case overlayService.SELECTION_NONE:
                default:
                    vm.trayDieSpan = {'background-color': 'transparent'};
            }
        }
    }
})();