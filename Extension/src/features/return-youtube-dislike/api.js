import { extConfig, isMobile, isShorts, cLog } from "./config.js";
import {
  getButtons,
  getVideoId,
  getLikeButton,
  getDislikeButton,
  getLikeTextContainer,
  getDislikeTextContainer,
} from "./dom.js";
import { numberFormat, getColorFromTheme } from "./format.js";
import { getShortsObserver } from "./observer.js";
import { createRateBar } from "./ratebar.js";
import { store } from "./store.js";

export function setLikes(likesCount) {
  if (isMobile) {
    getButtons()?.children[0]?.querySelector(".button-renderer-text") &&
      (getButtons().children[0].querySelector(
        ".button-renderer-text",
      ).innerText = likesCount);
    return;
  }
  getLikeTextContainer().innerText = likesCount;
}

export function setDislikes(dislikesCount) {
  if (isMobile) {
    store.mobileDislikes = dislikesCount;
    return;
  }
  const container = getDislikeTextContainer();
  container?.removeAttribute("is-empty");
  if (container?.innerText !== dislikesCount) {
    container.innerText = dislikesCount;
  }
}

export function getLikeCountFromButton() {
  try {
    if (isShorts()) return false;
    const likeButton =
      getLikeButton()?.querySelector("yt-formatted-string#text") ??
      getLikeButton()?.querySelector("button");
    const likesStr = likeButton?.getAttribute("aria-label")?.replace(/\D/g, "");
    return likesStr?.length > 0 ? parseInt(likesStr) : false;
  } catch {
    return false;
  }
}

export async function fetchAndSetVotes() {
  cLog("Fetching votes...");

  try {
    const response = await fetch(
      `https://returnyoutubedislikeapi.com/votes?videoId=${getVideoId()}`,
    );
    const json = await response.json();

    if (!json || "traceId" in response) return;

    const { dislikes, likes } = json;
    cLog(`Received count: ${dislikes}`);

    store.likesValue = likes;
    store.dislikesValue = dislikes;

    setDislikes(numberFormat(dislikes));

    if (extConfig.numberDisplayReformatLikes) {
      const nativeLikes = getLikeCountFromButton();
      if (nativeLikes !== false) setLikes(numberFormat(nativeLikes));
    }

    createRateBar(likes, dislikes);

    if (extConfig.coloredThumbs) {
      const dislikeButton = getDislikeButton();

      if (isShorts()) {
        const shortLikeButton = getLikeButton()?.querySelector(
          "tp-yt-paper-button#button",
        );
        const shortDislikeButton = dislikeButton?.querySelector(
          "tp-yt-paper-button#button",
        );

        if (shortLikeButton?.getAttribute("aria-pressed") === "true") {
          shortLikeButton.style.color = getColorFromTheme(true);
        }
        if (shortDislikeButton?.getAttribute("aria-pressed") === "true") {
          shortDislikeButton.style.color = getColorFromTheme(false);
        }

        const observer = getShortsObserver();
        if (observer) {
          observer.observe(shortLikeButton);
          observer.observe(shortDislikeButton);
        }
      } else {
        getLikeButton().style.color = getColorFromTheme(true);
        if (dislikeButton) dislikeButton.style.color = getColorFromTheme(false);
      }
    }
  } catch (err) {
    cLog(`Failed to fetch votes: ${  err}`);
  }
}
