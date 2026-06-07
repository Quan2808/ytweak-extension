import { t } from "@shared/utils/i18n";
import { injectCSS } from "./ratebar.js";
import {
  onNavigate,
  setupMobileHistoryPatch,
  teardownMobileHistoryPatch,
} from "./events.js";
import { store } from "./store.js";

const TWEAK_ID = "return-youtube-dislike";

let styleEl = null;

export default {
  id: TWEAK_ID,

  get name() {
    return t("tweak_name");
  },

  get description() {
    return t("tweak_desc");
  },

  default: false,

  enable() {
    styleEl = injectCSS();
    window.addEventListener("yt-navigate-finish", onNavigate, true);
    setupMobileHistoryPatch();
    // Run immediately for the current page
    onNavigate();
  },

  disable() {
    window.removeEventListener("yt-navigate-finish", onNavigate, true);
    teardownMobileHistoryPatch();

    // Remove ratio bar
    document.querySelector(".ryd-tooltip")?.remove();

    // Remove injected stylesheet
    styleEl?.remove();
    styleEl = null;

    // Clear store
    store.reset();
    store.currentVideoId = null;
  },
};
