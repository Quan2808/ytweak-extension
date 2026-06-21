import {
  addStyle,
  removeElement,
  getVideoId,
  getElementById,
  getSelector,
} from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";
import { updateButtonUI, injectYTWatchRightButton } from "@shared/utils/player";
import { watchVideoReady, clearVideoWatcher } from "@shared/utils/dom";

const TWEAK_ID = "show-thumbnail-on-pause";
const OVERLAY_ID = "thumb-overlay";

let currentVideoElement = null;
let isFeatureActive = false; 

const ICON_NORMAL =
  "M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.89 2 2 2H1c-.55 0-1 .45-1 1s.45 1 1 1h22c.55 0 1-.45 1-1s-.45-1-1-1zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l3.61 3.36c.21.2.21.53 0 .73z";
const ICON_ACTIVE =
  "M23 18h-1.2l1.79 1.79c.24-.18.41-.46.41-.79 0-.55-.45-1-1-1M3.23 2.28c-.39-.39-1.03-.39-1.42 0s-.39 1.02 0 1.41l.84.86s-.66.57-.66 1.47C2 6.92 2 16 2 16l.01.01c0 1.09.88 1.98 1.97 1.99H1c-.55 0-1 .45-1 1s.45 1 1 1h17.13l2 2c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41zM7 15c.31-1.48.94-2.93 2.08-4.05l1.59 1.59C9.13 12.92 7.96 13.71 7 15m6-5.87v-.98c0-.44.52-.66.84-.37L15 8.87l1.61 1.5c.21.2.21.53 0 .73l-.89.83 5.58 5.58c.43-.37.7-.9.7-1.51V6c0-1.09-.89-1.98-1.98-1.98H7.8l5.14 5.13c.02-.01.04-.02.06-.02";

const TWEAK_CSS = `
  #${OVERLAY_ID} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 10;
    display: none;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }
`;

function getThumbnailUrl(videoId, quality = "maxresdefault") {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

async function loadThumbnail(overlay, videoId) {
  const img = new Image();
  img.src = getThumbnailUrl(videoId, "maxresdefault");

  await new Promise((resolve) => {
    img.onload = () => {
      const isPlaceholder = img.naturalWidth <= 120;
      overlay.style.backgroundImage = `url('${
        isPlaceholder ? getThumbnailUrl(videoId, "hqdefault") : img.src
      }')`;
      resolve();
    };
    img.onerror = () => {
      overlay.style.backgroundImage = `url('${getThumbnailUrl(videoId, "hqdefault")}')`;
      resolve();
    };
  });
}

function getOverlay() {
  return getElementById(OVERLAY_ID);
}

function syncOverlaySize() {
  const overlay = getOverlay();
  const video = currentVideoElement || getSelector("video");
  if (!overlay || !video) return;

  overlay.style.width = video.style.width || `${video.clientWidth}px`;
  overlay.style.height = video.style.height || `${video.clientHeight}px`;
}

function showOverlay() {
  if (!isFeatureActive) return; 
  const overlay = getOverlay();
  if (!overlay) return;
  const videoId = getVideoId();
  if (!videoId) return;

  syncOverlaySize();
  overlay.style.display = "block";
  loadThumbnail(overlay, videoId);
}

function hideOverlay() {
  const overlay = getOverlay();
  if (overlay) overlay.style.display = "none";
}

const videoHandlers = {
  pause: () => {
    if (!currentVideoElement?.seeking) showOverlay();
  },
  play: () => hideOverlay(),
  seeking: () => hideOverlay(),
};

function removeVideoListeners() {
  if (currentVideoElement) {
    currentVideoElement.removeEventListener("pause", videoHandlers.pause);
    currentVideoElement.removeEventListener("play", videoHandlers.play);
    currentVideoElement.removeEventListener("seeking", videoHandlers.seeking);
    window.removeEventListener("resize", syncOverlaySize);
    document.removeEventListener("fullscreenchange", syncOverlaySize);
    currentVideoElement = null;
  }
}

function setupVideoListeners(video) {
  removeVideoListeners();
  currentVideoElement = video;
  
  video.addEventListener("pause", videoHandlers.pause);
  video.addEventListener("play", videoHandlers.play);
  video.addEventListener("seeking", videoHandlers.seeking);
  
  window.addEventListener("resize", syncOverlaySize);
  document.addEventListener("fullscreenchange", syncOverlaySize);

  if (video.paused && !video.seeking) {
    showOverlay();
  }
}

function toggleFeature() {
  isFeatureActive = !isFeatureActive;
  updateButtonUI(TWEAK_ID, isFeatureActive, ICON_ACTIVE, ICON_NORMAL);
  
  if (isFeatureActive) {
    if (currentVideoElement?.paused && !currentVideoElement?.seeking) {
      showOverlay();
    }
  } else {
    hideOverlay();
  }
}

function injectFeature() {
  const playerContainer = getSelector("#movie_player");
  const video = getSelector("video");
  if (!video) return;

  if (playerContainer && !getOverlay()) {
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    playerContainer.appendChild(overlay);
  }

  setupVideoListeners(video);

  if (document.getElementById(TWEAK_ID)) {
    updateButtonUI(TWEAK_ID, isFeatureActive, ICON_ACTIVE, ICON_NORMAL);
    return;
  }

  injectYTWatchRightButton({
    id: TWEAK_ID,
    title: "Show Thumbnail on Pause",
    titleActive: "Thumb on Pause",
    titleInactive: "Thumb on Pause",
    iconPath: isFeatureActive ? ICON_ACTIVE : ICON_NORMAL,
    onClick: toggleFeature,
    onInject: () => {
      updateButtonUI(TWEAK_ID, isFeatureActive, ICON_ACTIVE, ICON_NORMAL);
    },
  });
}

function navHandler() {
  hideOverlay();
  watchVideoReady(TWEAK_ID, injectFeature);
}

function cleanup() {
  clearVideoWatcher(TWEAK_ID);
  removeVideoListeners();
  hideOverlay();
  
  removeElement(`#${OVERLAY_ID}`);
  removeElement(`#${TWEAK_ID}`);
  window.removeEventListener("yt-navigate-finish", navHandler);
}

export default {
  id: TWEAK_ID,
  get name() { return t("tweak_showThumbnailOnPause_name"); },
  get description() { return t("tweak_showThumbnailOnPause_desc"); },
  default: false,

  enable() {
    isFeatureActive = true; 
    addStyle(TWEAK_ID, TWEAK_CSS);
    window.addEventListener("yt-navigate-finish", navHandler);
    navHandler();
  },

  disable() {
    cleanup();
  },
};