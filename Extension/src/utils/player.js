function showTooltip(btn) {
  let tip = document.getElementById("ytweak-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "ytweak-tooltip";

    Object.assign(tip.style, {
      position: "absolute",
      zIndex: "9999",

      backgroundColor: "rgba(28, 28, 28, 0.9)",
      color: "#f1f1f1",

      fontFamily: '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif',
      fontSize: "12px",
      fontWeight: "400",

      padding: "5px 9px",
      borderRadius: "5px",
      whiteSpace: "nowrap",
      lineHeight: "normal",

      opacity: "0",
      pointerEvents: "none",

      transform: "translateY(-6px)",
      transition:
        "opacity .1s cubic-bezier(.4, 0, 1, 1); transform .1s cubic-bezier(.4, 0, 1, 1)",
    });

    document.body.appendChild(tip);
  }

  const label =
    btn.getAttribute("data-tooltip-title") ||
    btn.getAttribute("aria-label") ||
    "";
  tip.textContent = label;
  tip.style.opacity = "0";
  tip.style.display = "block";

  const rect = btn.getBoundingClientRect();
  const tRect = tip.getBoundingClientRect();
  tip.style.left = `${rect.left + rect.width / 2 - tRect.width / 2}px`;
  tip.style.top = `${rect.top - tRect.height - 6}px`;
  tip.style.opacity = "1";
}

function hideTooltip() {
  const tip = document.getElementById("ytweak-tooltip");
  if (tip) tip.style.display = "none";
}

function createSVGButton(iconPath) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "white");
  svg.setAttribute("height", "24");
  svg.setAttribute("width", "24");
  svg.style.pointerEvents = "none";

  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", iconPath);
  svg.appendChild(path);
  return svg;
}

export function updateButtonUI(containerId, isActive, iconActive, iconNormal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.classList.toggle("ytweak-active", isActive);

  const pathEl = container.querySelector("svg path");
  if (pathEl) {
    pathEl.setAttribute("d", isActive ? iconActive : iconNormal);
  }

  const tipActive = container.dataset.tooltipActive;
  const tipInactive = container.dataset.tooltipInactive;
  if (tipActive && tipInactive) {
    const label = isActive ? tipActive : tipInactive;
    container.setAttribute("data-tooltip-title", label);
    container.setAttribute("data-title-no-tooltip", label);
    container.setAttribute("aria-label", label);
  }
}

export function injectYTWatchRightButton({
  id,
  title,
  titleActive,
  titleInactive,
  iconPath,
  onClick,
  onInject,
}) {
  if (document.getElementById(id)) return;

  const rightControls =
    document.querySelector(".ytp-right-controls-right") ||
    document.querySelector(".ytp-right-controls");
  const video = document.querySelector("video");
  if (!rightControls || !video) return;

  const btn = document.createElement("button");
  btn.id = id;
  btn.className = `ytp-button ${id}-button`;

  btn.setAttribute("data-tooltip-title", title);
  btn.setAttribute("data-title-no-tooltip", title);
  btn.setAttribute("aria-label", title);
  btn.title = "";

  if (titleActive && titleInactive) {
    btn.dataset.tooltipActive = titleActive;
    btn.dataset.tooltipInactive = titleInactive;
  }

  btn.appendChild(createSVGButton(iconPath));

  btn.addEventListener("click", onClick);

  btn.addEventListener("mouseenter", () => showTooltip(btn));
  btn.addEventListener("mouseleave", hideTooltip);
  btn.addEventListener("click", hideTooltip);

  const fullscreenBtn = rightControls.querySelector(".ytp-fullscreen-button");
  rightControls.insertBefore(btn, fullscreenBtn);

  if (typeof onInject === "function") onInject(video);
}
