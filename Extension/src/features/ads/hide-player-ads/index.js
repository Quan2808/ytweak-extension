import { addStyle, getElementById, removeElement } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "hide-player-ads";

const cssContent = `
    #player-ads,
    .video-ads.ytp-ad-module,
    .ytp-ad-module,
    .ytp-ad-overlay-container,
    .ytp-ad-image-overlay,
    .ytp-ad-text-overlay,
    .ytp-ad-progress-list,
    .ytp-ad-skip-button-container {
        display: none !important;
    }

    ytd-enforcement-message-view-model,
    #error-screen ytd-enforcement-message-view-model,
    .ytd-enforcement-message-view-model,
    #header-ad-container {
        display: none !important;
        pointer-events: none !important;
    }

    #player-container {
        display: block !important;
        visibility: visible !important;
    }
`;

let observer = null;
let intervalId = null;

function bypassEnforcement() {
  const errorScreen = document.getElementById("error-screen");
  if (errorScreen) {
    errorScreen.style.display = "none";
  }

  const video = document.querySelector("video.html5-main-video");
  if (video && video.paused) {
    if (!video.src && !video.currentSrc) {
      const player = document.getElementById("movie_player");
      if (player && typeof player.playVideo === "function") {
        player.playVideo();
      }
    } else {
      video.play().catch(() => {});
    }
  }

  const moviePlayer = document.getElementById("movie_player");
  if (moviePlayer) {
    moviePlayer.classList.remove("unstarted-mode");
  }
}

function setupObserver() {
  if (observer) return;

  observer = new MutationObserver(() => {
    bypassEnforcement();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });
}

function injectStyle() {
  if (getElementById(TWEAK_ID)) return;
  addStyle(TWEAK_ID, cssContent);
}

function removeStyle() {
  removeElement(`#${TWEAK_ID}`);
}

export default {
  id: TWEAK_ID,
  get name() {
    return t("tweak_hidePlayerAds_name");
  },
  get description() {
    return t("tweak_hidePlayerAds_desc");
  },
  default: false,

  enable() {
    injectStyle();
    setupObserver();
    bypassEnforcement();
    intervalId = setInterval(bypassEnforcement, 1000);
  },

  disable() {
    removeStyle();

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    const errorScreen = document.getElementById("error-screen");
    if (errorScreen) {
      errorScreen.style.display = "";
    }
  },
};
