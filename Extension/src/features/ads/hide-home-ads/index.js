import {
  addStyleAppendChild,
  getElementById,
  removeElement,
} from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "hide-home-ads";

const cssContent = `
    ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
    ytd-rich-item-renderer:has([ad-badge-view-model]),
    ytd-ad-slot-renderer {
        display: none !important;
    }

    #masthead-ad,
    ytd-banner-promo-renderer,
    ytd-rich-section-renderer:has(ytd-banner-promo-renderer) {
        display: none !important;
    }
  `;

function injectStyle() {
  if (getElementById(TWEAK_ID)) return;

  const style = document.createElement("style");
  style.id = `ytweak-${TWEAK_ID}`;
  style.className = "ytweak";
  style.textContent = cssContent;

  document.head.appendChild(style);
}

function removeStyle() {
  removeElement(`#${TWEAK_ID}`);
}

export default {
  id: TWEAK_ID,
  get name() {
    return t("tweak_hideHomeAds_name");
  },
  get description() {
    return t("tweak_hideHomeAds_desc");
  },
  default: true,

  enable() {
    injectStyle();
  },
  disable() {
    removeStyle();
  },
};
