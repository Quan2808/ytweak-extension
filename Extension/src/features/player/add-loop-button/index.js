import { t } from "@shared/utils/i18n";
import { updateButtonUI, injectYTWatchRightButton } from "@shared/utils/player";

let interval = null;
let lastLoopState = null;

const ICON_NORMAL =
  "M7 7h10v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V5H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zm10 10H7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.31.31.85.09.85-.36V19h11c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1z";
const ICON_ACTIVE =
  "M7 7h10v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V5H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1zm10 10H7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.31.31.85.09.85-.36V19h11c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1zm-4-2.75V9.81c0-.45-.36-.81-.81-.81q-.195 0-.36.09l-1.49.74c-.21.1-.34.32-.34.55 0 .34.28.62.62.62h.88v3.25c0 .41.34.75.75.75s.75-.34.75-.75";

function toggleLoop() {
  const video = document.querySelector("video");
  if (!video) return;
  video.loop = !video.loop;
  updateIconState();
}

function updateIconState() {
  const video = document.querySelector("video");
  if (!video) return;
  const isActive = video.loop;
  if (isActive === lastLoopState) return;
  lastLoopState = isActive;
  updateButtonUI("ytweak-loop", isActive, ICON_ACTIVE, ICON_NORMAL);
}

function injectButton() {
  if (document.getElementById("ytweak-loop")) {
    updateIconState();
    return;
  }

  const video = document.querySelector("video");
  const currentIcon = video?.loop ? ICON_ACTIVE : ICON_NORMAL;

  injectYTWatchRightButton({
    id: "ytweak-loop",
    title: "Loop Video",
    titleActive: "Loop: On",
    titleInactive: "Loop: Off",
    iconPath: currentIcon,
    onClick: toggleLoop,
    onInject: (video) => {
      lastLoopState = video.loop;
    },
  });
}

function cleanup() {
  const video = document.querySelector("video");
  if (video) video.loop = false;
  document.getElementById("ytweak-loop")?.remove();
}

export default {
  id: "loop-button",
  get name() {
    return t("tweak_loopButton_name");
  },
  get description() {
    return t("tweak_loopButton_desc");
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
