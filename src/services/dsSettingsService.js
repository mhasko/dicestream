/**
 * Created by mhasko on 8/30/15.
 */

'use strict';

var dsSettingsService = angular.module('settingsService', []);

dsSettingsService.factory('settingsService', ['config', '$cookies', function(config, $cookies){
    var settingsService = {};

    var defaultSettings = {
        DICE:{
            SELECTIONS: {
                CIRCLE: {color: '#54A954', enabled: true},
                HEX: {color: '#000000', enabled: true},
                X: {color: '#802015', enabled: true}
            },
            CLEAR_SELECTION : {enabled: true},
            CLEAR_TRAY : {enabled: true},
        },
        COUNTER_COLOR : {color: '#0099FF'},
        //}, CARDS :{
        CARD_BG_COLOR : {color: '#0099FF'},
        CARD_TEXT_COLOR : {color:'#000000'},
        //},LOWERTHIRD: {
        LOWER_COLOR : {color:'#0099FF'},
        LOWER_TEXT_FIRST : {text:''},
        LOWER_TEXT_SECOND : {text:''},
        //},
        MISC : {
            MIRROR_VID : {enabled:false}
        }
    };

    // Init with the default values.  Any saved values will then be overwritten
    settingsService.settings = defaultSettings;

    settingsService.saveSettings = function() {
        $cookies.putObject('dicestream.settings', settingsService.settings);
    };

    settingsService.loadSettings = function() {
        var savedSettings = $cookies.getObject('dicestream.settings');
        // if savedSettings is null, there's nothing saved...so don't fetch them
        if(savedSettings) {
            settingsService.settings = savedSettings;
        }
        //settingsService.settings = $cookies.getObject('dicestream.settings');
    };

    settingsService.resetDefaultSettings = function() {
        settingsService.settings = defaultSettings;
        settingsService.saveSettings();
    };

    //run at startup to load any saved settings
    settingsService.loadSettings();
    return settingsService;
}]);