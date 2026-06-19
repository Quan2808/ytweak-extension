import { t } from "@shared/utils/i18n";

const TWEAK_ID = "grid-resizer";

const VIDEO_COLS = 5;
const SHORTS_COLS = Math.max(5, Math.round(5 * (VIDEO_COLS / 3)));

const STYLE_ID = "ytd-grid-resizer-style";
let observer = null;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;

  const videoWidth = `calc(${100 / VIDEO_COLS}% - var(--ytd-rich-grid-item-margin, 16px))`;
  const shortsWidth = `calc(${100 / SHORTS_COLS}% - var(--ytd-rich-grid-item-margin, 16px))`;

  const css = `
    /* Video grid items */
    ytd-rich-grid-renderer ytd-rich-item-renderer {
      width: ${videoWidth} !important;
      min-width: unset !important;
      max-width: unset !important;
    }

    /* Video shelf items */
    ytd-rich-shelf-renderer:not([is-shorts]) ytd-rich-item-renderer {
      width: ${videoWidth} !important;
      min-width: unset !important;
      max-width: unset !important;
    }

    /* Shorts shelf items */
    ytd-rich-shelf-renderer[is-shorts] ytd-rich-item-renderer {
      width: ${shortsWidth} !important;
      min-width: unset !important;
      max-width: unset !important;
    }

    /* Shorts thumbnail container */
    ytd-rich-shelf-renderer[is-shorts] .shortsLockupViewModelHostThumbnailParentContainer {
      width: 100% !important;
    }

    /* Shelf contents wrap */
    ytd-rich-shelf-renderer #contents {
      flex-wrap: wrap !important;
      height: auto !important;
      overflow: visible !important;
      transform: none !important;
    }
  `;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

function applyColumns() {
  // ── Normal Grid ──
  document.documentElement.style.setProperty(
    "--ytd-rich-grid-items-per-row",
    VIDEO_COLS,
    "important",
  );
  document.querySelectorAll("ytd-rich-grid-renderer").forEach((el) => {
    el.style.setProperty(
      "--ytd-rich-grid-items-per-row",
      VIDEO_COLS,
      "important",
    );
  });

  // ── Shelf renderer ──
  document.querySelectorAll("ytd-rich-shelf-renderer").forEach((shelf) => {
    const isShorts = shelf.hasAttribute("is-shorts");
    const cols = isShorts ? SHORTS_COLS : VIDEO_COLS;

    shelf.style.setProperty("--ytd-rich-grid-items-per-row", cols, "important");

    const contents = shelf.querySelector("#contents");
    if (contents) {
      contents.style.setProperty("height", "auto", "important");
      contents.style.setProperty("overflow", "visible", "important");
      contents.style.setProperty("transform", "none", "important");
      contents.style.setProperty("display", "flex", "important");
      contents.style.setProperty("flex-wrap", "wrap", "important");
    }

    shelf.querySelectorAll("ytd-rich-item-renderer").forEach((el) => {
      el.style.setProperty("--ytd-rich-grid-items-per-row", cols, "important");
    });
  });
}

function removeColumns() {
  document.documentElement.style.removeProperty("--ytd-rich-grid-items-per-row");

  document.querySelectorAll("ytd-rich-grid-renderer").forEach((el) => {
    el.style.removeProperty("--ytd-rich-grid-items-per-row");
  });

  document.querySelectorAll("ytd-rich-shelf-renderer").forEach((shelf) => {
    shelf.style.removeProperty("--ytd-rich-grid-items-per-row");

    const contents = shelf.querySelector("#contents");
    if (contents) {
      contents.style.removeProperty("height");
      contents.style.removeProperty("overflow");
      contents.style.removeProperty("transform");
      contents.style.removeProperty("display");
      contents.style.removeProperty("flex-wrap");
    }

    shelf.querySelectorAll("ytd-rich-item-renderer").forEach((el) => {
      el.style.removeProperty("--ytd-rich-grid-items-per-row");
    });
  });
}

export default {
  id: TWEAK_ID,
  get name() {
    return t("tweak_gridResizer_name");
  },
  get description() {
    return t("tweak_gridResizer_desc");
  },
  default: false,
  enable() {
    injectStyle();
    applyColumns();

    observer = new MutationObserver(applyColumns);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyColumns);
    }

    window.addEventListener("load", applyColumns);
  },
  disable() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    window.removeEventListener("load", applyColumns);
    removeColumns();
    removeStyle();

    console.log(`[YTweak] Disabled: ${TWEAK_ID}`);
  },
};