import { isMobile, isShorts, cLog } from "../shared/config.js";
import { store } from "./store.js";

// ─── Viewport ────────────────────────────────────────────────────────────────
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  if (
    rect.top === 0 &&
    rect.left === 0 &&
    rect.bottom === 0 &&
    rect.right === 0
  )
    return false;
  const h = innerHeight || document.documentElement.clientHeight;
  const w = innerWidth || document.documentElement.clientWidth;
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= h && rect.right <= w;
}

// ─── Core button queries (cached per navigation) ──────────────────────────────
export function getButtons() {
  if (store._buttons) return store._buttons;

  let result = null;

  if (isShorts()) {
    const selector = isMobile
      ? "ytm-like-button-renderer"
      : "#like-button > ytd-like-button-renderer";
    for (const el of document.querySelectorAll(selector)) {
      if (isInViewport(el)) {
        result = el;
        break;
      }
    }
  } else if (isMobile) {
    result =
      document.querySelector(
        ".slim-video-action-bar-actions .segmented-buttons",
      ) ?? document.querySelector(".slim-video-action-bar-actions");
  } else if (document.getElementById("menu-container")?.offsetParent === null) {
    result =
      document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ??
      document.querySelector(
        "ytd-menu-renderer.ytd-video-primary-info-renderer > div",
      );
  } else {
    result = document
      .getElementById("menu-container")
      ?.querySelector("#top-level-buttons-computed");
  }

  store._buttons = result;
  return result;
}

export function getLikeButton() {
  if (store._likeButton) return store._likeButton;

  if (isShorts() && !isMobile) {
    const res = document.querySelector("like-button-view-model");
    if (res) {
      store._likeButton = res;
      return res;
    }
  }

  const buttons = getButtons();
  const result =
    buttons?.children[0]?.tagName ===
    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
      ? (document.querySelector("#segmented-like-button") ??
        buttons.children[0].children[0])
      : (buttons?.querySelector("like-button-view-model") ??
        buttons?.children[0]);

  store._likeButton = result;
  return result;
}

export function getDislikeButton() {
  if (store._dislikeButton) return store._dislikeButton;

  if (isShorts() && !isMobile) {
    const res = document.querySelector("dislike-button-view-model");
    if (res) {
      store._dislikeButton = res;
      return res;
    }
  }

  const buttons = getButtons();
  let result;

  if (
    buttons?.children[0]?.tagName ===
    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
  ) {
    result =
      buttons.children[0].children[1] === undefined
        ? document.querySelector("#segmented-dislike-button")
        : buttons.children[0].children[1];
  } else if (
    buttons?.querySelector("segmented-like-dislike-button-view-model")
  ) {
    result = buttons.querySelector("dislike-button-view-model");
    if (!result) cLog("Dislike button wasn't added to DOM yet...");
  } else {
    result = buttons?.children[1];
  }

  store._dislikeButton = result;
  return result;
}

// ─── Text containers ──────────────────────────────────────────────────────────
export function getLikeTextContainer() {
  const btn = getLikeButton();
  if (!btn) return null;

  if (isShorts()) {
    const shortsText = btn.querySelector(".ytAttributedStringHost");
    if (shortsText) return shortsText;
  }

  return (
    btn.querySelector("#text") ??
    btn.getElementsByTagName("yt-formatted-string")[0] ??
    btn.querySelector("span[role='text']")
  );
}

export function getDislikeTextContainer() {
  const btn = getDislikeButton();
  if (!btn) return null;

  if (isShorts()) {
    const shortsText = btn.querySelector(".ytAttributedStringHost");
    if (shortsText) return shortsText;
  }

  let result =
    btn.querySelector("#text") ??
    btn.getElementsByTagName("yt-formatted-string")[0] ??
    btn.querySelector("span[role='text']");

  if (result === null) {
    const span = document.createElement("span");
    span.id = "text";
    span.style.marginLeft = "6px";
    btn.querySelector("button")?.appendChild(span);
    if (btn.querySelector("button"))
      btn.querySelector("button").style.width = "auto";
    result = span;
  }

  return result;
}

// ─── Video ID ─────────────────────────────────────────────────────────────────
export function getVideoId() {
  const { pathname, searchParams } = new URL(window.location.href);

  if (isShorts()) {
    const match = pathname.match(/^\/shorts\/([^/?&]+)/);
    return match?.[1] ?? pathname.slice(8);
  }

  if (pathname.startsWith("/clip")) {
    return (
      document.querySelector("meta[itemprop='videoId']") ??
      document.querySelector("meta[itemprop='identifier']")
    )?.content;
  }

  return searchParams.get("v");
}

// ─── Ready check ─────────────────────────────────────────────────────────────
export function isVideoLoaded() {
  if (isShorts()) {
    return !!getDislikeButton() && !!getDislikeTextContainer();
  }

  if (isMobile)
    return (
      document.getElementById("player")?.getAttribute("loading") === "false"
    );

  const videoId = getVideoId();
  return (
    document.querySelector(`ytd-watch-grid[video-id='${videoId}']`) !== null ||
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

export function checkForUserAvatarButton() {
  if (isMobile) return false;
  return !!document.querySelector("#avatar-btn");
}
