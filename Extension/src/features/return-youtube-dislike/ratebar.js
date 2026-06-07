import { extConfig, isMobile } from "./config.js";
import { getButtons, getLikeButton, getDislikeButton } from "./dom.js";

const CSS = `
  #return-youtube-dislike-bar-container {
    background: var(--yt-spec-icon-disabled);
    border-radius: 2px;
  }
  #return-youtube-dislike-bar {
    background: var(--yt-spec-text-primary);
    border-radius: 2px;
    transition: width 0.15s ease-in-out;
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
  ytd-menu-renderer.ytd-watch-metadata { overflow-y: visible !important; }
  #top-level-buttons-computed { position: relative !important; }
`;

export function injectCSS() {
  const style = document.createElement("style");
  style.id = "ryd-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
  return style;
}

function buildTooltipHTML(likes, dislikes, widthPercent) {
  const likePct = parseFloat(widthPercent.toFixed(1)).toLocaleString();
  const dislikePct = (
    100 - parseFloat(widthPercent.toFixed(1))
  ).toLocaleString();
  switch (extConfig.tooltipPercentageMode) {
    case "dash_like":
      return `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePct}%`;
    case "dash_dislike":
      return `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePct}%`;
    case "both":
      return `${likePct}%&nbsp;/&nbsp;${dislikePct}%`;
    case "only_like":
      return `${likePct}%`;
    case "only_dislike":
      return `${dislikePct}%`;
    default:
      return `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
  }
}

export function createRateBar(likes, dislikes) {
  if (isMobile || !extConfig.rateBarEnabled) return;

  const widthPercent =
    likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

  const existing = document.getElementById(
    "return-youtube-dislike-bar-container",
  );
  if (existing) {
    const widthPx =
      getLikeButton().clientWidth + (getDislikeButton()?.clientWidth ?? 52);
    document.querySelector(".ryd-tooltip").style.width = widthPx + "px";
    document.getElementById("return-youtube-dislike-bar").style.width =
      widthPercent + "%";
    return;
  }

  const buttons = getButtons();
  if (!buttons) return;

  const widthPx =
    getLikeButton().clientWidth + (getDislikeButton()?.clientWidth ?? 52);
  const tooltipHTML = buildTooltipHTML(likes, dislikes, widthPercent);

  buttons.insertAdjacentHTML(
    "beforeend",
    `
    <div class="ryd-tooltip" style="width:${widthPx}px">
      <div class="ryd-tooltip-bar-container">
        <div id="return-youtube-dislike-bar-container" style="width:100%;height:2px">
          <div id="return-youtube-dislike-bar" style="width:${widthPercent}%;height:100%"></div>
        </div>
      </div>
      <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip"
        class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
        <!--css-build:shady-->${tooltipHTML}
      </tp-yt-paper-tooltip>
    </div>
  `,
  );

  const topRow = document.getElementById("top-row");
  if (topRow) {
    topRow.style.borderBottom = "1px solid var(--yt-spec-10-percent-layer)";
    topRow.style.paddingBottom = "10px";
  }
}
