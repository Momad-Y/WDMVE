# WDMVE — When Does My Video End?

A browser extension that watches the video you're playing and tells you the
local clock time it will finish, so you know if you can fit in one more
episode before you need to be somewhere or do something else.

## How it works

- **`scripts/content.js`** runs on YouTube watch pages (`youtube.com/watch`)
  and injects two page-context scripts:
    - **`scripts/inject-api.js`** — a local copy of the YouTube IFrame API
      bootstrap.
    - **`scripts/yt-helper.js`** — polls the page's `movie_player` element
      once a second for current playback time and duration, computes the
      wall-clock end time, and posts it back via `window.postMessage`.
- **`scripts/content.js`** relays that `YT_END_TIME` message to the rest of
  the extension via `chrome.runtime.sendMessage`.
- **`popup/popup.js`** listens for that message, caches the latest value in
  `chrome.storage.local`, and renders it in the popup UI
  (`popup/popup.html`).
- **`background.js`** swaps the toolbar icon between an "active" and
  "default" state based on whether the current tab is on a supported site.

## Current state

- ✅ YouTube watch pages — fully working end-time calculation.
- ⚠️ Netflix — listed in the manifest's content-script matches and toolbar
  icon logic, but no Netflix-specific injection/parsing exists yet
  (`scripts/content.js` only injects on YouTube).
- ⚠️ Options page (`options/options.html`) — placeholder, not yet built out.

## Install (unpacked, for development)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository's root folder.
4. Open a YouTube video — the toolbar icon switches to its active state, and
   the popup shows the video's projected end time.

No build step or dependencies — it's plain Manifest V3 JavaScript/HTML/CSS.

## Project structure

```
manifest.json          Extension manifest (MV3)
background.js           Toolbar icon state per tab
popup/                  Toolbar popup UI showing the computed end time
options/                Options page (placeholder)
scripts/
  content.js            Entry point injected into YouTube watch pages
  inject-api.js          Local copy of the YouTube IFrame API bootstrap
  yt-helper.js            Reads player state and computes end time
images/                 Toolbar icons (default/active, multiple sizes)
```

## Roadmap

- Show the end time on video thumbnails while browsing (not just the watch
  page)
- Handle variable playback speeds in the end-time calculation
- Full Netflix support
- A working settings/options page
