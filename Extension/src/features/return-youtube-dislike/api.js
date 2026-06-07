import { extConfig, isMobile, isShorts, cLog } from "./config.js";
import {
  getVideoId,
  getLikeButton,
  getDislikeButton,
  getLikeTextContainer,
  getDislikeTextContainer,
} from "./dom.js";
import { numberFormat } from "./format.js";
import { createRateBar } from "./ratebar.js";
import { store } from "./store.js";

let abortController = null;

export function setLikes(likesCount) {
  if (isMobile) {
    const el = getLikeButton()?.querySelector(".button-renderer-text");
    if (el) el.innerText = likesCount;
    return;
  }
  const el = getLikeTextContainer();
  if (el) el.innerText = likesCount;
}

export function setDislikes(dislikesCount) {
  if (isMobile) {
    store.mobileDislikes = dislikesCount;
    return;
  }
  const container = getDislikeTextContainer();
  if (!container) return;
  container.removeAttribute("is-empty");
  if (container.innerText !== dislikesCount)
    container.innerText = dislikesCount;
}

export function getLikeCountFromButton() {
  try {
    if (isShorts()) return false;
    const btn =
      getLikeButton()?.querySelector("yt-formatted-string#text") ??
      getLikeButton()?.querySelector("button");
    const str = btn?.getAttribute("aria-label")?.replace(/\D/g, "");
    return str?.length > 0 ? parseInt(str, 10) : false;
  } catch {
    return false;
  }
}

export async function fetchAndSetVotes() {
  const videoId = getVideoId();
  if (!videoId) return;

  abortController?.abort();
  abortController = new AbortController();

  cLog(`Fetching votes for ${videoId}...`);

  try {
    const response = await fetch(
      `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`,
      { signal: abortController.signal },
    );
    const json = await response.json();
    if (!json || "traceId" in json) return;

    const { dislikes, likes } = json;
    cLog(`Received — likes: ${likes}, dislikes: ${dislikes}`);

    store.likesValue = likes;
    store.dislikesValue = dislikes;

    setDislikes(numberFormat(dislikes));
    createRateBar(likes, dislikes);

    if (extConfig.numberDisplayReformatLikes) {
      const nativeLikes = getLikeCountFromButton();
      if (nativeLikes !== false) setLikes(numberFormat(nativeLikes));
    }
  } catch (err) {
    if (err.name !== "AbortError") cLog("Failed to fetch votes: " + err);
  }
}
