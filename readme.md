#Irrelon Canvas Font Sheet Generator
This tool allows you to generate font sheets that you can use with your Isogenic Game Engine game
projects to render any font in your game without the font being available on the target platform / device.
It creates an image from the font with all the letters, numbers and symbols that you might want to use.
You can then save the image for use in your project.

##Usage

Upload the files to a web server (the project uses XHR which will probably not work from a standard file folder
so uploading to a web server or loading from a local server is recommended).

Load the index.html file. Select your font settings and click "Generate Sheet...".

Once your sheet has been generated (can take some time for very large font sizes), you can click the
"Save Image..." button which will open a new page with an image which you can save anywhere you like.

##Features

* Scans all fonts on your computer using a Flash swf
* Supports cursive fonts and odd-shaped fonts
* Preview your sheet before generating
* Use Google Web Fonts by specifying the font name and clicking "Load Font"
* Generated image contains pixel-encoded JSON data with the original image settings so they can be read and identified at a future time

##Limitations

* Minimum font size supported is 12pt