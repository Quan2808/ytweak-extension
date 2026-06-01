import "../../tweaks/general/custom-header-logo/style.css";
import { allTweaks } from "../../tweaks";

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
