'use strict';

var dsApp = angular.module('dicestreamApp', ['ui.bootstrap', 'ngCookies', 'diceButton',
    'diceService','dsTrayDice', 'textWidget', 'colorSelect', 'lowerThirdService', 'settingsService', 'dsCounter']);

dsApp.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['https://dl.dropbox.com/u/1177409/**', 'https://s3.amazonaws.com/dicestream/**', 'self']);
});

dsApp.constant('config', {
    filePrefix: '%rootPath%',
    imgroot: 'https://s3.amazonaws.com/dicestream/images/'
});
