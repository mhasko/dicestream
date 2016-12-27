(function () {
    'use strict';

    angular
        .module('settingsService', [])
        .factory('settingsService', settingsService);

    settingsService.$inject = ['config', '$cookies'];

    function settingsService(config, $cookies) {
        var defaultSettings = {
            DICE: {
                SELECTIONS: {
                    CIRCLE: {color: '#54A954', enabled: true},
                    HEX: {color: '#000000', enabled: true},
                    X: {color: '#802015', enabled: true}
                },
                CLEAR_SELECTION: {enabled: true},
                CLEAR_TRAY: {enabled: true},
            },
            COUNTER_COLOR: {color: '#0099FF'},
            //}, CARDS :{
            CARD_BG_COLOR: {color: '#0099FF'},
            CARD_TEXT_COLOR: {color: '#000000'},
            //},LOWERTHIRD: {
            LOWER_COLOR: {color: '#0099FF'},
            LOWER_TEXT_FIRST: {text: ''},
            LOWER_TEXT_SECOND: {text: ''},
            //},
            MISC: {
                MIRROR_VID: {enabled: false}
            }
        };
        var DICESTREAM_COOKIE = 'dicestream.settings';
        var settings = {
            settings: defaultSettings,
            saveSettings: saveSettings,
            loadSettings: loadSettings,
            resetDefaultSettings: resetDefaultSettings
        };

        return settings;

        // Init with the default values.  Any saved values will then be overwritten
        //settingsService.settings = defaultSettings;

        function saveSettings() {
            $cookies.putObject(DICESTREAM_COOKIE, settingsService.settings, {expires:new Date(2020, 1, 1, 1, 1, 1)});
        }

        function loadSettings() {
            var savedSettings = $cookies.getObject(DICESTREAM_COOKIE);
            // if savedSettings is null, there's nothing saved...so don't fetch them
            if (savedSettings) {
                settingsService.settings = savedSettings;
            }
            //settingsService.settings = $cookies.getObject('dicestream.settings');
        }

        function resetDefaultSettings() {
            settingsService.settings = defaultSettings;
            settingsService.saveSettings();
        }

        //run at startup to load any saved settings
        loadSettings();
    }
})();
