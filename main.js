function isOnIg(url) {
    if (!url) return false;
    return url.startsWith("http://www.instagram.com/p/") || url.startsWith("https://www.instagram.com/p/")
}

var visited = {}

async function main(info) {
    const docID = info['documentId']
    const url = info['url']
    const tabID = info['tabId']
    const slidebarEnabled = (await chrome.storage.local.get(['slidebarEnabled']))['slidebarEnabled']
    if (!visited[docID + tabID] && isOnIg(url) && slidebarEnabled) {
        visited[docID + tabID] = true
        chrome.scripting.executeScript({
            target: {tabId: tabID},
            files: ['inject.js']
        })
    }
}

chrome.webNavigation.onCommitted.addListener(main)