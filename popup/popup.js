let latestEndLocalTime = "—";

// Listen for updates from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in popup:", message);
    if (message.type === "YT_END_TIME") {
        latestEndLocalTime = message.value;

        // Save to storage so it's persistent
        chrome.storage.local.set({ latestEndLocalTime });

        updatePopup();
    }
});

// Function to render the latest value into the popup
function updatePopup() {
    console.log(
        "Updating popup with latest end local time:",
        latestEndLocalTime
    );
    const output = document.getElementById("endTimeDisplay");
    if (output) {
        output.textContent = `End Local Time: ${latestEndLocalTime}`;
    }
}

// Load the last saved value when popup opens
document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup loaded, fetching latest end local time...");
    chrome.storage.local.get(["latestEndLocalTime"], (result) => {
        if (result.latestEndLocalTime) {
            latestEndLocalTime = result.latestEndLocalTime;
        }
        updatePopup();
    });
});
