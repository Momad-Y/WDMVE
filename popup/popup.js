let latestEndLocalTime = "—";

// Listen for updates from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_END_TIME") {
        latestEndLocalTime = message.data;

        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ latestEndLocalTime });
        }

        updatePopup();
    }
});

// Function to render the latest value into the popup
function updatePopup() {
    const output = document.getElementById("endTimeDisplay");
    if (output) {
        output.textContent = `End Local Time: ${latestEndLocalTime}`;
    }
}

// Load the last saved value when popup opens
document.addEventListener("DOMContentLoaded", () => {
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["latestEndLocalTime"], (result) => {
            if (result.latestEndLocalTime) {
                latestEndLocalTime = result.latestEndLocalTime;
            }
            updatePopup();
        });
    } else {
        updatePopup();
    }
});
