/**
 * Created by mhasko on 8/30/15.
 */

'use strict';

var dsSettingsService = angular.module('settingsService', []);

dsSettingsService.factory('settingsService', ['config', '$cookies', function(config, $cookies){
    var settingsService = {};

    //var forCookie = {
    //    CIRCLE : 'dicestream.settings.dice.circle',
    //    HEX : 'dicetream.settings.dice.hex',
    //    X : 'dicestrea.settings.dice.x',
    //    CLEAR_SELECTION : 'dicestream.settings.dice.clearselection',
    //    CLEAR_TRAY : 'dicestream.settings.dice.cleartray',
    //    CARD_BG : 'dicestream.settings.cards.bgcolor',
    //    CARD_TEXT : 'dicestream.settings.cards.textcolor',
    //    LOWER_COLOR : 'dicestream.settings.lower.bgcolor',
    //    LOWER_TEXT_FIRST : 'dicestream.settings.lower.text.first',
    //    LOWER_TEXT_SECOND : 'dicestream.settings.lower.text.second',
    //    MIRROR_VID : 'dicestream.settings.misc.mirrorvid'
    //};

    // Init with the default values.  Any saved values will then be overwritten
    settingsService.currentSettings = {
        CIRCLE : {cookie: 'dicestream.settings.dice.circle', color:'#54A954', enabled: 'true'},
        HEX : {cookie:'dicetream.settings.dice.hex', color: '#000000', enabled: 'true'},
        X : {cookie:'dicestrea.settings.dice.x', color: '#802015', enabled: 'true'},
        CLEAR_SELECTION : {cookie: 'dicestream.settings.dice.clearselection', enabled: 'true'},
        CLEAR_TRAY : {cookie: 'dicestream.settings.dice.cleartray', enabled: 'true'},
        CARD_BG_COLOR : {cookie: 'dicestream.settings.lower.bgcolor', color: '#0099FF'},
        CARD_TEXT_COLOR : {cookie:'dicestream.settings.cards.textcolor', color:'#000000'},
        LOWER_COLOR : {cookie:'dicestream.settings.lower.bgcolor', color:'#0099FF'},
        LOWER_TEXT_FIRST : {cookie:'dicestream.settings.lower.text.first', text:'BETTER'},
        LOWER_TEXT_SECOND : {cookie:'dicestream.settings.lower.text.second', text:''},
        MIRROR_VID : {cookie:'dicestream.settings.misc.mirrorvid', enabled:'true'}
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