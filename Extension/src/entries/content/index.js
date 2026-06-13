import { allTweaks } from "@features/index";
import "@features/general/change-header-logo/style.css";

function initExtension() {
  chrome.storage.local.get(null, (settings) => {
    allTweaks.forEach((tweak) => {
      const isEnabled =
        settings[tweak.id] !== undefined ? settings[tweak.id] : tweak.default;

      if (isEnabled) {
        tweak.enable();
      } else {
        tweak.disable();
      }
    });
  });
}

initExtension();
