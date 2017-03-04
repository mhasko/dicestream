(function () {
    'use strict';

    angular
        .module('dicestreamApp')
        .controller('textTabCtrl', TexttabCtrl);

    TexttabCtrl.$inject = ['textCardService', 'settingsService'];

    function TexttabCtrl(textCardService, current) {
        var vm = this;

        vm.settings = current.settings;
        //[{text: "test1",
        //  textcolor: "#000000",
        //  bgcolor: "#ffffff"},...]

        vm.getTextCards = function() {
            return textCardService.getCards();
        };

        vm.addCard = function(cardtext) {
            textCardService.addNewCard({
                text:cardtext,
                textcolor:vm.settings.CARD_TEXT_COLOR.color,
                bgcolor:vm.settings.CARD_BG_COLOR.color
            });
        };
    }
})();
