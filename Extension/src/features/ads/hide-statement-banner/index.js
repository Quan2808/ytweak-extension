import { addStyle, getElementById, removeElement } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "hide-statement-banner";

const cssContent = `
    ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
    ytd-statement-banner-renderer {
        display: none !important;
    }

    .style-scope.yt-mealbar-promo-renderer
    #main.yt-mealbar-promo-renderer,
    yt-mealbar-promo-renderer#mealbar-promo-renderer {
        display: none !important;
    }

    #player-ads,
    .ytp-ad-module,
    .ytp-ad-overlay-container,
    .ytp-ad-image-overlay,
    .ytp-ad-text-overlay,
    .video-ads.ytp-ad-module {
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
    return t("tweak_hideStatementBanner_name");
  },
  get description() {
    return t("tweak_hideStatementBanner_desc");
  },
  default: true,

  enable() {
    injectStyle();
  },
  disable() {
    removeStyle();
  },
};
