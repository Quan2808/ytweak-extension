import { addStyle, getElementById, removeElement } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "hide-sidebar-ads";

const cssContent = `
    #related #player-ads,
    ytd-watch-next-secondary-results-renderer
        ytd-compact-promoted-video-renderer {
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
    return t("tweak_hideSidebarAds_name");
  },
  get description() {
    return t("tweak_hideSidebarAds_desc");
  },
  default: true,

  enable() {
    injectStyle();
  },
  disable() {
    removeStyle();
  },
};
