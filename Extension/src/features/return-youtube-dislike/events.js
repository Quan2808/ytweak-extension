import {
  fetchAndSetVotes,
  setLikes,
  setDislikes,
  getLikeCountFromButton,
} from "./api.js";
import { extConfig, isMobile, isShorts, cLog } from "./config.js";
import {
  getButtons,
  getLikeButton,
  getDislikeButton,
  getDislikeTextContainer,
  getVideoId,
  isVideoLoaded,
  checkForUserAvatarButton,
} from "./dom.js";
import { numberFormat } from "./format.js";
import { createObserver } from "./observer.js";
import { createRateBar } from "./ratebar.js";
import { store } from "./store.js";

// ─── DOM update ───────────────────────────────────────────────────────────────

export function updateDOMDislikes() {
  setDislikes(numberFormat(store.dislikesValue));
  createRateBar(store.likesValue, store.dislikesValue);
}

// ─── Click handlers ───────────────────────────────────────────────────────────

export function likeClicked() {
  if (!checkForUserAvatarButton()) return;

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

  if (extConfig.numberDisplayReformatLikes) {
    const n = getLikeCountFromButton();
    if (n !== false) setLikes(numberFormat(n));
  }
}

export function dislikeClicked() {
  if (!checkForUserAvatarButton()) return;

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
    if (extConfig.numberDisplayReformatLikes) {
      const n = getLikeCountFromButton();
      if (n !== false) setLikes(numberFormat(n));
    }
  }

  updateDOMDislikes();
}

// ─── Smartimation observer ────────────────────────────────────────────────────

let smartimationObserver = null;

function attachSmartimationObserver(buttons) {
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

// ─── Core setup — runs once per navigation ────────────────────────────────────

function setupButtons() {
  const likeButton = getLikeButton();
  const dislikeButton = getDislikeButton();
  const buttons = getButtons();

  if (!likeButton || !dislikeButton) return false;

  // Already wired up for this navigation
  if (store.preNavigateLikeButton === likeButton) return true;

  cLog("Registering button listeners...");
  try {
    likeButton.addEventListener("click", likeClicked);
    likeButton.addEventListener("touchstart", likeClicked, { passive: true });
    dislikeButton.addEventListener("click", dislikeClicked);
    dislikeButton.addEventListener("touchstart", dislikeClicked, {
      passive: true,
    });
    dislikeButton.addEventListener("focusin", updateDOMDislikes);
    dislikeButton.addEventListener("focusout", updateDOMDislikes);

    store.preNavigateLikeButton = likeButton;
    if (buttons) attachSmartimationObserver(buttons);
  } catch {
    return false;
  }

  return true;
}

// ─── Navigation handler ───────────────────────────────────────────────────────
// YouTube is an SPA — yt-navigate-finish fires on every video change.
// We also poll briefly with rAF in case the event fires before DOM is ready.

let rafId = null;
let rafStart = 0;
const RAF_TIMEOUT_MS = 5000; // give up after 5s of polling

function pollUntilReady() {
  const now = performance.now();
  if (now - rafStart > RAF_TIMEOUT_MS) {
    cLog("Timed out waiting for buttons");
    return;
  }

  // Clear DOM cache each poll tick — buttons may not be in DOM yet
  store.clearCache();

  const ready = isShorts() || (getButtons()?.offsetParent && isVideoLoaded());
  if (!ready) {
    rafId = requestAnimationFrame(pollUntilReady);
    return;
  }

  if (!setupButtons()) {
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

export function onNavigate() {
  const newVideoId = getVideoId();

  if (newVideoId && newVideoId === store.currentVideoId) {
    cLog("Same video, skipping reload");
    return;
  }

  cLog(`Navigation detected: ${store.currentVideoId} → ${newVideoId}`);
  store.currentVideoId = newVideoId;
  store.reset();
  startPoll();
}

function onVisibilityChange() {
  if (document.visibilityState !== "visible") return;

  // No data yet — full fetch needed
  if (!store.currentVideoId || store.dislikesValue === 0) {
    startPoll();
    return;
  }

  // Data already in store — just re-paint the DOM (fast, no network)
  cLog("Tab became visible, re-applying stored votes");
  store.clearCache();
  store.preNavigateLikeButton = null; // force re-register listeners
  startPoll();
}

export { onVisibilityChange };

// ─── Mobile: keep dislike text alive (YouTube resets it) ─────────────────────

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
