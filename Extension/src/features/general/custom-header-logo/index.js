import { t } from "@shared/utils/i18n";
import { logoMarkup } from "./headerLogo";
import "./style.css";

const adsSelector = [
  { parent: "ytd-rich-item-renderer", child: "ytd-ad-slot-renderer" },
  { parent: "ytd-rich-section-renderer" },
];

function loadLogo() {
  // Desktop
  if (document.getElementById("logo-icon")) {
    const logoIcons = document.querySelectorAll("#logo-icon");
    logoIcons.forEach(function (logoIcon) {
      // Tránh lặp lại nếu đã chèn rồi
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
    // Vì YouTube chuyển trang liên tục, cần lặp lại việc kiểm tra để thay logo
    if (!logoInterval) {
      logoInterval = setInterval(loadLogo, 500);
      loadLogo();
    }
  },

  disable() {
    if (logoInterval) {
      clearInterval(logoInterval);
      logoInterval = null;
    }
  },
};
