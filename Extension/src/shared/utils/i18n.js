const isChromeExtension =
  typeof chrome !== "undefined" && !!chrome.i18n?.getMessage;

let flatLocales = { en: {}, vi: {} };
let currentLang = "en";

if (import.meta.env.DEV) {
  const en = await import("@public/_locales/en/messages.json").then(
    (m) => m.default,
  );
  const vi = await import("@public/_locales/vi/messages.json").then(
    (m) => m.default,
  );

  const flatten = (messages) =>
    Object.fromEntries(
      Object.entries(messages).map(([k, v]) => [k, v.message]),
    );

  flatLocales = {
    en: flatten(en),
    vi: flatten(vi),
  };
}

export function initI18n(lang = "en") {
  currentLang = lang in flatLocales ? lang : "en";
}

export function setLang(lang) {
  currentLang = lang in flatLocales ? lang : "en";
}

export function getLang() {
  return currentLang;
}

export function t(key, ...substitutions) {
  if (isChromeExtension) {
    const chromeMsg = chrome.i18n.getMessage(key, substitutions.map(String));
    if (chromeMsg) return chromeMsg;
  }

  let msg = flatLocales[currentLang]?.[key] ?? flatLocales.en[key] ?? key;

  substitutions.forEach((sub, i) => {
    msg = msg.replace(`$${i + 1}`, String(sub));
  });

  return msg;
}
