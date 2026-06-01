import { t } from "@shared/utils/i18n";

let observer = null;
let rafId = null;

function removePremiumQualityItems() {
  document
    .querySelectorAll(".ytp-quality-menu .ytp-premium-label")
    .forEach((label) => {
      label.closest(".ytp-menuitem")?.remove();
    });

  document
    .querySelectorAll(".ytp-quality-menu .ytp-menuitem-label")
    .forEach((label) => {
      if (label.textContent.trim().toLowerCase().includes("premium")) {
        label.closest(".ytp-menuitem")?.remove();
      }
    });
}

function scheduleClean() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    removePremiumQualityItems();
    rafId = null;
  });
}

export default {
  id: "hide-premium-quality",
  get name() {
    return t("tweak_hidePremiumVideoQualityTitle_name");
  },
  get description() {
    return t("tweak_hidePremiumVideoQualityTitle_desc");
  },
  default: true,

  enable() {
    if (observer) return;

    observer = new MutationObserver(scheduleClean);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    scheduleClean();
  },

  disable() {
    observer?.disconnect();
    observer = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  },
};
