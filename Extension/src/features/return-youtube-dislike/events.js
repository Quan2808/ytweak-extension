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
  isVideoLoaded,
} from "./dom.js";
import { numberFormat, getColorFromTheme } from "./format.js";
import { createObserver } from "./observer.js";
import { createRateBar } from "./ratebar.js";
import { store } from "./store.js";

function updateDOMDislikes() {
  setDislikes(numberFormat(store.dislikesValue));
  createRateBar(store.likesValue, store.dislikesValue);
}

function checkForUserAvatarButton() {
  if (isMobile) return false;
  return !!document.querySelector("#avatar-btn");
}

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
    const nativeLikes = getLikeCountFromButton();
    if (nativeLikes !== false) setLikes(numberFormat(nativeLikes));
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
      const nativeLikes = getLikeCountFromButton();
      if (nativeLikes !== false) setLikes(numberFormat(nativeLikes));
    }
  }

  updateDOMDislikes();
}

let smartimationObserver = null;

export function setEventListeners() {
  let jsInitChecktimer;

  function checkForJS_Finish() {
    if (!isShorts() && !(getButtons()?.offsetParent && isVideoLoaded())) return;

    const buttons = getButtons();
    const dislikeButton = getDislikeButton();

    if (store.preNavigateLikeButton !== getLikeButton() && dislikeButton) {
      cLog("Registering button listeners...");
      try {
        const likeButton = getLikeButton();
        likeButton.addEventListener("click", likeClicked);
        likeButton.addEventListener("touchstart", likeClicked);
        dislikeButton.addEventListener("click", dislikeClicked);
        dislikeButton.addEventListener("touchstart", dislikeClicked);
        dislikeButton.addEventListener("focusin", updateDOMDislikes);
        dislikeButton.addEventListener("focusout", updateDOMDislikes);
        store.preNavigateLikeButton = likeButton;

        if (!smartimationObserver) {
          smartimationObserver = createObserver(
            { attributes: true, subtree: true, childList: true },
            updateDOMDislikes,
          );
          smartimationObserver.container = null;
        }

        const smartimationContainer = buttons.querySelector("yt-smartimation");
        if (
          smartimationContainer &&
          smartimationObserver.container !== smartimationContainer
        ) {
          cLog("Initializing smartimation mutation observer");
          smartimationObserver.disconnect();
          smartimationObserver.observe(smartimationContainer);
          smartimationObserver.container = smartimationContainer;
        }
      } catch {
        return; // Don't spam errors
      }
    }

    if (dislikeButton) {
      fetchAndSetVotes();
      clearInterval(jsInitChecktimer);
    }
  }

  cLog("Setting up...");
  jsInitChecktimer = setInterval(checkForJS_Finish, 111);
}

export function setupMobileHistoryPatch() {
  if (!isMobile) return;

  const originalPush = history.pushState;
  history.pushState = function (...args) {
    window.returnDislikeButtonlistenersSet = false;
    setEventListeners(args[2]);
    return originalPush.apply(history, args);
  };

  // Keep dislike text visible on mobile (YouTube resets it)
  setInterval(() => {
    const dislikeButton = getDislikeButton();
    const text = numberFormat(store.mobileDislikes);

    if (dislikeButton?.querySelector(".button-renderer-text") === null) {
      getDislikeTextContainer().innerText = text;
    } else if (dislikeButton) {
      dislikeButton.querySelector(".button-renderer-text").innerText = text;
    }
  }, 1000);
}
