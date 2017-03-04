(function () {
    'use strict';

    angular
        .module('dicestreamApp', [
            //TODO -- Once modules are done, reorder this for clarity
            'ui.bootstrap',
            'ngCookies',
            'diceButton',
            'diceService',
            'dsTrayDice',
            'textWidget',
            'colorSelect',
            'lowerThirdService',
            'settingsService',
            'dsCounter'
        ])
        .config(DicestreamConfig)
        .constant('config', {
            // Any time we need to include a file, use filePrefix, which is set
            //  for the different working environments via Grunt
            filePrefix: '%rootPath%',
            imgroot: 'https://s3.amazonaws.com/dicestream/images/'
        })
        .run(DicestreamRun);

    function DicestreamConfig($sceDelegateProvider) {
        // White list the src path. Dicestream requires absolute file paths
        //  since it 'runs' on google's domain so we need to white list the
        //  src path since, to Angular, it appears cross domain.
        $sceDelegateProvider.resourceUrlWhitelist(['%whitelistpath%', 'self']);
    }

    function DicestreamRun() {
        gapi.hangout.onApiReady.add(
            function (eventObj) {
                if (eventObj.isApiReady) {
                    // When the Hangouts API loads, we'll land here, so only
                    //  then should the app be visible.

                    // Default to no mirroring.  This could be changed by user settings
                    gapi.hangout.av.setLocalParticipantVideoMirrored(false);

                    // TODO -- add a loading spinner, and at this point remove it
                }
            }
        );
    }
})();

