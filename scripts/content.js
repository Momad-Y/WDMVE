/**
 * Injects a script into the document.
 *
 * @param {string} file - The path to the script file to be injected.
 */
function injectScript(file) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(file); // ensures correct extension URL
    script.type = "text/javascript";
    script.onload = function () {
        this.remove(); // Clean up after loading
    };
    script.onerror = function () {
        console.error(`Failed to load script: ${file}`);
    };
    (document.head || document.documentElement).appendChild(script);
}

/**
 * Check if current page is a YouTube watch page.
 */
function isYouTubeWatchPage() {
    return (
        window.location.hostname.includes("youtube.com") &&
        window.location.pathname === "/watch"
    );
}

/**
 * Initialize injection when page is ready.
 */
function main() {
    if (isYouTubeWatchPage()) {
        injectScript("scripts/inject-api.js");
        injectScript("scripts/yt-helper.js");
        console.log("YouTube video page detected. Helper scripts injected.");
    } else {
        console.warn("Not a YouTube video page. No scripts injected.");
    }
}

// Also listen for SPA navigation changes
chrome.runtime.onMessage.addListener((msg) => {
    if (msg === "urlChanged") {
        main();
    }
});

// Listen for messages from the injected script to handle end time updates
window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type && event.data.type === "YT_END_TIME") {
        try {
            chrome.runtime.sendMessage({
                type: "YT_END_TIME",
                value: event.data.value,
            });
        } catch (err) {
            if (err.message.includes("Extension context invalidated")) {
                // This just means the extension was reloaded or popup closed
                // Safe to ignore
                console.debug(
                    "Message not sent: extension context invalidated."
                );
            } else {
                console.error("Unexpected error sending message:", err);
            }
        }
    }
});

// Run on initial
main();
