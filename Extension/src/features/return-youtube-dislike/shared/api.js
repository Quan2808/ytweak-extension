import { extConfig, isMobile, isShorts, cLog } from "../shared/config.js";
import { numberFormat } from "../shared/format.js";
import { createRateBar } from "../ryd/ratebar.js";
import { store } from "./store.js";
import {
  getVideoId,
  getLikeButton,
  getLikeTextContainer,
  getDislikeTextContainer,
} from "./dom.js";

let abortController = null;

// ─── Set Text Helpers ────────────────────────────────────────────────────────
export function setLikes(likesCount) {
  if (isMobile) {
    const el = getLikeButton()?.querySelector(".button-renderer-text");
    if (el) el.innerText = likesCount;
    return;
  }
  const el = getLikeTextContainer();
  if (el) {
    if (isShorts()) {
      if (el.textContent !== likesCount) el.textContent = likesCount;
    } else {
      if (el.innerText !== likesCount) el.innerText = likesCount;
    }
  }
}

export function setDislikes(dislikesCount) {
  if (isMobile) {
    store.mobileDislikes = dislikesCount;
    return;
  }
  const container = getDislikeTextContainer();
  if (!container) return;

  if (isShorts()) {
    if (container.textContent !== dislikesCount)
      container.textContent = dislikesCount;
  } else {
    container.removeAttribute("is-empty");
    if (container.innerText !== dislikesCount)
      container.innerText = dislikesCount;
  }
}

// ─── Get Native Like Count ───────────────────────────────────────────────────
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

// ─── Core API Fetch ──────────────────────────────────────────────────────────
export async function fetchAndSetVotes() {
  const videoId = getVideoId();
  if (!videoId) return;

  abortController?.abort();
  abortController = new AbortController();

  const prefix = isShorts() ? "[Shorts] " : "";
  cLog(`${prefix}Fetching votes for ${videoId}...`);

  try {
    const response = await fetch(
      `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`,
      { signal: abortController.signal },
    );
    const json = await response.json();
    if (!json || "traceId" in json) return;

    const { dislikes, likes } = json;
    cLog(`${prefix}Received — likes: ${likes}, dislikes: ${dislikes}`);

    store.likesValue = likes;
    store.dislikesValue = dislikes;

    setDislikes(numberFormat(dislikes));

    if (!isShorts()) {
      createRateBar(likes, dislikes);

      if (extConfig.numberDisplayReformatLikes) {
        const nativeLikes = getLikeCountFromButton();
        if (nativeLikes !== false) setLikes(numberFormat(nativeLikes));
      }
    }
  } catch (err) {
    if (err.name !== "AbortError")
      cLog(`${prefix}Failed to fetch votes: ${err}`);
  }
}
