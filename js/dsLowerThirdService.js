'use strict';

var dsLowerThirdService = angular.module('lowerThirdService', ['overlayService']);

dsLowerThirdService.factory('lowerThirdService', ['overlayService', 'config', function(overlayService, config) {
    
    var lowerThirdService = {};
    
    var LOWER_THIRD_X_POS = .1;
    var LOWER_THIRD_Y_POS = .4;

    lowerThirdService.createLowerThird = function(firstLine, secondLine) {
        var lowerThirdContext = overlayService.createLowerThirdContext(firstLine, secondLine);
        return overlayService.createOverlayFromContext(lowerThirdContext, .75, LOWER_THIRD_X_POS, LOWER_THIRD_Y_POS);
    };
    
    return lowerThirdService;
    
}]);