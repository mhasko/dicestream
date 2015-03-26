'use strict';

var dsImageService = angular.module('imageService', []);

dsImageService.factory('imageService', function() {
    
    var IMAGEROOT = "https://s3.amazonaws.com/dicestream/images/"
    var PNG = ".png";
    
    var imageService = {};
    
    imageService.imageURLFromDie = function(die, value){
        return  IMAGEROOT + die.imageroot + '/d' + die.side + '-' + value + PNG;	  
    };
    
    

    
    return imageService;
});