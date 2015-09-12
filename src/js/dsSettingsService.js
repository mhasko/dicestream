/**
 * Created by mhasko on 8/30/15.
 */

'use strict';

var dsSettingsService = angular.module('settingsService', []);

dsSettingsService.factory('settingsService', ['config', '$cookies', function(config, $cookies){
    var settingsService = {};

    // Init with the default values.  Any saved values will then be overwritten
    settingsService.settings = {
        DICE:{
            SELECTIONS: {
                CIRCLE: {cookie: 'dicestream.settings.dice.circle', color: '#54A954', enabled: true},
                HEX: {cookie: 'dicetream.settings.dice.hex', color: '#000000', enabled: true},
                X: {cookie: 'dicestrea.settings.dice.x', color: '#802015', enabled: true}
            },
        CLEAR_SELECTION : {cookie: 'dicestream.settings.dice.clearselection', enabled: true},
        CLEAR_TRAY : {cookie: 'dicestream.settings.dice.cleartray', enabled: true},
        },
        //}, CARDS :{
        CARD_BG_COLOR : {cookie: 'dicestream.settings.lower.bgcolor', color: '#0099FF'},
        CARD_TEXT_COLOR : {cookie:'dicestream.settings.cards.textcolor', color:'#000000'},
        //},LOWERTHIRD: {
        LOWER_COLOR : {cookie:'dicestream.settings.lower.bgcolor', color:'#0099FF'},
        LOWER_TEXT_FIRST : {cookie:'dicestream.settings.lower.text.first', text:''},
        LOWER_TEXT_SECOND : {cookie:'dicestream.settings.lower.text.second', text:''},
        //},MISC{
        MIRROR_VID : {cookie:'dicestream.settings.misc.mirrorvid', enabled:true}
        //}
    };

    //loadSavedSettings();
    //
    //var loadSavedSettings = function() {
    //    angular.forEach(settingsService.currentSettings, function(value, key){
    //        var setting = $cookies.get(key);
    //        if(setting){
    //            currentSettings.[key] = setting;
    //        }
    //    });

        //$cookies.put('blarg', 'test');
        //var test = $cookies.get('blarg');
        //var optionsOne = $cookies.get(forCookie.CIRCLE);
        //var optionsTwo = $cookies.get(forCookie.HEX);
        //if(!optionsOne || !optionsTwo){
        //    $cookies.put(forCookie.CIRCLE, '#54A954');
        //    $cookies.put(forCookei.HEX, '#802015')
        //}
    //};
    return settingsService;
}]);