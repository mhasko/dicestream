(function () {
    'use strict';

//TODO -- 5/1/16 this is kinda big, maybe split up into generic overlay services and modules for each type of overlay?
//     -- or something different?  Make some of the things a bit generic?  This is where most of the dicestream
//     -- magic lives, so tread carefully here.  Not going to touch but be mindful of this when adding new things

    angular
        .module('overlayService', ['imageService', 'settingsService'])
        .factory('overlayService', overlayService);

    overlayService.$inject = ['imageService', 'settingsService'];

    function overlayService(dsImageService, current) {
        var trayDiceOverlayArray = [];
        var dieSelectionOverlayArray = [];
        var cardsOverlayArray = [];

        /** Number of dice positions to offset for the Google+ watermark */
        var WATERMARK_OFFSET = 0;

        /** Space between rows of dice*/
        var DICE_ROW_OFFSET = .08;

        /** Space between columns of dice */
        var DICE_COL_OFFSET = .125;

        /** Sets the number of dice per row. */
        var NUM_DICE_PER_ROW = 10;

        var validSelectionTypes = ['NONE', 'CIRCLE', 'HEX', 'X'];

        var overlayService = {
            /** selection overlay types */
            SELECTION_NONE: 0,
            SELECTION_CIRCLE: 1,
            SELECTION_HEX: 2,
            SELECTION_X: 3,
            getTrayDiceOverlayArray: getTrayDiceOverlayArray,
            getDieSelectionOverlayArray: getDieSelectionOverlayArray,
            addNewCard: addNewCard,
            getCardsOverlayArray: getCardsOverlayArray,
            clearOverlayArrays: clearOverlayArrays,
            clearTextCardArrays: clearTextCardArrays,
            redrawCardAt: redrawCardAt,
            createDieOverlay: createDieOverlay,
            positionOverlays: positionOverlays,
            createOverlayFromContext: createOverlayFromContext,
            createTextOverlay: createTextOverlay,
            createCounterOverlay: createCounterOverlay,
            createLowerThirdContext: createLowerThirdContext,
            findNextOverlay: findNextOverlay,
            drawHex: drawHex,
            drawPolygon: drawPolygon,
            drawCircle: drawCircle,
            drawX: drawX
        };

        return overlayService;

        function getTrayDiceOverlayArray() {
            return trayDiceOverlayArray;
        }

        function getDieSelectionOverlayArray() {
            return dieSelectionOverlayArray;
        }

        function addNewCard(card) {
            cardsOverlayArray.push(card);
        }

        function getCardsOverlayArray() {
            return cardsOverlayArray;
        }

        function clearOverlayArrays() {
            trayDiceOverlayArray.forEach(setArrayFalse);
            trayDiceOverlayArray.length = 0;

            dieSelectionOverlayArray.forEach(setArrayFalse);
            dieSelectionOverlayArray.length = 0;
        }

        function clearTextCardArrays() {
            cardsOverlayArray.forEach(setArrayFalse);
            cardsOverlayArray.length = 0;
        }

        function setArrayFalse(value, index, array) {
            value.setVisible(false);
        }

        function redrawCardAt(index, newCardOverlay) {
            // get the old card overlay at the specified location and set it not visible
            var oldCardOverlay = cardsOverlayArray[index];

            cardsOverlayArray[index] = newCardOverlay;
            oldCardOverlay.setVisible(false);
            oldCardOverlay.dispose();
        }

        /** creates the dice overlay */
        function createDieOverlay(die, value) {
            // create the google hangout image resource from the image
            var dieImage = gapi.hangout.av.effects.createImageResource(dsImageService.imageURLFromDie(die, value));
            // create the google hangout overlay object
            var overlay = dieImage.createOverlay({
                scale: {
                    magnitude: .075,
                    reference: gapi.hangout.av.effects.ScaleReference.WIDTH
                }
            });
            trayDiceOverlayArray.push(overlay);
            return overlay;
        }

        /** displays the dice overlays across the top of the screen */
        function positionOverlays(value, display) {
            //index is an array index.  We need to use that value along with the constant
            //for the allowable number of dice in a row to first determine the 'grid'
            //position of the die, then use the offset value to compute the position
            //values for the overlay.

            var watermarkedIndex = trayDiceOverlayArray.length - 1 + WATERMARK_OFFSET;
            var rowOffset = ((watermarkedIndex - (watermarkedIndex % NUM_DICE_PER_ROW)) / NUM_DICE_PER_ROW) *
                DICE_COL_OFFSET;
            var columnOffset = (watermarkedIndex % NUM_DICE_PER_ROW) * DICE_ROW_OFFSET;
            value.setPosition({x: -.40 + columnOffset, y: -.425 + rowOffset});
            value.setVisible(display);
        }

        /** create a hangout overlay from an HTML5 canvas context */
        function createOverlayFromContext(context, scale, xval, yval) {
            // create the google hangout image resource from html5 context
            var canvasImage = gapi.hangout.av.effects.createImageResource(context.canvas.toDataURL());
            // create the google hangout overlay object
            var overlay = canvasImage.createOverlay({});
            overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
            overlay.setPosition({x: xval, y: yval});
            overlay.setVisible(true);
            return overlay;
        }

        /** create a text overlay, using fabric.js*/
        function createTextOverlay(text, textColor, bgColor, scale, xpos, ypos) {
            var fcanvas = new fabric.Canvas($('#textCanvas').clone().attr('id'));

            //translate the #rrggbb value of the colors to rgba via a tinycolor.js object
            var bgColorTC = tinycolor(bgColor);
            bgColorTC.setAlpha(.4);
            var textColorTC = tinycolor(textColor);

            var textObj = new fabric.Text(text, {
                left: xpos,
                top: ypos,
                fontFamily: 'Roboto',
                textBackgroundColor: bgColorTC.toRgbString()
            });
            textObj.setColor(textColorTC.toRgbString());
            fcanvas.add(textObj);

            return fcanvas.getContext();
        }

        /** create a text overlay, using fabric.js*/
        function createCounterOverlay(text, textColor) {//}, scale, xpos, ypos) {
            var fcanvas = new fabric.Canvas($('#textCanvas').clone().attr('id'));

            ////translate the #rrggbb value of the colors to rgba via a tinycolor.js object
            //var bgColorTC = tinycolor(bgColor);
            //bgColorTC.setAlpha(.4);
            var textColorTC = tinycolor(textColor);

            var textObj = new fabric.Text(text, {fontFamily: 'Roboto', fontSize: 60});
            textObj.setColor(textColorTC.toRgbString());
            fcanvas.add(textObj);

            return fcanvas.getContext();
        }

        function createLowerThirdContext(firstLine, secondLine, color) {
            // create the fabric.js canvas we'll be adding hte various layers on
            // 600 x 100
            var fcanvas = new fabric.Canvas($('#mainThirdCanvas').clone().attr('id'));

            // create the rectangle that has the text strings
            var topRect = new fabric.Rect({
                left: 25,
                top: 25,
                fill: 'white',
                width: 2200,
                height: 300,
                rx: 20,
                ry: 20,
                strokeWidth: 1,
                stroke: 'rgba(124,124,124,1)'
            });
            topRect.setShadow({
                color: tinycolor(color).toRgbString(),
                offsetX: 30,
                offsetY: 30,
                blur: 5,
                fillShadow: true,
                strokeShadow: false
            });
            fcanvas.add(topRect);

            if (!firstLine) {
                firstLine = ' ';
            }
            var mainTitle = new fabric.Text(firstLine, {
                left: 60,
                top: 20,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                fontSize: 200
            });
            fcanvas.add(mainTitle);

            if (!secondLine) {
                secondLine = ' ';
            }
            var secTitle = new fabric.Text(secondLine, {left: 60, top: 230, fontFamily: 'Roboto', fontSize: 80});
            fcanvas.add(secTitle);
            return fcanvas.getContext();
        }

        /** recursive function that finds the next valid overlay type and returns it. */
        //TODO recursive function is awesome, but maybe retire it and iterate over the
        //json object better?
        function findNextOverlay(pos) {
            var nextOverlayValue = parseInt(pos) + 1;
            // We've hit the end of the array, return the first array value /
            // no selection value.
            if (nextOverlayValue >= Object.keys(current.settings.DICE.SELECTIONS).length + 1) {
                return overlayService.SELECTION_NONE;
            }
            // This selection type is allowed, so return it
            else if (current.settings.DICE.SELECTIONS[validSelectionTypes[nextOverlayValue]].enabled) {
                return nextOverlayValue;
            }
            // The user has disallowed this selection, let's go to the next array
            // value and see if it's valid or not
            else {
                return overlayService.findNextOverlay(nextOverlayValue);
            }
        }

        /** helper to draw a Hex */
        function drawHex(x, y, L, thick) {
            return drawPolygon(x, y, 6, L, thick);
        }

        /** draw a regular polygon on an HTML5 canvas object */
        function drawPolygon(x0, y0, numOfSides, L, lineThickness) {
            var canvas = $('#overlayCanvas').clone();
            var shapeContext = canvas[0].getContext('2d');
            var firstX;
            var firstY;
            shapeContext.translate(0.5, 0.5);
            shapeContext.strokeStyle = current.settings.DICE.SELECTIONS.HEX.color;
            shapeContext.lineWidth = lineThickness;
            shapeContext.beginPath();
            for (var i = 0; i < numOfSides; i++) {
                var x = L * Math.cos(2 * Math.PI * i / numOfSides) + x0;
                var y = L * Math.sin(2 * Math.PI * i / numOfSides) + y0;
                if (i == 0) {
                    shapeContext.moveTo(x, y);
                    firstX = x;
                    firstY = y;
                }
                else {
                    shapeContext.lineTo(x, y);
                }

            }
            shapeContext.lineTo(firstX, firstY);
            shapeContext.closePath();
            shapeContext.stroke();

            return shapeContext;
        }

        /** draw a circle on an HTML5 canvas object */
        function drawCircle(x0, y0, radius, lineThickness) {
            var canvas = $('#overlayCanvas').clone();
            var circleContext = canvas[0].getContext('2d');
            circleContext.translate(0.5, 0.5);
            circleContext.beginPath();
            circleContext.arc(x0, y0, radius, 0, 2 * Math.PI, false);
            circleContext.lineWidth = lineThickness;
            circleContext.strokeStyle = current.settings.DICE.SELECTIONS.CIRCLE.color;
            circleContext.stroke();
            return circleContext;
        }

        /** draw an x on an HTML5 canvas object */
        function drawX(lineThickness) {
            var canvas = $('#overlayCanvas').clone();
            var xContext = canvas[0].getContext('2d');
            xContext.translate(0.5, 0.5);
            xContext.lineWidth = lineThickness;
            xContext.strokeStyle = current.settings.DICE.SELECTIONS.X.color;
            xContext.beginPath();

            xContext.moveTo(48, 48);
            xContext.lineTo(464, 464);

            xContext.moveTo(464, 48);
            xContext.lineTo(48, 464);
            xContext.stroke();
            return xContext;
        }
    }
})();
