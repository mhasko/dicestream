(function() {
    'use strict';

    angular
        .module('imageService', [])
        .factory('imageService', imageService);

    imageService.$inject = ['config'];

    function imageService(config) {

        var imageService = {
            imageURLFromDie: imageURLFromDie
        };

        return imageService;

        function imageURLFromDie(die, value) {
            return config.imgroot + die.imageroot + '/d' + die.side + '-' + value + '.png';
        }

        /** TODO returns an svg image with the selected color */
//    imageService.imageURLFromColor = function(die, value, color){
//        var svgdie = config.imgroot + TODOSVGDIEIMAGEROOT + '/d' + die.side + '-' + value + '.svg';
//        svgdie.DOSOMETHIGNTOMAKETHECOLOR = color;
//        return svgdie;
//    };
    }
})();
