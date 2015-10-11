/**
 * Created by mhasko on 8/21/15.
 */
'use strict'

var colorSelect = angular.module('colorSelect', []);

colorSelect.directive('colorSelect', ['config', function(config){
    return{
        restrict: 'E',
        scope: {
            text: '@',
            hideCheckbox: '@',
            change: '=',
            checked: '=',
            color: '='
        },
        templateUrl: config.filePrefix + '/partials/colorSelect.html',
        //compile: function(element, attrs){
        //    if (!attrs.showCheckbox) { attrs.attrOne = 'true'; }
        //},
        controller: function($scope){
            $scope.showCheckbox = function(){
                return $scope.hideCheckbox !== 'true';
            };

        },
        link: function(scope, element, attrs) {
            //scope.showCheckbox = function(){
            //    return scope.hideCheckbox !== 'true';
            //};
        }
    };
}]);