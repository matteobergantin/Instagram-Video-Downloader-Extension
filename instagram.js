/*
    Instagram Video Downloader by Matteo Bergantin (https://github.com/matteobergantin)
                                             ____________________________
                                            |                            |
                                            |   How does the code work?  |
                                            |____________________________|

    First we must learn how Instagram plays video and audio

    [Intro]
    Instagram uses MediaSources to play videos and audio
    MediaSources represent a Media Element that can be played to an HTMLElement through URL.createObjectURL
    
    [Method explaination]
    Trying to keep it short:
        - Instagram keeps video and audio files separated
        - Instagram downloads bits of video and audio data, which will then be fed to the MediaSource object.
        - Gathering this binary data will allow us to reconstruct the full video and audio files
    
    [What the code actually does]
    So, to add any bits of data to the MediaSource object, we must call addSourceBuffer first,
    which will contain the MIME-Type (as string) of the data that will be pushed in the buffer
    Once Instagram created the buffer, it starts pushing data to it
    To push data, we must call the appendBuffer function contained in MediaSource.sourceBuffers
    I override the original function, so every time it is called it executed my code.
    When my code is executed, it just gets the binary data (represented, usually, as UInt8Array)
    And pushes it to _videoAndAudioData in correspondence of the MIME type of the target Source Buffer

    Once we hit endOfStream, my function will join all the pieces of data of the video and audio, and prompts the user
    a simple form allowing him to download the video and audio files
*/

var _videoAndAudioData = {}
var _endOfStreamReached = false
var _popupWindowShown = false

URL._createObjectURL = URL._createObjectURL || URL.createObjectURL

URL.createObjectURL = function(media_src, ...other) {
    /*
        Instagram Video Downloader by Matteo Bergantin (https://github.com/matteobergantin)

        WARNING: Generally it's an incredibly bad idea to execute ANY arbitrary untrusted Javascript code in the developer console,
        therefore, please execute ANY code ONLY if you UNDERSTAND WHAT IT DOES, and you TRUST THE SOURCE!
    */
    if (media_src instanceof MediaSource) {
        // Injecting code

        // Checking when the Stream is done
        media_src._endOfStream = media_src._endOfStream || media_src.endOfStream
        media_src.endOfStream = () => {
            _endOfStreamReached = true
            window.setTimeout(mergeFilesAndDownload, 0)
            return media_src._endOfStream()
        }

        // Injecting other code in the newly created SourceBuffer
        media_src._addSourceBuffer = media_src._addSourceBuffer || media_src.addSourceBuffer
        media_src.addSourceBuffer = function(mime_type, ...other_args) {
            let newSourceBuffer = media_src._addSourceBuffer(mime_type, ...other_args)
            if (_videoAndAudioData[mime_type] === undefined)
                _videoAndAudioData[mime_type] = []
    
            newSourceBuffer._appendBuffer = newSourceBuffer._appendBuffer || newSourceBuffer.appendBuffer
            newSourceBuffer.appendBuffer = function(data, ...some_other_args) {
                // This is what we need, data will contain the actual binary data
                if (!_endOfStreamReached)
                    _videoAndAudioData[mime_type].push(data)
                return newSourceBuffer._appendBuffer(data, ...some_other_args)
            }
            return newSourceBuffer
        }
    }

    return URL._createObjectURL(media_src, ...other)
}

function mergeFilesAndDownload() {
    if (!_endOfStreamReached || _popupWindowShown) return;
    const keys = Object.keys(_videoAndAudioData)

    // Joining video bits, and creating a URL
    const videoURL = URL._createObjectURL(new Blob(_videoAndAudioData[keys[0]]))
    
    // Joining audio bits, and creating a URL
    const audioURL = URL._createObjectURL(new Blob(_videoAndAudioData[keys[1]]))
    
    // Code for the GUI
    const code = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 400px; height: 200px; background: #272727; z-index: 999999;">
            <!--
                Code Injected by Instagram Video Downloader
                View the author's Github page: https://github.com/matteobergantin
            -->
            <div class="close-btn" style="position: absolute; top: 15px; right: 15px; font-size: 20pt; cursor: pointer; color: white;">&#10005;</div>
            <a style="white-space: nowrap; position: fixed; margin-top: 60px; width: fit-content; left: 50%; transform: translateX(-50%); font-family: Helvetica, sans-serif; color: white; font-size: 15pt;" download="video.mp4" href="${videoURL}">Click me to download the video file</a><br><br>
            <a style="white-space: nowrap; position: fixed; margin-top: 60px; width: fit-content; left: 50%; transform: translateX(-50%); font-family: Helvetica, sans-serif; color: white; font-size: 15pt;" download="audio.mp4" href="${audioURL}">Click me to download the audio file</a><br><br>
            <p style="position: absolute; width: 100%; text-align: center; bottom: 10px; left: 0; font-family: Helvetica, sans-serif; color: white; font-size: 10pt;">Visit my Github page <a style="color: #00bc8c;" href="https://github.com/matteobergantin" target="_blank">here</a></p>
        </div>`

    const wrapperElement = document.createElement('div')
    wrapperElement.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6);')
    wrapperElement.innerHTML = code
    const closeBtn = wrapperElement.querySelector('div.close-btn')

    closeBtn.onclick = () => {
        closeBtn.parentElement.parentElement.remove()
        URL.revokeObjectURL(videoURL)
        URL.revokeObjectURL(audioURL)
    }

    document.body.appendChild(wrapperElement)
    console.dir(_videoAndAudioData)
    _popupWindowShown = true
}