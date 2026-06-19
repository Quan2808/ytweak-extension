export const getSelector = (e) => {
  return document.querySelector(e);
};

export const getElementById = (e) => {
  return document.getElementById(e);
};

export function getVideoId() {
  const { pathname, searchParams } = new URL(window.location.href);
  if (pathname.startsWith("/clip")) {
    return (
      document.querySelector("meta[itemprop='videoId']") ??
      document.querySelector("meta[itemprop='identifier']")
    )?.content;
  }
  if (pathname.startsWith("/shorts")) return pathname.slice(8);
  return searchParams.get("v");
}

export const removeElementById = (id) => {
  const element = document.getElementById(id);
  element && element.remove();
};

export const removeElement = (selector) => {
  const element = document.querySelector(selector);
  element && element.remove();
};

export const addStyle = (id, css) => {
  removeElementById(id);

  const style = document.createElement("style");
  style.id = `ytweak-${id}`;
  style.className = "ytweak";
  style.textContent = css;

  if (document.head) {
    document.head.append(style);
  } else {
    document.documentElement.append(style);
  }
};

let videoTimeoutMap = new Map();

export function watchVideoReady(id, callback) {
  if (videoTimeoutMap.has(id)) {
    clearTimeout(videoTimeoutMap.get(id));
    videoTimeoutMap.delete(id);
  }

  if (!location.pathname.startsWith("/watch")) return;

  if (document.querySelector("video")) {
    callback();
    return;
  }

  let attempts = 0;
  const check = () => {
    attempts++;
    if (document.querySelector("video")) {
      callback();
      videoTimeoutMap.delete(id);
    } else if (attempts < 30) {
      const timeout = setTimeout(check, 100);
      videoTimeoutMap.set(id, timeout);
    } else {
      videoTimeoutMap.delete(id);
    }
  };

  const timeout = setTimeout(check, 100);
  videoTimeoutMap.set(id, timeout);
}

export function clearVideoWatcher(id) {
  if (videoTimeoutMap.has(id)) {
    clearTimeout(videoTimeoutMap.get(id));
    videoTimeoutMap.delete(id);
  }
}
