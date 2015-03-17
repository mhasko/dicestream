'use strict';

var dsApp = angular.module('dicestreamApp', ['ui.bootstrap', 'diceButton', 'diceService']);

dsApp.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['https://dl.dropbox.com/u/1177409/**', 'https://s3.amazonaws.com/dicestream/**', 'self']);
});

dsApp.value('prefix', 'https://dl.dropbox.com/u/1177409/dicestream');
//dsApp.value('prefix', 'https://s3.amazonaws.com/dicestream/');

