import { addStyle, getElementById, removeElement } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "hide-player-ads";

const cssContent = `
   #player-ads,
    .video-ads.ytp-ad-module,
    .ytp-ad-module,
    .ytp-ad-overlay-container,
    .ytp-ad-image-overlay,
    .ytp-ad-text-overlay,
    .ytp-ad-progress-list,
    .ytp-ad-skip-button-container {
        display: none !important;
    }
  `;

function injectStyle() {
  if (getElementById(TWEAK_ID)) return;
  addStyle(TWEAK_ID, cssContent);
}

function removeStyle() {
  removeElement(`#${TWEAK_ID}`);
}

export default {
  id: TWEAK_ID,
  get name() {
    return t("tweak_hidePlayerAds_name");
  },
  get description() {
    return t("tweak_hidePlayerAds_desc");
  },
  default: true,

  enable() {
    injectStyle();
  },
  disable() {
    removeStyle();
  },
};
