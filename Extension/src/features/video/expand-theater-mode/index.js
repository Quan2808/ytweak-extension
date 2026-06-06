import { removeElement, addStyle } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n"; // Giả định hàm dịch thuật của bạn nằm ở đây

const THEATER_STYLE_ID = "ytweak-expand-theater-mode";

// Gộp chung các chuỗi CSS lại làm một cho gọn
const cssStyles = `
  ytd-watch-flexy[theater] #player-full-bleed-container.ytd-watch-flexy,
  ytd-watch-grid[theater] #player-full-bleed-container.ytd-watch-grid {
    height: 100vh !important;
    max-height: calc(100vh - 56px) !important;
  }
  ytd-watch-flexy[fullscreen] #player-full-bleed-container.ytd-watch-flexy,
  ytd-watch-grid[fullscreen] #player-full-bleed-container.ytd-watch-grid {
    max-height: 100vh !important;
    min-height: 100vh !important;
  }
  ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy,
  ytd-watch-grid[full-bleed-player] #full-bleed-container.ytd-watch-grid {
    block-size: fit-content !important;
    max-height: fit-content !important;
  }
`;

function injectTheaterStyle() {
  if (document.getElementById(THEATER_STYLE_ID)) return;
  addStyle(THEATER_STYLE_ID, cssStyles);
}

function removeTheaterStyle() {
  removeElement(`#${THEATER_STYLE_ID}`);
}

let observer = null;

export default {
  id: "expand-theater-mode",

  get name() {
    return t("tweak_expandTheaterMode_name");
  },

  get description() {
    return t("tweak_expandTheaterMode_desc");
  },

  default: false,

  enable() {
    observer = new MutationObserver(() => {
      injectTheaterStyle();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    injectTheaterStyle();
  },

  disable() {
    if (observer) {
      clearInterval(observer);
      observer = null;
    }
    removeTheaterStyle();
  },
};
