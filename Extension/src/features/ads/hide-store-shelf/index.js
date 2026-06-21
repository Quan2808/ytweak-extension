import { addStyle, getElementById, removeElement } from "@shared/utils/dom";
import { t } from "@shared/utils/i18n";

const TWEAK_ID = "hide-store-shelf";

const cssContent = `
    #merch-shelf,
    #pla-shelf,
    ytd-product-details-renderer,
    ytd-merch-shelf-renderer,
    .ytd-merch-shelf-renderer  {
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
    return t("tweak_hideStoreShelf_name");
  },
  get description() {
    return t("tweak_hideStoreShelf_desc");
  },
  default: true,

  enable() {
    injectStyle();
  },
  disable() {
    removeStyle();
  },
};
