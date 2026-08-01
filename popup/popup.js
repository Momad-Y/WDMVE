let latestEndLocalTime = "—";

// Listen for updates from content script
chrome.runtime.onMessage.addListener((message) => {
    console.log("Received message in popup:", message);
    if (message.type === "YT_END_TIME") {
        latestEndLocalTime = message.value;

        if (chrome.storage?.local) {
            chrome.storage.local.set({ latestEndLocalTime });
        }

        updatePopup();
    }
});

// Render the latest value into the popup
function updatePopup() {
    console.log("Updating popup with:", latestEndLocalTime);

    // NOTE: matches <span id="endTime"> in your HTML
    const endEl = document.getElementById("endTime");
    if (endEl) {
        endEl.textContent = latestEndLocalTime;
    }

    // Optional: update the status badge if present
    const statusEl = document.getElementById("status");
    if (statusEl) {
        const isActive = latestEndLocalTime && latestEndLocalTime !== "—";
        statusEl.textContent = isActive
            ? "✅ Playback is currently active"
            : "❌ Playback is currently inactive";
        statusEl.classList.toggle("active", isActive);
        statusEl.classList.toggle("inactive", !isActive);
    }
}

// Load the last saved value when popup opens
document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup DOM loaded...");

    // Add click event listener for settings icon
    const settingsIcon = document.getElementById("settingsIcon");
    if (settingsIcon) {
        settingsIcon.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    }

    if (chrome.storage?.local) {
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
