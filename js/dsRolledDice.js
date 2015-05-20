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

        },
        link: function(scope, element, attrs) {
            var SELECTION_OFFSET_X = .054;
            var SELECTION_OFFSET_Y = .15;
            var STROKE_WIDTH = 45;
            var newx = overlayService.getRolledDiceOverlayArray()[scope.position].getPosition().x+.055;
			var newy = overlayService.getRolledDiceOverlayArray()[scope.position].getPosition().y+.15;
            
            scope.selectDieOverlay = function(){
//                console.log(scope.die);
//                console.log(scope.value);
//                console.log(scope.url);
//                console.log(scope.position);
                
        
//                var circleContext = overlayService.drawCircle(256,256,220,STROKE_WIDTH);
//                var circleContext = overlayService.drawX(STROKE_WIDTH+15);
                var circleContext = overlayService.drawHex(256, 256, 220, STROKE_WIDTH);
				var putInArray = overlayService.makeOverlayFromContext(circleContext, .1, newx - SELECTION_OFFSET_X, newy-SELECTION_OFFSET_Y);
            };            
        }        
    };
}]);