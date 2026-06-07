import { addStyle } from "@shared/utils/dom.js";

import { extConfig, isMobile } from "./config.js";
import { getButtons, getLikeButton, getDislikeButton } from "./dom.js";
import { getColorFromTheme } from "./format.js";

export const CSS = `
  #ytweak-ryd-bar-container {
    background: var(--yt-spec-icon-disabled);
    border-radius: 2px;
  }

  #ytweak-ryd-bar {
    background: var(--yt-spec-text-primary);
    border-radius: 2px;
    transition: all 0.15s ease-in-out;
  }

  .ryd-tooltip {
    position: absolute;
    display: block;
    height: 2px;
    bottom: -10px;
  }

  .ryd-tooltip-bar-container {
    width: 100%;
    height: 2px;
    position: absolute;
    padding-top: 6px;
    padding-bottom: 12px;
    top: -6px;
  }

  ytd-menu-renderer.ytd-watch-metadata {
    overflow-y: visible !important;
  }

  #top-level-buttons-computed {
    position: relative !important;
  }
`;

export function createRateBar(likes, dislikes) {
  if (isMobile || !extConfig.rateBarEnabled) return;

  const rateBar = document.getElementById("ytweak-ryd-bar-container");
  const buttons = getButtons();
  const widthPx =
    getLikeButton().clientWidth + (getDislikeButton()?.clientWidth ?? 52);
  const widthPercent =
    likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

  const likePercentage = parseFloat(widthPercent.toFixed(1)).toLocaleString();
  const dislikePercentage = (
    100 - parseFloat(widthPercent.toFixed(1))
  ).toLocaleString();

  let tooltipInnerHTML;
  switch (extConfig.tooltipPercentageMode) {
    case "dash_like":
      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
      break;
    case "dash_dislike":
      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
      break;
    case "both":
      tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
      break;
    case "only_like":
      tooltipInnerHTML = `${likePercentage}%`;
      break;
    case "only_dislike":
      tooltipInnerHTML = `${dislikePercentage}%`;
      break;
    default:
      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
  }

  if (!rateBar) {
    const colorDislikeStyle = extConfig.coloredBar
      ? `; background-color: ${getColorFromTheme(false)}`
      : "";
    const colorLikeStyle = extConfig.coloredBar
      ? `; background-color: ${getColorFromTheme(true)}`
      : "";

    buttons.insertAdjacentHTML(
      "beforeend",
      `<div class="ryd-tooltip" style="width: ${widthPx}px">
        <div class="ryd-tooltip-bar-container">
          <div id="ytweak-ryd-bar-container"
               style="width: 100%; height: 2px;${colorDislikeStyle}">
            <div id="ytweak-ryd-bar"
                 style="width: ${widthPercent}%; height: 100%${colorLikeStyle}">
            </div>
          </div>
        </div>
        <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip"
          class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
          <!--css-build:shady-->${tooltipInnerHTML}
        </tp-yt-paper-tooltip>
      </div>`,
    );

    const topRow = document.getElementById("top-row");
    if (topRow) {
      topRow.style.borderBottom = "1px solid var(--yt-spec-10-percent-layer)";
      topRow.style.paddingBottom = "10px";
    }
  } else {
    document.querySelector(".ryd-tooltip").style.width = `${widthPx}px`;
    document.getElementById("ytweak-ryd-bar").style.width = `${widthPercent}%`;

    if (extConfig.coloredBar) {
      document.getElementById(
        "ytweak-ryd-bar-container",
      ).style.backgroundColor = getColorFromTheme(false);
      document.getElementById("ytweak-ryd-bar").style.backgroundColor =
        getColorFromTheme(true);
    }
  }
}
