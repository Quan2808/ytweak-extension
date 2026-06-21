import { t } from "@shared/utils/i18n";
import {
  onNavigate,
  onVisibilityChange,
  setupMobileHistoryPatch,
  teardownMobileHistoryPatch,
} from "../shared/event";
import { injectCSS } from "./ratebar";
import { store } from "../shared/store";
import { extConfig, isMobile, isShorts, cLog } from "../shared/config.js";

let styleEl = null;

export default {
  id: "return-youtube-dislike",

  get name() {
    return t("tweak_ryd_name");
  },

  get description() {
    return t("tweak_ryd_desc");
  },

  default: true,

  enable() {
    styleEl = injectCSS();
    window.addEventListener("yt-navigate-finish", onNavigate, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    setupMobileHistoryPatch();
    onNavigate();
  },

  disable() {
    window.removeEventListener("yt-navigate-finish", onNavigate, true);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    teardownMobileHistoryPatch();
    document.querySelector(".ryd-tooltip")?.remove();
    styleEl?.remove();
    styleEl = null;
    store.reset();
    store.currentVideoId = null;
  },
};
