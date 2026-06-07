import { isMobile, isShorts, cLog } from "./config.js";

export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = innerHeight || document.documentElement.clientHeight;
  const width = innerWidth || document.documentElement.clientWidth;
  return (
    !(rect.top === 0 && rect.left === 0 && rect.bottom === 0 && rect.right === 0) &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= height &&
    rect.right <= width
  );
}

export function getButtons() {
  if (isShorts()) {
    const elements = document.querySelectorAll(
      isMobile
        ? "ytm-like-button-renderer"
        : "#like-button > ytd-like-button-renderer",
    );
    for (const element of elements) {
      if (isInViewport(element)) return element;
    }
  }

  if (isMobile) {
    return (
      document.querySelector(".slim-video-action-bar-actions .segmented-buttons") ??
      document.querySelector(".slim-video-action-bar-actions")
    );
  }

  if (document.getElementById("menu-container")?.offsetParent === null) {
    return (
      document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ??
      document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div")
    );
  }

  return document.getElementById("menu-container")?.querySelector("#top-level-buttons-computed");
}

export function getLikeButton() {
  const buttons = getButtons();
  return buttons?.children[0]?.tagName === "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
    ? document.querySelector("#segmented-like-button") ??
        buttons.children[0].children[0]
    : buttons?.querySelector("like-button-view-model") ?? buttons?.children[0];
}

export function getDislikeButton() {
  const buttons = getButtons();
  if (buttons?.children[0]?.tagName === "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER") {
    return buttons.children[0].children[1] === undefined
      ? document.querySelector("#segmented-dislike-button")
      : buttons.children[0].children[1];
  }

  if (buttons?.querySelector("segmented-like-dislike-button-view-model")) {
    const dislikeViewModel = buttons.querySelector("dislike-button-view-model");
    if (!dislikeViewModel) cLog("Dislike button wasn't added to DOM yet...");
    return dislikeViewModel;
  }

  return buttons?.children[1];
}

export function getLikeTextContainer() {
  const likeButton = getLikeButton();
  return (
    likeButton?.querySelector("#text") ??
    likeButton?.getElementsByTagName("yt-formatted-string")[0] ??
    likeButton?.querySelector("span[role='text']")
  );
}

export function getDislikeTextContainer() {
  const dislikeButton = getDislikeButton();
  let result =
    dislikeButton?.querySelector("#text") ??
    dislikeButton?.getElementsByTagName("yt-formatted-string")[0] ??
    dislikeButton?.querySelector("span[role='text']");

  if (result === null) {
    const textSpan = document.createElement("span");
    textSpan.id = "text";
    textSpan.style.marginLeft = "6px";
    dislikeButton?.querySelector("button").appendChild(textSpan);
    if (dislikeButton) dislikeButton.querySelector("button").style.width = "auto";
    result = textSpan;
  }

  return result;
}

export function getVideoId() {
  const urlObject = new URL(window.location.href);
  const pathname = urlObject.pathname;

  if (pathname.startsWith("/clip")) {
    return (
      document.querySelector("meta[itemprop='videoId']") ??
      document.querySelector("meta[itemprop='identifier']")
    ).content;
  }

  if (pathname.startsWith("/shorts")) return pathname.slice(8);
  return urlObject.searchParams.get("v");
}

export function isVideoLoaded() {
  if (isMobile) {
    return document.getElementById("player")?.getAttribute("loading") === "false";
  }

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
