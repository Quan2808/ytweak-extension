import { t } from "@shared/utils/i18n";
import { updateButtonUI, injectYTWatchRightButton } from "@shared/utils/player";

let interval = null;

const ICON_NORMAL =
  "M18 11h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1m5 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2m-3 .02H4c-.55 0-1-.45-1-1V5.97c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.05c0 .55-.45 1-1 1";
const ICON_ACTIVE =
  "M18 7h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1m3-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2m-1 16.01H4c-.55 0-1-.45-1-1V5.98c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.03c0 .55-.45 1-1 1";

function togglePiP() {
  const video = document.querySelector("video");
  if (!video) return;
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch(() => {});
  } else {
    video.disablePictureInPicture = false;
    video.requestPictureInPicture().catch(() => {});
  }
}

function updateIconState() {
  const isActive = !!document.pictureInPictureElement;
  updateButtonUI("ytweak-pip", isActive, ICON_ACTIVE, ICON_NORMAL);
}

function injectButton() {
  injectYTWatchRightButton({
    id: "ytweak-pip",
    title: "Picture in Picture",
    titleActive: "Picture in Picture",
    titleInactive: "Picture in Picture",
    iconPath: ICON_NORMAL,
    onClick: togglePiP,
    onInject: (video) => {
      video.addEventListener("enterpictureinpicture", updateIconState);
      video.addEventListener("leavepictureinpicture", updateIconState);
      updateIconState();
    },
  });
}

function cleanup() {
  const video = document.querySelector("video");
  if (video) {
    video.removeEventListener("enterpictureinpicture", updateIconState);
    video.removeEventListener("leavepictureinpicture", updateIconState);
  }
  document.getElementById("ytweak-pip")?.remove();
}

export default {
  id: "pip-button",
  get name() {
    return t("tweak_pipButton_name");
  },
  get description() {
    return t("tweak_pipButton_desc");
  },
  default: false,
  enable() {
    if (interval) return;
    interval = setInterval(injectButton, 1000);
    injectButton();
  },
  disable() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    cleanup();
  },
};
