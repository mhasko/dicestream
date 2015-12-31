'use strict';

var dsTrayDice = angular.module('dsTrayDice', ['overlayService', 'settingsService']);

dsTrayDice.directive('dsTrayDice', ['config', 'overlayService', 'settingsService', function(config, overlayService, current) {
    return {
        restrict: 'E',
        scope: {
            die: '@',
            value: '@',
            url: '@',
            position: '@'
        },
        templateUrl: config.filePrefix + '/partials/trayDie.html',
        controller: function($scope, overlayService){
            $scope.currentSelection = 0
        },
        link: function(scope, element, attrs) {
            var SELECTION_OFFSET_X = .054;
            var SELECTION_OFFSET_Y = .15;
            var STROKE_WIDTH = 45;
            var newx = overlayService.getTrayDiceOverlayArray()[scope.position].getPosition().x+.055;
			var newy = overlayService.getTrayDiceOverlayArray()[scope.position].getPosition().y+.15;
            
            scope.selectDieOverlay = function(){
                // If we have a selection on this die, remove it
                if(scope.currentSelection > overlayService.SELECTION_NONE && overlayService.getDieSelectionOverlayArray()[scope.position]){
                    overlayService.getDieSelectionOverlayArray()[scope.position].setVisible(false);
                    overlayService.getDieSelectionOverlayArray()[scope.position].dispose();
                }	
                
                var nextOverlay = overlayService.findNextOverlay(scope.currentSelection);
                scope.currentSelection = nextOverlay;
                
                switch(nextOverlay){
                    //TODO ANGULARIZE the bgcolors more better
                    case overlayService.SELECTION_CIRCLE:
                        scope.trayDieSpan = {'background-color': current.settings.DICE.SELECTIONS.CIRCLE.color};
                        var effectContext = overlayService.drawCircle(256,256,220,STROKE_WIDTH);
				        overlayService.getDieSelectionOverlayArray()[scope.position] = overlayService.createOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
                        break;
                    case overlayService.SELECTION_HEX:
                        scope.trayDieSpan = {'background-color':current.settings.DICE.SELECTIONS.HEX.color};
                        var effectContext = overlayService.drawHex(256, 256, 220, STROKE_WIDTH);
				        overlayService.getDieSelectionOverlayArray()[scope.position] = overlayService.createOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
                        break;
                    case overlayService.SELECTION_X:
                        scope.trayDieSpan = {'background-color':current.settings.DICE.SELECTIONS.X.color};
                        //We want kind of a fatter x.
                        var effectContext = overlayService.drawX(STROKE_WIDTH+15);
				        overlayService.getDieSelectionOverlayArray()[scope.position] = overlayService.createOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
                        break;
                    case overlayService.SELECTION_NONE:
                    default:
                        scope.trayDieSpan = {'background-color':'transparent'};
                }
            };            
        }        
    };
}]);