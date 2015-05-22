'use strict';

var dsRolledDice = angular.module('dsRolledDice', ['overlayService']);

dsRolledDice.directive('dsRolledDice', ['config', 'overlayService', function(config, overlayService) {
    return {
        restrict: 'E',
        scope: {
            die: '@',
            value: '@',
            url: '@',
            position: '@'
        },
        templateUrl: config.filePrefix + 'partials/rolledDice.html',
        controller: function($scope, overlayService){
            $scope.currentSelection = 0
        },
        link: function(scope, element, attrs) {
            var SELECTION_OFFSET_X = .054;
            var SELECTION_OFFSET_Y = .15;
            var STROKE_WIDTH = 45;
            var newx = overlayService.getRolledDiceOverlayArray()[scope.position].getPosition().x+.055;
			var newy = overlayService.getRolledDiceOverlayArray()[scope.position].getPosition().y+.15;
            
            scope.selectDieOverlay = function(){
                // If we have a selection on this die, remove it
                if(scope.currentSelection > overlayService.SELECTION_NONE && overlayService.getEffectOverlayArray()[scope.position]){
                    overlayService.getEffectOverlayArray()[scope.position].setVisible(false);
                    overlayService.getEffectOverlayArray()[scope.position].dispose();
                }	
                
                var nextOverlay = overlayService.findNextOverlay(scope.currentSelection);
                scope.currentSelection = nextOverlay;
                
                switch(nextOverlay){

                    case overlayService.SELECTION_CIRCLE:
                        scope.rolledDieSpan = {'background-color':overlayService.SELECTION_COLOR[overlayService.SELECTION_CIRCLE]}
                        var effectContext = overlayService.drawCircle(256,256,220,STROKE_WIDTH);
				        overlayService.getEffectOverlayArray()[scope.position] = overlayService.makeOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
                        break;
                    case overlayService.SELECTION_HEX:
                        scope.rolledDieSpan = {'background-color':overlayService.SELECTION_COLOR[overlayService.SELECTION_HEX]}
                        var effectContext = overlayService.drawHex(256, 256, 220, STROKE_WIDTH);
				        overlayService.getEffectOverlayArray()[scope.position] = overlayService.makeOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
                        break;
                    case overlayService.SELECTION_X:
                        scope.rolledDieSpan = {'background-color':overlayService.SELECTION_COLOR[overlayService.SELECTION_X]}
                        //We want kind of a fatter x.
                        var effectContext = overlayService.drawX(STROKE_WIDTH+15);
				        overlayService.getEffectOverlayArray()[scope.position] = overlayService.makeOverlayFromContext(effectContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
                        break;
                    case overlayService.SELECTION_NONE:
                    default:
                        scope.rolledDieSpan = {'background-color':overlayService.SELECTION_COLOR[overlayService.SELECTION_NONE]}
                }
            };            
        }        
    };
}]);