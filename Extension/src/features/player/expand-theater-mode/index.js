import { removeElement, addStyle } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const THEATER_STYLE_ID = "expand-theater-mode";

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

export default {
  id: THEATER_STYLE_ID,

  get name() {
    return t("tweak_expandTheaterMode_name");
  },

  get description() {
    return t("tweak_expandTheaterMode_desc");
  },

  default: false,

  enable() {
    injectTheaterStyle();
  },

  disable() {
    removeTheaterStyle();
  },
};
