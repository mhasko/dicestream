'use strict';

var dsImageService = angular.module('imageService', []);

dsImageService.factory('imageService', ['config', function(config) {
    
    var imageService = {};
    
    imageService.imageURLFromDie = function(die, value){
        return  config.imgroot + die.imageroot + '/d' + die.side + '-' + value + '.png';	  
    };
    
    /** TODO returns an svg image with the selected color */
//    imageService.imageURLFromColor = function(die, value, color){
//        var svgdie = config.imgroot + TODOSVGDIEIMAGEROOT + '/d' + die.side + '-' + value + '.svg';
//        svgdie.DOSOMETHIGNTOMAKETHECOLOR = color;
//        return svgdie;
//    };
        
    return imageService;
}]);