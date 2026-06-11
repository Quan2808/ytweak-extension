import {
  addStyle,
  removeElement,
  getVideoId,
  getElementById,
  getSelector,
} from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "show-thumbnail-on-pause";
const OVERLAY_ID = "thumb-overlay";

const TWEAK_CSS = `
  #${OVERLAY_ID} {
    position: absolute;
    inset: 0;
    background-size: cover;
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

let videoEl = null;
let handlers = null;
let navHandler = null;
let isDestroyed = false;
let initTimeout = null;

function getOverlay() {
  return getElementById(OVERLAY_ID);
}

function showOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  const videoId = getVideoId();
  if (!videoId) return;

  overlay.style.display = "block";
  loadThumbnail(overlay, videoId);
}

function hideOverlay() {
  const overlay = getOverlay();
  if (overlay) overlay.style.display = "none";
}

function unbindVideo() {
  if (!videoEl || !handlers) return;
  videoEl.removeEventListener("pause", handlers.pause);
  videoEl.removeEventListener("play", handlers.play);
  videoEl.removeEventListener("seeking", handlers.seeking);
  videoEl = null;
  handlers = null;
}

function bindVideo() {
  unbindVideo();

  const el = getSelector("video");
  if (!el) return false;

  videoEl = el;

  handlers = {
    pause: () => {
      if (!videoEl?.seeking) showOverlay();
    },
    play: () => hideOverlay(),
    seeking: () => hideOverlay(),
  };

  videoEl.addEventListener("pause", handlers.pause);
  videoEl.addEventListener("play", handlers.play);
  videoEl.addEventListener("seeking", handlers.seeking);

  if (videoEl.paused && !videoEl.seeking) showOverlay();

  return true;
}

function initializeFeature(retryCount = 0) {
  if (isDestroyed) return;

  const playerContainer = getSelector("#movie_player");

  if (!playerContainer) {
    // Thử lại sau mỗi 300ms, tối đa 15 lần (~4.5 giây) phòng trường hợp mạng chậm
    if (retryCount < 15) {
      clearTimeout(initTimeout);
      initTimeout = setTimeout(() => {
        initializeFeature(retryCount + 1);
      }, 300);
    }
    return;
  }

  if (!getOverlay()) {
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    playerContainer.appendChild(overlay);
  }

  bindVideo();
}

// ─── SPA navigation handler ───────────────────────────────────────────────────
function setupNavListener() {
  navHandler = () => {
    if (isDestroyed) return;
    hideOverlay();

    // Khi chuyển video, hủy các hàng đợi cũ và quét lại DOM mới
    clearTimeout(initTimeout);
    initTimeout = setTimeout(() => {
      initializeFeature();
    }, 200);
  };

  window.addEventListener("yt-navigate-finish", navHandler);
}

export default {
  id: TWEAK_ID,

  get name() {
    return t("tweak_showThumbnailOnPause_name");
  },
  get description() {
    return t("tweak_showThumbnailOnPause_desc");
  },

  default: false,

  enable() {
    isDestroyed = false;

    addStyle(TWEAK_ID, TWEAK_CSS);
    setupNavListener();
    initializeFeature();
  },

  disable() {
    isDestroyed = true;
    clearTimeout(initTimeout);

    unbindVideo();

    if (navHandler) {
      window.removeEventListener("yt-navigate-finish", navHandler);
      navHandler = null;
    }

    removeElement(`#${OVERLAY_ID}`);
    removeElement(`#ytweak-${TWEAK_ID}`);
  },
};
