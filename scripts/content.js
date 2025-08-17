/**
 * Injects a script into the document.
 *
 * @param {string} file - The path to the script file to be injected.
 */
function injectScript(file) {
    const script = document.createElement("script"); // create a script element
    script.src = chrome.runtime.getURL(file); // ensures correct extension URL
    script.type = "text/javascript"; // set script type
    (document.head || document.documentElement).appendChild(script); // append to head or document element

    // Remove the script after it loads to avoid cluttering the DOM
    script.onload = function () {
        this.remove();
    };
}

// Start the script execution on page load
document.addEventListener("DOMContentLoaded", () => {
    if (document.URL.includes("youtube.com/watch")) {
        injectScript("scripts/inject-api.js");
        injectScript("scripts/yt-helper.js");
        console.log("YouTube video page detected. Helper scripts injected.");
    } else {
        console.warn("Not a YouTube video page. No scripts injected.");
    }
});
