/**
 * Created by mhasko on 8/21/15.
 */
'use strict';

angular
    .module('colorSelect', [])
    .directive('colorSelect', colorSelect);

colorSelect.$inject = ['config'];

function colorSelect(config) {
    var directive = {
        restrict: 'E',
        scope: {
            text: '@',
            hideCheckbox: '@',
            change: '=',
            checked: '=',
            color: '='
        },
        templateUrl: config.filePrefix + '/ui/colorSelect/colorSelect.html',
        controller: colorSelectController
    };
    return directive;
}

colorSelectController.$inject = ['$scope'];

function colorSelectController($scope) {
    $scope.showCheckbox = function(){
        return $scope.hideCheckbox !== 'true';
    };
}
