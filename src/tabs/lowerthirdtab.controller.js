(function () {
    'use strict';

    angular
        .module('dicestreamApp')
        .controller('lowerThirdTabCtrl', LowerThirdCtrl);

    LowerThirdCtrl.$inject = ['$scope', 'lowerThirdService', 'settingsService'];

    function LowerThirdCtrl($scope, lowerThirdService, current){
        var vm = this;
        var lowerThirdOverlay;
        vm.settings = current.settings;
        vm.lowerThirdButtonText = "Create Lower Third";

        vm.buildLowerThird = function(name, second, color) {
            if(lowerThirdOverlay) {
                clearLowerThird();
            }
            lowerThirdOverlay = lowerThirdService.createLowerThird(current.settings.LOWER_TEXT_FIRST.text,
                vm.settings.LOWER_TEXT_SECOND.text,
                vm.settings.LOWER_COLOR.color);
            lowerThirdOverlay.setVisible(true);
            $scope.lowerThirdButtonText = "Update Lower Third";
        };

        vm.clear = function() {
            clearLowerThird();
            $scope.lowerThirdButtonText = "Create Lower Third";
        };

        //vm.$watch(function(scope) { return scope.lowerThirdColor },
        //    function(newValue, oldValue) {
        $scope.$watch(vm.lowerThirdColor, function(newValue, oldValue){
            if(lowerThirdOverlay) {
                clearLowerThird();
                $scope.lowerThirdColor = newValue;
                lowerThirdOverlay = lowerThirdService.createLowerThird(current.settings.LOWER_TEXT_FIRST.text,
                    vm.settings.LOWER_TEXT_SECOND.text,
                    vm.settings.LOWER_COLOR.color);
                lowerThirdOverlay.setVisible(true);
            }
        });

        //
        //$scope.$watch('vm.title', function(current, original) {
        //    $log.info('vm.title was %s', original);
        //    $log.info('vm.title is now %s', current);
        //});

        var clearLowerThird = function(){
            lowerThirdOverlay.setVisible(false);
            //lowerThirdOverlay.dispose();
        };
    }
})();