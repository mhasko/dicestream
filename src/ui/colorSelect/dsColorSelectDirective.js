(function () {
    'use strict';

    angular
        .module('colorSelect', [])
        .directive('colorSelect', ColorSelect);

    ColorSelect.$inject = ['config'];

    function ColorSelect(config) {
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
            controller: ColorSelectController
        };
        return directive;
    }

    ColorSelectController.$inject = ['$scope'];

    function ColorSelectController($scope) {
        var vm = this;

        vm.showCheckbox = function () {
            return vm.hideCheckbox !== 'true';
        };
    }
})();
