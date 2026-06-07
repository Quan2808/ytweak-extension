import { isMobile } from "./config.js";
import { getDislikeButton, getLikeButton } from "./dom.js";

export function isVideoLiked() {
  if (isMobile) {
    return (
      getLikeButton()?.querySelector("button")?.getAttribute("aria-label") ===
      "true"
    );
  }
  return getLikeButton()?.classList.contains("style-default-active") ?? false;
}

export function isVideoDisliked() {
  if (isMobile) {
    return (
      getDislikeButton()
        ?.querySelector("button")
        ?.getAttribute("aria-label") === "true"
    );
  }
  return (
    getDislikeButton()?.classList.contains("style-default-active") ?? false
  );
}

export function isVideoNotLiked() {
  if (isMobile) return !isVideoLiked();
  return getLikeButton()?.classList.contains("style-text") ?? false;
}

export function isVideoNotDisliked() {
  if (isMobile) return !isVideoDisliked();
  return getDislikeButton()?.classList.contains("style-text") ?? false;
}
