const url = chrome.runtime.getURL('instagram.js')
const script = document.createElement('script')

script.src = url
script.onloadend = () => {
    script.remove()
}

document.querySelector('head').appendChild(script)