(function() {
    'use strict';

    angular
        .module('textWidget', ['textCardService', 'ui.bootstrap', 'color.picker'])
        .directive('textWidget', textWidget);

    textWidget.$inject = ['config'];

    function textWidget(config) {
        var directive = {
            restrict: 'E',
            scope: {
                cardtext: '@',
                textcolor: '@',
                bgcolor: '@',
                index: '@'
            },
            templateUrl: config.filePrefix + '/textCard/textWidget.html',
            controller: TextWidgetDirective
        };

        return directive;
    }

    TextWidgetDirective.$inject = ['$scope', 'textCardService'];

    function TextWidgetDirective($scope, textCardService) {
        $scope.colorOptionsHidden = true;
        $scope.toggleColors = function () {
            $scope.colorOptionsHidden = !$scope.colorOptionsHidden;
        };

        $scope.deleteCard = function () {
            textCardService.deleteCardAt($scope.index);
        };

        $scope.$watch(function (scope) {
                return scope.textcolor
            },
            function (newValue, oldValue) {
                if (!$scope.colorOptionsHidden && newValue && textCardService.getCardAt($scope.index)) {
                    textCardService.getCardAt($scope.index).textcolor = newValue;
                    textCardService.redrawCardAt($scope.index);
                }
            }
        );

        $scope.$watch(function (scope) {
                return scope.bgcolor
            },
            function (newValue, oldValue) {
                if (!$scope.colorOptionsHidden && newValue && textCardService.getCardAt($scope.index)) {
                    textCardService.getCardAt($scope.index).bgcolor = newValue;
                    textCardService.redrawCardAt($scope.index);
                }
            }
        );
    }
})();
