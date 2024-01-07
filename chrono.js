if (window.location.search.includes("fromCMS")) {
    const webServiceToken = document.querySelectorAll(".generaltable td:first-child")[0].innerText;

    let logoutUrl = document.querySelector("a.dropdown-item:last-child").getAttribute("href");
    logoutUrl = logoutUrl.split("?")[1];
    const logoutUrlParams = new URLSearchParams(logoutUrl);
    const sesskey = logoutUrlParams.get("sesskey");

    // listen for the query from background.js
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.getCMSDetails) {
            sendResponse({ webServiceToken, sesskey });
            // send message to background
            chrome.runtime.sendMessage({ closeThis: true });
        }
    });
}