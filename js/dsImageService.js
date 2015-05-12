'use strict';

var dsImageService = angular.module('imageService', []);

dsImageService.factory('imageService', ['config', function(config) {
    
    var imageService = {};
    
    imageService.imageURLFromDie = function(die, value){
        return  config.imgroot + die.imageroot + '/d' + die.side + '-' + value + '.png';	  
    };
        
    return imageService;
}]);