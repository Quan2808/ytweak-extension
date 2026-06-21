import { t } from "@shared/utils/i18n";
import { fixMissalignedVideos } from "../utils/fixMissalignedVideos";

const TWEAK_ID = "grid-resizer";
const STYLE_ID = "ytd-grid-resizer-style";

const CONFIG = {
  video: { max: 4, min: 270, cssVar: "--videosPerRow" },
  short: { max: 12, min: 170, cssVar: "--shortsPerRow" },
  post: { max: 4, min: 326, cssVar: null },
};

let resizeObserver = null;
let domObserver = null;
let observedSet = new WeakSet();

function calcItemsPerRow(containerWidth, type) {
  const { max, min } = CONFIG[type];
  for (let i = max; i > 0; i--) {
    if (containerWidth / i >= min) return i;
  }
  return 1;
}

function updateElementsPerRow(element, type) {
  const width =
    element.offsetWidth ||
    element.closest(
      "ytd-chips-shelf-with-video-shelf-renderer, #contents, #primary, ytd-page-manager",
    )?.clientWidth ||
    document.documentElement.clientWidth;

  if (!width) return;

  const items = calcItemsPerRow(width, type);
  const { cssVar } = CONFIG[type];

  if (cssVar) document.documentElement.style.setProperty(cssVar, items);

  requestAnimationFrame(() => {
    element.style.setProperty(
      "--ytd-rich-grid-items-per-row",
      items,
      "important",
    );

    if (element.tagName === "YTD-RICH-SHELF-RENDERER") {
      element.setAttribute("elements-per-row", items);

      const totalItems = element.querySelectorAll(
        "ytd-rich-item-renderer",
      ).length;
      if (totalItems > 0) {
        element.style.setProperty(
          "--ytd-rich-shelf-items-count",
          totalItems,
          "important",
        );
      }

      element.removeAttribute("restrict-contents-overflow");
      element.removeAttribute("has-expansion-button");

      element.querySelectorAll(".button-container").forEach((btn) => {
        btn.style.setProperty("display", "none", "important");
      });
    }

    if (element.tagName === "YTD-RICH-GRID-RENDERER") {
      element.setAttribute("items-per-row", items);
    }
  });
}

function getGridType(element) {
  const tag = element.tagName;

  if (tag === "YTD-RICH-SHELF-RENDERER") {
    if (
      element.hasAttribute("is-shorts") ||
      element.hasAttribute("is-slim-media-shelf-renderer") ||
      element.hasAttribute("slim-items-per-row") ||
      element.querySelector(
        "ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model, " +
          "ytd-slim-video-metadata-renderer, [slim-items-per-row-value]",
      )
    ) {
      return "short";
    }

    if (
      element.querySelector(
        "ytd-post-renderer, ytd-backstage-post-thread-renderer",
      )
    ) {
      return "post";
    }

    return "video";
  }

  if (
    tag === "YTD-RICH-GRID-RENDERER" &&
    element.hasAttribute("is-shorts-grid")
  ) {
    return "short";
  }

  return "video";
}

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;

  const { video, short } = CONFIG;

  const css = `
  /* Video grid */
  ytd-rich-grid-renderer:not([is-shorts-grid]) {
    --ytd-rich-grid-items-per-row: var(--videosPerRow, ${video.max}) !important;
  }

  /* Shorts grid — channel Shorts tab */
  ytd-rich-grid-renderer[is-shorts-grid] {
    --ytd-rich-grid-items-per-row: var(--shortsPerRow, ${short.max}) !important;
  }

  /* Video shelf */
  ytd-rich-shelf-renderer:not([is-shorts]):not([is-slim-media-shelf-renderer]):not([slim-items-per-row]) {
    --ytd-rich-grid-items-per-row: var(--videosPerRow, ${video.max}) !important;
  }

  /* Shorts shelf */
  ytd-rich-shelf-renderer[is-shorts],
  ytd-rich-shelf-renderer[is-slim-media-shelf-renderer],
  ytd-rich-shelf-renderer[slim-items-per-row] {
    --ytd-rich-grid-items-per-row: var(--shortsPerRow, ${short.max}) !important;
  }

  ytd-rich-shelf-renderer #contents-container,
  ytd-rich-shelf-renderer #contents {
    max-height: none !important;
    overflow: visible !important;
  }

  ytd-rich-grid-media[mini-mode] {
    max-width: initial;
  }

  /* Channel Videos tab */
  ytd-two-column-browse-results-renderer[page-subtype=channels]:has(ytd-rich-grid-renderer:not([is-shorts-grid])) {
    width: calc(100% - 32px) !important;
    max-width: calc(
      var(--videosPerRow, ${video.max}) *
      (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin))
    ) !important;
  }

  /* Channel Shorts tab */
  ytd-two-column-browse-results-renderer[page-subtype=channels]:has(ytd-rich-grid-renderer[is-shorts-grid]) {
    width: calc(100% - 32px) !important;
    max-width: calc(
      var(--shortsPerRow, ${short.max}) *
      (var(--ytd-rich-grid-slim-item-max-width) + var(--ytd-rich-grid-shorts-item-margin))
    ) !important;
  }

  /* Homepage skeleton */
  #home-page-skeleton .rich-grid-media-skeleton {
    min-width: ${video.min - 16}px !important;
    flex-basis: ${video.min - 16}px !important;
  }

  /* Watch page — related videos dưới player */
  ytd-item-section-renderer[lockup-container-type="2"] #contents.ytd-item-section-renderer {
    grid-template-columns: repeat(
      auto-fill,
      minmax(
        max(${video.min - 16}px, calc((100% / ${video.max}) - 16px)),
        1fr
      )
    );
  }
  `;

  // Main style
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);

  // Fix misalignment style
  const fixStyle = document.createElement("style");
  fixStyle.id = "fixMissalignedVideos";
  fixStyle.textContent = fixMissalignedVideos();
  document.head.appendChild(fixStyle);
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

function scanAndObserveGrids() {
  document
    .querySelectorAll("ytd-rich-grid-renderer, ytd-rich-shelf-renderer")
    .forEach((grid) => {
      if (observedSet.has(grid)) return;
      observedSet.add(grid);
      resizeObserver?.observe(grid);

      const type = getGridType(grid);
      updateElementsPerRow(grid, type);
    });
}

function removeColumns() {
  document.documentElement.style.removeProperty("--videosPerRow");
  document.documentElement.style.removeProperty("--shortsPerRow");

  document
    .querySelectorAll("ytd-rich-grid-renderer, ytd-rich-shelf-renderer")
    .forEach((grid) => {
      grid.style.removeProperty("--ytd-rich-grid-items-per-row");
      grid.style.removeProperty("--ytd-rich-shelf-items-count");

      if (grid.tagName === "YTD-RICH-GRID-RENDERER") {
        grid.removeAttribute("items-per-row");
      }

      grid.querySelectorAll?.(".button-container").forEach((btn) => {
        btn.style.removeProperty("display");
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
    observedSet = new WeakSet();
    injectStyle();

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        updateElementsPerRow(el, getGridType(el));
      }
    });

    scanAndObserveGrids();

    let mutationTimer = null;
    domObserver = new MutationObserver(() => {
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(scanAndObserveGrids, 200);
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  },

  disable() {
    domObserver?.disconnect();
    domObserver = null;

    resizeObserver?.disconnect();
    resizeObserver = null;

    removeColumns();
    removeStyle();
  },
};
