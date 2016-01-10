'use strict';

var dsApp = angular.module('dicestreamApp', ['ui.bootstrap', 'ngCookies', 'diceButton',
    'diceService','dsTrayDice', 'textWidget', 'colorSelect', 'lowerThirdService', 'settingsService', 'dsCounter']);

dsApp.config(function($sceDelegateProvider){
    // White list the src path. Dicestream requires absolute file paths
    //  since it 'runs' on google's domain so we need to white list the
    //  src path since, to Angular, it appears cross domain.
    $sceDelegateProvider.resourceUrlWhitelist(['%whitelistpath%','self']);

    gadgets.util.registerOnLoadHandler(function(){
        // When API is ready
        gapi.hangout.onApiReady.add(
            function(eventObj) {
                if(eventObj.isApiReady) {
                    // When the Hangouts API loads, we'll land here, so only
                    //  then should the app be visible.
                }
            });
    });
});

dsApp.constant('config', {
    // Any time we need to include a file, use filePrefix, which is set
    //  for the different working environments via Grunt
    filePrefix: '%rootPath%',
    imgroot: 'https://s3.amazonaws.com/dicestream/images/'
});
