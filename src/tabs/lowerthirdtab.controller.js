(function () {
    'use strict';

    angular
        .module('dicestreamApp')
        .controller('lowerThirdTabCtrl', LowerThirdCtrl);

    LowerThirdCtrl.$inject = ['$scope', 'lowerThirdService', 'settingsService'];

    function LowerThirdCtrl($scope, lowerThirdService, current) {
        var vm = this;
        var lowerThirdOverlay;
        vm.settings = current.settings;
        vm.lowerThirdButtonText = 'Create Lower Third';

        vm.buildLowerThird = function(name, second, color) {
            if(lowerThirdOverlay) {
                clearLowerThird();
            }
            lowerThirdOverlay = lowerThirdService.createLowerThird(current.settings.LOWER_TEXT_FIRST.text,
                vm.settings.LOWER_TEXT_SECOND.text,
                vm.settings.LOWER_COLOR.color);
            lowerThirdOverlay.setVisible(true);
            vm.lowerThirdButtonText = 'Update Lower Third';
        };

        vm.clear = function() {
            clearLowerThird();
            vm.lowerThirdButtonText = 'Create Lower Third';
        };

        $scope.$watch('vm.settings.LOWER_COLOR.color', function(newValue) {
            if(lowerThirdOverlay) {
                clearLowerThird();
            }
            vm.settings.LOWER_COLOR.color = newValue;
            lowerThirdOverlay = lowerThirdService.createLowerThird(current.settings.LOWER_TEXT_FIRST.text,
                vm.settings.LOWER_TEXT_SECOND.text,
                vm.settings.LOWER_COLOR.color);
            lowerThirdOverlay.setVisible(true);
        });

        var clearLowerThird = function() {
            lowerThirdOverlay.setVisible(false);
            //lowerThirdOverlay.dispose();
        };
    }
})();
