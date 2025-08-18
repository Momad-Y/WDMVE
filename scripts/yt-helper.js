const UPDATE_INTERVAL = 1000; // Update every x milliseconds

let player;

function onYouTubeIframeAPIReady() {
    console.log("YouTube API is ready!");

    // Replace this with the actual YouTube player element ID
    const videoElement = document.querySelector("video");

    if (videoElement) {
        console.log("Video element found");

        // Hook into the YouTube player (experimental)
        player = document.getElementById("movie_player");
        let latestEndLocalTime = "—";

        if (player) {
            console.log("Movie player object found");
            // Start the interval to update the end time
            setInterval(() => {
                try {
                    const currentVideoTime = player.getCurrentTime();
                    const videoLength = player.getDuration();
                    const endLocalTime = calculateEndTime(
                        currentVideoTime,
                        videoLength
                    );
                    if (latestEndLocalTime === endLocalTime) {
                        console.log(
                            "No change in end local time, skipping update"
                        );
                        return; // No change, skip update
                    }
                    latestEndLocalTime = endLocalTime;
                    console.log("End local time updated:", endLocalTime);

                    // Send the end time to the popup or background script
                    window.postMessage(
                        {
                            type: "YT_END_TIME",
                            value: endLocalTime,
                        },
                        "*"
                    );
                } catch (e) {
                    console.warn("Unable to get time yet", e);
                }
            }, UPDATE_INTERVAL);
        }
    }
}

function calculateEndTime(currentVideoTime, videoLength) {
    // Get the remaining time in seconds for the video
    const remainingVideoTime = videoLength - currentVideoTime;

    // Get the current local time
    const currentLocalTime = new Date().getTime();

    // Calculate the end time by adding the remaining video time to the current local time
    const endLocalTime = new Date(currentLocalTime + remainingVideoTime * 1000);

    // ! For Debugging
    console.log(
        `Current Video Time: ${currentVideoTime}, Video Length: ${videoLength}, remaining: ${remainingVideoTime}, current local time: ${currentLocalTime.toLocaleString()}, end local time: ${endLocalTime.toLocaleTimeString()}`
    );

    return endLocalTime.toLocaleTimeString();
}
