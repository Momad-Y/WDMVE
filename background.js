function updateIcon(tabId, url) {
    if (!url) return;

    if (url.includes("youtube.com") || url.includes("netflix.com")) {
        chrome.action.setIcon({
            path: {
                16: "images/active-16.png",
                32: "images/active-32.png",
                48: "images/active-48.png",
                128: "images/active-128.png",
            },
            tabId: tabId,
        });
    } else {
        chrome.action.setIcon({
            path: {
                16: "images/default-16.png",
                32: "images/default-32.png",
                48: "images/default-48.png",
                128: "images/default-128.png",
            },
            tabId: tabId,
        });
    }
}

// Runs when a tab is updated (navigated / reloaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        updateIcon(tabId, tab.url);
    }
});

// Runs when user switches tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updateIcon(activeInfo.tabId, tab.url);
    });
});
