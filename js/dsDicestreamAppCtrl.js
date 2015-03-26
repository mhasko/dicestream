'use strict';

var dsApp = angular.module('dicestreamApp', ['ui.bootstrap', 'diceButton', 'diceService']);

dsApp.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['https://dl.dropbox.com/u/1177409/**', 'https://s3.amazonaws.com/dicestream/**', 'self']);
});

dsApp.constant('file-prefix', 'https://dl.dropbox.com/u/1177409/dicestream');
//dsApp.constant('prefix', 'https://s3.amazonaws.com/dicestream/');

dsApp.constant('imgroot', 'https://s3.amazonaws.com/dicestream/images');