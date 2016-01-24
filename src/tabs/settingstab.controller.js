(function () {
    'use strict';

    angular
        .module('dicestreamApp')
        .controller('settingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['settingsService'];

    function SettingsCtrl(current){
        var vm = this;
        vm.settings = current.settings;

        vm.save = function(){
            current.saveSettings();
        };

        vm.toggleMirroredVideo = function(){
            gapi.hangout.av.setLocalParticipantVideoMirrored(vm.settings.MISC.MIRROR_VID.enabled);
        };
    }
})();