# Instagram Video Downloader Extension

### WARNING: Generally it's an incredibly bad idea to execute ANY arbitrary untrusted Javascript code, therefore, please add ANY extension ONLY if you UNDERSTAND WHAT IT DOES, and you TRUST THE SOURCE!

This is an extension for Google Chrome based on [Instagram Video Downloader](https://github.com/matteobergantin/Instagram-Video-Downloader).

### Installation

To install the extension follow these steps:
* Clone the repository using `git clone https://github.com/matteobergantin/Instagram-Video-Downloader-Extension.git`
* Browse to the page [chrome://extensions/](chrome://extensions/)
* Enable "Developer Mode" from the toggle switch on the upper right corner of the screen.
* Click on "Load unpacked extension".
* Select the repository folder.
* All done!

### Usage

To use the extension, click on its icon and click on the toggle switch button, now everytime you'll visit an Instagram video page a form will appear, allowing the user to download the video and audio files.

### Docs

The project is composed of three main files:
* `main.js`: The background Service Worker for the extension.
* `inject.js`: A script that will be injected on Instagram when a video is being watched, this script will then inject `instragram.js` on the page.
* `instagram.js`: The actual script that will get the video and audio data and will prompt the form to the user, this script is from [Instagram Video Downloader](https://github.com/matteobergantin/Instagram-Video-Downloader).

The GUI is handled in the `popup` folder.