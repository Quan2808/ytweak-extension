import { t } from "@shared/utils/i18n";

const TWEAK_ID = "remove-playlist-from-home";
let observer = null;

function isHomePage() {
  return window.location.pathname === "/" || window.location.pathname === "";
}

function removePlaylists() {
  if (!isHomePage()) return;

  const items = document.querySelectorAll("ytd-rich-item-renderer");

  items.forEach((item) => {
    const isPlaylist =
      item.querySelector('a[href*="list="]') ||
      item.querySelector("ytd-thumbnail-overlay-bottom-panel-renderer") ||
      item.querySelector("ytd-playlist-thumbnail-renderer");

    if (isPlaylist && item.style.display !== "none") {
      item.style.display = "none";

      const titleEl = item.querySelector("#video-title");
      const title = titleEl
        ? titleEl.textContent.trim()
        : "Danh sách phát ẩn danh";
      console.log(
        `%c[Đã loại bỏ] ${title}`,
        "color: #888; text-decoration: line-through;",
      );
    }
  });
}

function cleanUp() {
  const items = document.querySelectorAll("ytd-rich-item-renderer");
  items.forEach((item) => {
    if (item.style.display === "none") {
      item.style.display = "";
    }
  });
}

export default {
  id: TWEAK_ID,
  get name() {
    return t("tweak_removePlaylistFromHome_name");
  },
  get description() {
    return t("tweak_removePlaylistFromHome_desc");
  },
  default: false,
  enable() {
    removePlaylists();

    observer = new MutationObserver(() => {
      removePlaylists();
    });

    const pageManager = document.querySelector("ytd-page-manager");
    if (pageManager) {
      observer.observe(pageManager, {
        childList: true,
        subtree: true,
      });
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  },
  disable() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    cleanUp();
  },
};
