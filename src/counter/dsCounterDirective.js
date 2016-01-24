/**
 * Created by mhasko on 9/20/15.
 */
'use strict';

angular
    .module('dsCounter', ['overlayService', 'settingsService'])
    .directive('dsCounter', dsCounter);

dsCounter.$inject = ['config'];

function dsCounter(config) {
    var directive = {
        restrict: 'E',
        scope: {},
        templateUrl: config.filePrefix + '/counter/counterInterface.html',
        controller: CounterController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

CounterController.$inject = ['$scope', 'overlayService', 'settingsService'];

function CounterController($scope, overlayService, current) {
    var vm = this;
    var overlay;
    vm.showCounter = true;
    vm.counterColor = current.settings.COUNTER_COLOR.color;
    vm.counter = 0;

    vm.toggleCounter = function() {
        overlay.setVisible(vm.showCounter);
    };

    vm.incCount = function() {
        if(vm.counter < 99) {
            vm.counter += 1;
        }
    };

    vm.decCount = function() {
        if(vm.counter > 0) {
            vm.counter -= 1;
        }
    };

    $scope.$watch('vm.counter', function(newValue) {
        if(newValue){
            redrawCounter(newValue.toString(), vm.counterColor);
        }
    });

    $scope.$watch('vm.counterColor', function(newValue) {
        if(newValue) {
            current.settings.COUNTER_COLOR = {color: newValue};
            redrawCounter(vm.counter.toString(), newValue);
        }
    });

    var redrawCounter = function(text, color) {
        if(overlay) {
            overlay.setVisible(false);
        }

        var textContext= overlayService.createCounterOverlay(text, color);
        overlay = overlayService.createOverlayFromContext(textContext,1,.87,-.38);
    }
}
