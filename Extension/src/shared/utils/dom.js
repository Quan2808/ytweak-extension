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
