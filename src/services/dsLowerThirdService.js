(function () {
    'use strict';

    angular
        .module('lowerThirdService', ['overlayService'])
        .factory('lowerThirdService', lowerThirdService);

    lowerThirdService.$inject = ['overlayService', 'config'];

    function lowerThirdService(overlayService, config) {
        var LOWER_THIRD_X_POS = .1;
        var LOWER_THIRD_Y_POS = .4;

        var lowerThirdService = {
            createLowerThird: createLowerThird
        };

        return lowerThirdService;

        function createLowerThird(firstLine, secondLine, color) {
            var lowerThirdContext = overlayService.createLowerThirdContext(firstLine, secondLine, color);
            return overlayService.createOverlayFromContext(lowerThirdContext, .75, LOWER_THIRD_X_POS, LOWER_THIRD_Y_POS);
        }
    }
})();
