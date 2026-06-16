import { extConfig, isMobile, isShorts, cLog } from "../shared/config.js";
import { numberFormat } from "../shared/format.js";
import { createObserver } from "../shared/observer.js";
import {
  fetchAndSetVotes,
  setLikes,
  setDislikes,
  getLikeCountFromButton,
} from "./api.js";
import {
  getButtons,
  getLikeButton,
  getDislikeButton,
  getDislikeTextContainer,
  getVideoId,
  isVideoLoaded,
  checkForUserAvatarButton,
} from "./dom.js";
import { createRateBar } from "../ryd/ratebar.js";
import { store } from "./store.js";

// ─── Polling & Ready States ──────────────────────────────────────────────────
let rafId = null;
let rafStart = 0;
const RAF_TIMEOUT_MS = 5000;

function pollUntilReady() {
  if (performance.now() - rafStart > RAF_TIMEOUT_MS) {
    cLog(
      isShorts()
        ? "[Shorts] Timed out waiting for buttons"
        : "Timed out waiting for buttons",
    );
    return;
  }

  if (isShorts() && !getVideoId()) return;

  store.clearCache();

  const ready = isShorts()
    ? isVideoLoaded()
    : getButtons()?.offsetParent && isVideoLoaded();

  if (!ready || !setupButtons()) {
    rafId = requestAnimationFrame(pollUntilReady);
    return;
  }

  fetchAndSetVotes();
}

function startPoll() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafStart = performance.now();
  rafId = requestAnimationFrame(pollUntilReady);
}

// ─── DOM update ───────────────────────────────────────────────────────────────
export function updateDOMDislikes() {
  setDislikes(numberFormat(store.dislikesValue));

  // Shorts không có thanh RateBar
  if (!isShorts()) {
    createRateBar(store.likesValue, store.dislikesValue);
  }
}

// ─── Click handlers ───────────────────────────────────────────────────────────
export function likeClicked() {
  // Shorts không cần check avatar-btn (hoặc không phụ thuộc cơ chế này như video thường)
  if (!isShorts() && !checkForUserAvatarButton()) return;

  if (store.previousState === 1) {
    store.likesValue--;
    store.previousState = 3;
  } else if (store.previousState === 2) {
    store.likesValue++;
    store.dislikesValue--;
    store.previousState = 1;
  } else {
    store.likesValue++;
    store.previousState = 1;
  }

  updateDOMDislikes();

  if (!isShorts() && extConfig.numberDisplayReformatLikes) {
    const n = getLikeCountFromButton();
    if (n !== false) setLikes(numberFormat(n));
  }
}

export function dislikeClicked() {
  if (!isShorts() && !checkForUserAvatarButton()) return;

  if (store.previousState === 3) {
    store.dislikesValue++;
    store.previousState = 2;
  } else if (store.previousState === 2) {
    store.dislikesValue--;
    store.previousState = 3;
  } else {
    store.likesValue--;
    store.dislikesValue++;
    store.previousState = 2;
    if (!isShorts() && extConfig.numberDisplayReformatLikes) {
      const n = getLikeCountFromButton();
      if (n !== false) setLikes(numberFormat(n));
    }
  }

  updateDOMDislikes();
}

// ─── Smartimation observer ────────────────────────────────────────────────────
let smartimationObserver = null;

function attachSmartimationObserver(buttons) {
  if (isShorts() || !buttons) return; // Shorts không sử dụng smartimation observer của video thường

  if (!smartimationObserver) {
    smartimationObserver = createObserver(
      { attributes: true, subtree: true, childList: true },
      updateDOMDislikes,
    );
    smartimationObserver.container = null;
  }

  const container = buttons.querySelector("yt-smartimation");
  if (container && smartimationObserver.container !== container) {
    cLog("Initializing smartimation observer");
    smartimationObserver.disconnect();
    smartimationObserver.observe(container);
    smartimationObserver.container = container;
  }
}

// ─── Button wiring ────────────────────────────────────────────────────────────
function setupButtons() {
  const likeButton = getLikeButton();
  const dislikeButton = getDislikeButton();
  const buttons = getButtons();

  if (!likeButton || !dislikeButton) return false;
  if (store.preNavigateLikeButton === likeButton) return true;

  const prefix = isShorts() ? "[Shorts] " : "";
  cLog(`${prefix}Registering button listeners...`);

  try {
    likeButton.addEventListener("click", likeClicked);
    likeButton.addEventListener("touchstart", likeClicked, { passive: true });
    dislikeButton.addEventListener("click", dislikeClicked);
    dislikeButton.addEventListener("touchstart", dislikeClicked, {
      passive: true,
    });

    if (!isShorts()) {
      dislikeButton.addEventListener("focusin", updateDOMDislikes);
      dislikeButton.addEventListener("focusout", updateDOMDislikes);
    }

    store.preNavigateLikeButton = likeButton;

    if (buttons) {
      attachSmartimationObserver(buttons);
    }
  } catch {
    return false;
  }

  return true;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export function onNavigate() {
  const newVideoId = getVideoId();

  if (newVideoId && newVideoId === store.currentVideoId) {
    cLog(
      isShorts()
        ? "[Shorts] Same Short, skipping reload"
        : "Same video, skipping reload",
    );
    return;
  }

  if (isShorts()) {
    cLog(`[Shorts] Navigation → ${newVideoId}`);
  } else {
    cLog(`Navigation detected: ${store.currentVideoId} → ${newVideoId}`);
  }

  store.currentVideoId = newVideoId;
  store.reset();
  startPoll();
}

// ─── Visibility ───────────────────────────────────────────────────────────────
export function onVisibilityChange() {
  if (document.visibilityState !== "visible") return;

  if (isShorts()) {
    store.clearCache();
    startPoll();
    return;
  }

  if (!store.currentVideoId || store.dislikesValue === 0) {
    startPoll();
    return;
  }

  cLog("Tab became visible, re-applying stored votes");
  store.clearCache();
  store.preNavigateLikeButton = null;
  startPoll();
}

// ─── Mobile history patch ─────────────────────────────────────────────────────
let mobileInterval = null;

export function setupMobileHistoryPatch() {
  if (!isMobile) return;

  const originalPush = history.pushState;
  history.pushState = function (...args) {
    onNavigate();
    return originalPush.apply(history, args);
  };

  mobileInterval = setInterval(() => {
    const dislikeButton = getDislikeButton();
    if (!dislikeButton) return;
    const text = numberFormat(store.mobileDislikes);
    const rendered = dislikeButton.querySelector(".button-renderer-text");
    const target = rendered ?? getDislikeTextContainer();
    if (target && target.innerText !== text) target.innerText = text;
  }, 1000);
}

export function teardownMobileHistoryPatch() {
  if (mobileInterval !== null) {
    clearInterval(mobileInterval);
    mobileInterval = null;
  }
}
