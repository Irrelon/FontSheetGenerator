/**
 * Copyright (c) 2012 Irrelon Software Limited
 * http://www.isogenicengine.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var allFonts = [],
	characterArr = [];

// This function is called by the Flash swf and passed
// an array of font names
function populateFontList(fontArr) {
	"use strict";
	var arrCount = fontArr.length,
		fontIndex;

	for (fontIndex = 0; fontIndex < arrCount; fontIndex++) {
		allFonts.push(fontArr[fontIndex]);
	}

	updateFontSelect();
}

function updateFontSelect () {
	"use strict";
	var fontListElement = $('#fontList'),
		fontIndex,
		arrCount,
		op;

	// Sort the fonts
	allFonts.sort();

	// Clear the current list
	fontListElement.html('');

	// Create a blank selection
	$('<option></option>')
		.attr('value', '')
		.text('Select a font...')
		.appendTo(fontListElement);

	// Loop fonts and add them to the font list
	arrCount = allFonts.length;

	for (fontIndex = 0; fontIndex < arrCount; fontIndex++) {
		op = $('<option></option>');
		op.attr('value', allFonts[fontIndex]);
		op.text(allFonts[fontIndex]);
		op.appendTo(fontListElement);
	}
}

function addGoogleWebFont (fontName) {
	"use strict";
	// Add the web font link element to the head
	$('<link id="gwf_' + fontName + '" href="http://fonts.googleapis.com/css?family=' + fontName + '" rel="stylesheet" type="text/css">')
		.load(function () {
			console.log('Google Web Font Loaded: ' + fontName);

			// Add the font to the font list
			allFonts.push(fontName);

			// Create an element on the page to use the font
			// so that it is available when we want to render it
			$('<div class="webFontPreLoad" style="font-family: ' + fontName + ';">abc123</div>').appendTo('body');

			// Update the selection
			updateFontSelect();

			// Tell the user
			$('#fontLoaded').html('Web Font ' + fontName + ' loaded!');

			// Clear the font name box
			$('#fontName').val('');
		}).appendTo($('head'));
}

function displayPreview () {
	"use strict";
	var fontName = $('#fontList').val(),
		fontSize = parseInt($('#fontSize').val(), 10),
		fontSizeUnit = $('#fontSizeUnit').val(),
		characterSpacing = parseInt($('#characterSpacing').val(), 10),
		characterFrom = parseInt($('#characterFrom').val(), 10),
		characterTo = parseInt($('#characterTo').val(), 10),
		fontPreview = $('#fontPreview'),
		characterIndex;

	// Clear the character array
	characterArr = [];
	fontPreview.html('');

	// Generate an array of all the characters we want to draw
	for(characterIndex = characterFrom; characterIndex <= characterTo; characterIndex++) {
		characterArr.push(String.fromCharCode(characterIndex));
		fontPreview.html(fontPreview.html() + characterArr[characterArr.length - 1]);
	}

	if (fontName) {
		$('#fontPreview')
			.css('font-family', fontName)
			.css('font-size', fontSize + fontSizeUnit)
			.css('letter-spacing', characterSpacing + 'px');

		$('.fontPreviewName').html(' - ' + fontName + ' @ ' + fontSize + fontSizeUnit);
		$('#previewWell').show();
		$('#finalWell').hide();
	} else {
		$('#previewWell').hide();
		$('#finalWell').hide();
	}
}

function generateCanvasFont() {
	"use strict";
	var fontName = $('#fontList').val(),
		fontSize = parseInt($('#fontSize').val(), 10),
		fontSizeUnit = $('#fontSizeUnit').val(),
		characterSpacing = parseInt($('#characterSpacing').val(), 10),
		characterFrom = parseInt($('#characterFrom').val(), 10),
		characterTo = parseInt($('#characterTo').val(), 10),
		drawDebug = $('#debugCanvas:checked').val(),
		canvas = $('#fontPreviewCanvas')[0],
		ctx = canvas.getContext('2d'),
		// Create a temporary back-buffer canvas
		backBuffer = $('#fontPreviewBackBuffer')[0],
		backBufferCtx = backBuffer.getContext('2d'),
		// Some variables we are going to use
		characterIndex,
		widthArr = [],
		pixelShiftXArr = [],
		pixelShiftYArr = [],
		pixelWidthArr = [],
		pixelHeightArr = [],
		maxWidth = 0,
		maxHeight = 0,
		canvasWidth = 0,
		arrCount,
		xSpace,
		imageData,
		x, y,
		foundMinX, foundMinY,
		foundMaxX, foundMaxY;

	// Set back buffer size
	backBuffer.width = fontSize * 4;
	backBuffer.height = fontSize * 4;

	// Set the canvas font data
	backBufferCtx.font = fontSize + fontSizeUnit + ' "' + fontName + '"';
	backBufferCtx.textBaseline = 'top';

	// Loop each character and draw it to the back buffer
	// in the center position and then measure it via
	// the getImageData() return data - the only reliable
	// way to get a character's total width
	arrCount = characterArr.length;
	for(characterIndex = 1; characterIndex < arrCount; characterIndex++) {
		// Draw the character
		backBufferCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
		backBufferCtx.fillText(characterArr[characterIndex], ((backBuffer.width / 2) - fontSize) | 0, 0);
		widthArr[characterIndex] = backBufferCtx.measureText(characterArr[characterIndex]).width;

		// Grab the image data from the canvas
		imageData = backBufferCtx.getImageData(0, 0, backBuffer.width, backBuffer.height).data;

		// Loop the data from right to left and scan each pixel column
		// and check for non-transparent pixels
		foundMaxX = 0;
		foundMaxY = 0;
		foundMinX = backBuffer.width;
		for (x = backBuffer.width - 1; x >= 0; x--) {
			for (y = backBuffer.height - 1; y >= 0; y--) {
				if(imageData[(y * (backBuffer.width * 4)) + (x * 4) + 3]) {
					foundMinX = foundMinX < x ? foundMinX : x;
					foundMinY = foundMinY < y ? foundMinY : y;

					foundMaxX = foundMaxX > x ? foundMaxX : x;
					foundMaxY = foundMaxY > y ? foundMaxY : y;
					break;
				}
			}
		}

		// If we have a negative pixel horizontal starting point,
		// record it as a positive value, otherwise record zero
		pixelShiftXArr[characterIndex] = (foundMinX - (((backBuffer.width / 2) - fontSize) | 0)) < 0 ? -(foundMinX - (((backBuffer.width / 2) - fontSize) | 0)) : 0;
		pixelShiftYArr[characterIndex] = foundMinY < 0 ? -foundMinY : 0;
		pixelWidthArr[characterIndex] = (foundMaxX - (((backBuffer.width / 2) - fontSize) | 0)) + pixelShiftXArr[characterIndex];
		pixelHeightArr[characterIndex] = foundMaxY;

		canvasWidth += (widthArr[characterIndex] > pixelWidthArr[characterIndex] ? widthArr[characterIndex] : pixelWidthArr[characterIndex]) + characterSpacing;
		maxWidth = (widthArr[characterIndex] > pixelWidthArr[characterIndex] ? widthArr[characterIndex] : pixelWidthArr[characterIndex]);
		maxHeight = pixelHeightArr[characterIndex] > maxHeight ? pixelHeightArr[characterIndex] : maxHeight;
	}

	// Set the space character w/h
	widthArr[0] = widthArr[1];
	pixelShiftXArr[0] = pixelShiftXArr[1];
	pixelWidthArr[0] = pixelWidthArr[1];
	pixelHeightArr[0] = pixelHeightArr[1];

	// Update the maxHeight
	maxHeight += (foundMinY / 2);

	// Set the output canvas size
	canvas.width = canvasWidth + (pixelWidthArr[0] > widthArr[0] ? pixelWidthArr[0] : widthArr[0]);
	canvas.height = maxHeight + 4;

	// Set the canvas font data
	ctx.font = fontSize + fontSizeUnit + ' "' + fontName + '"';
	ctx.textBaseline = 'top';

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Encode and draw the data tag
	canvasDataEncoder.encode(canvas, 0, maxHeight + 3, canvas.width, [
		{
			generator: 'Irrelon Font Sheet Generator',
			url: 'http://www.isogenicengine.com',
			provider: 'Irrelon Software Limited',
			source: 'https://github.com/coolbloke1324/FontSheetGenerator'
		},
		characterFrom, // Character start
		characterTo, // Character end
		characterSpacing, // Character spacing
		fontSize, // Font size
		(fontSizeUnit === 'pt' ? 0 : 1), // Font Unit as a boolean
		fontName // Font Name
	]);

	// Now loop again and draw the width lines
	xSpace = 0;
	arrCount = characterArr.length;
	for(characterIndex = 0; characterIndex < arrCount; characterIndex++) {
		// Draw the character
		ctx.fillText(characterArr[characterIndex], xSpace + pixelShiftXArr[characterIndex], 0);

		// Draw the measured width line
		ctx.fillStyle = '#000000';
		ctx.fillRect(xSpace, maxHeight + 1, widthArr[characterIndex], 1);

		// Draw the absolute width line (Math.max() of canvas
		// measured width and pixel measured width
		ctx.fillStyle = '#000000';
		ctx.fillRect(xSpace, maxHeight + 2, Math.max(pixelWidthArr[characterIndex], widthArr[characterIndex]), 1);

		if (drawDebug) {
			// Draw the character dividing line
			ctx.fillRect(xSpace, 0, 1, maxHeight + 2);
		}

		xSpace += (widthArr[characterIndex] > pixelWidthArr[characterIndex] ? widthArr[characterIndex] : pixelWidthArr[characterIndex]) + characterSpacing;
	}

	$('#previewWell').hide();
	$('#finalWell').show();
}

function saveFontSheet() {
	"use strict";
	window.open($('#fontPreviewCanvas')[0].toDataURL("image/png"));
}