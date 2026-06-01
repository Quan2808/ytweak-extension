const isChromeExtension =
  typeof chrome !== "undefined" && chrome.storage?.local;

function parseValue(val) {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

export const storage = {
  get(keys) {
    if (isChromeExtension) {
      return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
    }
    const result = {};
    const keyList = keys === null ? Object.keys(localStorage) : [keys].flat();
    keyList.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val !== null) result[k] = parseValue(val);
    });
    return Promise.resolve(result);
  },

  set(items) {
    if (isChromeExtension) {
      return new Promise((resolve) => chrome.storage.local.set(items, resolve));
    }
    Object.entries(items).forEach(([k, v]) => {
      localStorage.setItem(k, JSON.stringify(v));
    });
    return Promise.resolve();
  },
};
