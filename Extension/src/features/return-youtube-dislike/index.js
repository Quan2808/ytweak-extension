import { t } from "@shared/utils/i18n";

import { setEventListeners, setupMobileHistoryPatch } from "./events.js";
import { CSS } from "./ratebar.js";
import { addStyle } from "@shared/utils/dom.js";

const TWEAK_ID = "ryd";

function injectCSS() {
  addStyle(TWEAK_ID, CSS);
}

export default {
  id: TWEAK_ID,

  get name() {
    return t("tweak_ryd_name");
  },

  get description() {
    return t("tweak_ryd_desc");
  },

  default: false,

  enable() {
    injectCSS();
    window.addEventListener("yt-navigate-finish", setEventListeners, true);
    setEventListeners();
    setupMobileHistoryPatch();
  },

  disable() {
    window.removeEventListener("yt-navigate-finish", setEventListeners, true);

    // Remove injected UI elements
    document
      .getElementById("ytweak-ryd-bar-container")
      ?.closest(".ytweak-ryd-tooltip")
      ?.remove();

    // Remove dislike text (revert to hidden state YouTube uses)
    const dislikeText = document.querySelector(
      "#segmented-dislike-button #text, dislike-button-view-model #text",
    );
    if (dislikeText) dislikeText.innerText = "";
  },
};
