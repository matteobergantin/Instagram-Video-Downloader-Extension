var slidebarEnabled = false
const slidebar = document.querySelector('.slidebar')

function toggleSlidebarUI() {
    if (slidebarEnabled) {
        slidebar.classList.remove("disabled")
        slidebar.classList.add("active")
    } else {
        slidebar.classList.remove("active")
        slidebar.classList.add("disabled")
    }
}


async function main() {
    const res = await chrome.storage.local.get('slidebarEnabled')
    slidebarEnabled = res['slidebarEnabled'] ? true : false
    toggleSlidebarUI()    
}

slidebar.onclick = () => {
    slidebarEnabled = !slidebarEnabled
    toggleSlidebarUI()
    chrome.storage.local.set({'slidebarEnabled': slidebarEnabled})
}

main()