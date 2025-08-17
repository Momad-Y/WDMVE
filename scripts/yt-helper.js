const UPDATE_INTERVAL = 500; // Update every x milliseconds

let player;

function onYouTubeIframeAPIReady() {
    console.log("YouTube API is ready!");

    // Replace this with the actual YouTube player element ID
    const videoElement = document.querySelector("video");

    if (videoElement) {
        console.log("Video element found");

        // Hook into the YouTube player (experimental)
        player = document.getElementById("movie_player");

        if (player) {
            console.log("Movie player object found");
            let latestEndLocalTime = "00:00:00"; // Initialize with a default time

            setInterval(() => {
                try {
                    const currentVideoTime = player.getCurrentTime();
                    const videoLength = player.getDuration();
                    const endLocalTime = calculateEndTime(
                        currentVideoTime,
                        videoLength
                    );

                    if (endLocalTime !== latestEndLocalTime) {
                        latestEndLocalTime = endLocalTime;
                        console.log("End Local Time:", latestEndLocalTime);
                    } else {
                        console.log(
                            "End Local Time remains unchanged:",
                            latestEndLocalTime
                        );
                    }
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
        `Current Video Time: ${currentVideoTime}, Video Length: ${videoLength}, remaining: ${remainingVideoTime}, current local time: ${currentLocalTime.toLocaleTimeString()}, end local time: ${endLocalTime.toLocaleTimeString()}`
    );

    return endLocalTime.toLocaleTimeString();
}
