import { t } from "@shared/utils/i18n";
import { logoMarkup } from "./headerLogo";

function loadLogo() {
  // Desktop
  if (document.getElementById("logo-icon")) {
    const logoIcons = document.querySelectorAll("#logo-icon");
    logoIcons.forEach(function (logoIcon) {
      if (logoIcon.parentNode.querySelector("nice-logo")) return;

      logoIcon.insertAdjacentHTML("afterend", logoMarkup);
      logoIcon.remove();
    });
  } else {
    // Mobile
    const homeIcon = document.getElementsByTagName("ytm-home-logo")[0];
    if (homeIcon && homeIcon.style.display !== "none") {
      const newDiv = document.createElement("new-icon");
      newDiv.innerHTML = logoMarkup;
      homeIcon.parentNode.prepend(newDiv);
      homeIcon.style.display = "none";
    }
  }
}

let logoInterval = null;
let observer = null;

export default {
  id: "custom-header-logo",
  get name() {
    return t("tweak_customLogo_name");
  },
  get description() {
    return t("tweak_customLogo_desc");
  },
  default: true,

  enable() {
    // if (!logoInterval) {
    //   logoInterval = setInterval(loadLogo, 500);
    //   loadLogo();
    // }

    observer = new MutationObserver(() => {
      loadLogo();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    loadLogo();
  },

  disable() {
    // if (logoInterval) {
    //   clearInterval(logoInterval);
    //   logoInterval = null;
    // }

    if (observer) {
      clearInterval(observer);
      observer = null;
    }
  },
};
