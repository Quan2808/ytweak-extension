import { isShorts, cLog } from "./config.js";
import { getColorFromTheme } from "./format.js";

export function createObserver(options, callback) {
  const observerWrapper = new Object();
  observerWrapper.options = options;
  observerWrapper.observer = new MutationObserver(callback);
  observerWrapper.observe = function (element) {
    this.observer.observe(element, this.options);
  };
  observerWrapper.disconnect = function () {
    this.observer.disconnect();
  };
  return observerWrapper;
}

// Shorts observer — watches thumb button pressed state to apply colors
let shortsObserver = null;

export function getShortsObserver() {
  if (isShorts() && !shortsObserver) {
    cLog("Initializing shorts mutation observer");
    shortsObserver = createObserver(
      { attributes: true },
      (mutationList) => {
        mutationList.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.target.nodeName === "TP-YT-PAPER-BUTTON" &&
            mutation.target.id === "button"
          ) {
            cLog("Short thumb button status changed");
            if (mutation.target.getAttribute("aria-pressed") === "true") {
              mutation.target.style.color =
                mutation.target.parentElement.parentElement.id === "like-button"
                  ? getColorFromTheme(true)
                  : getColorFromTheme(false);
            } else {
              mutation.target.style.color = "unset";
            }
            return;
          }
          cLog(`Unexpected mutation observer event: ${  mutation.target  }${mutation.type}`);
        });
      },
    );
  }
  return shortsObserver;
}

export function resetShortsObserver() {
  shortsObserver = null;
}
