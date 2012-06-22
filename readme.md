#Irrelon Canvas Font Sheet Generator
This tool allows you to generate font sheets that you can use with your Isogenic Game Engine game
projects to render any font in your game without the font being available on the target platform / device.
It creates an image from the font with all the letters, numbers and symbols that you might want to use.
You can then save the image for use in your project.

##Deployment

Upload the files to a web server with PHP enabled (the project uses XHR which will probably not work
from a standard file folder so uploading to a web server or loading from a local server is recommended).

## Usage

The system has only been tested in Google Chrome 19. Other browsers may work but may also mess up the
font positioning.

Load the index.html file. Select your font settings and click "Generate Sheet...".

Once your sheet has been generated (can take some time for very large font sizes), you can click the
"Save Image..." button which will open a new page with an image which you can save anywhere you like.

The save functionality uses PHP to decode the data URI and send back the image to the browser. This is to
solve a problem with Chrome 19 not being able to save images from a data URI.

##Features

* Scans all fonts on your computer using a Flash swf
* Supports cursive fonts and odd-shaped fonts
* Preview your sheet before generating
* Use Google Web Fonts by specifying the font name and clicking "Load Font"
* Generated image contains pixel-encoded JSON data with the original image settings so they can be read and identified at a future time