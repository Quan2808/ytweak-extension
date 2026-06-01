import en from "@public/_locales/en/messages.json";
import vi from "@public/_locales/vi/messages.json";

const isChromeExtension =
  typeof chrome !== "undefined" && !!chrome.i18n?.getMessage;

const locales = { en, vi };

function flatten(messages) {
  return Object.fromEntries(
    Object.entries(messages).map(([k, v]) => [k, v.message]),
  );
}

const flatLocales = {
  en: flatten(en),
  vi: flatten(vi),
};

let currentLang = "en";

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
  let msg = flatLocales[currentLang]?.[key] ?? flatLocales.en[key] ?? key;

  substitutions.forEach((sub, i) => {
    msg = msg.replace(`$${i + 1}`, String(sub));
  });

  if (isChromeExtension && msg === key && chrome.i18n.getMessage(key)) {
    return chrome.i18n.getMessage(key, substitutions.map(String));
  }

  return msg;
}
