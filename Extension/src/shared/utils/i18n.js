import enRaw from "@public/_locales/en/messages.json";
import viRaw from "@public/_locales/vi/messages.json";

const isChromeExtension =
  typeof chrome !== "undefined" && !!chrome.i18n?.getMessage;

const flatten = (messages) =>
  Object.fromEntries(Object.entries(messages).map(([k, v]) => [k, v.message]));

const flatLocales = {
  en: flatten(enRaw),
  vi: flatten(viRaw),
};

let currentLang = "en";

export async function initI18n(lang = "en") {
  currentLang = lang;
}

export async function setLang(lang) {
  currentLang = lang;
}

export function getLang() {
  return currentLang;
}

export function t(key, ...substitutions) {
  const cleanKey = key.toLowerCase();

  let msg =
    flatLocales[currentLang]?.[cleanKey] ??
    flatLocales[currentLang]?.[key] ??
    flatLocales.en?.[cleanKey] ??
    flatLocales.en?.[key];

  if (!msg && isChromeExtension) {
    const chromeMsg = chrome.i18n.getMessage(
      cleanKey,
      substitutions.map(String),
    );
    if (chromeMsg) return chromeMsg;
    return "";
  }

  if (!msg) return key;

  substitutions.forEach((sub, i) => {
    msg = msg.replace(`$${i + 1}`, String(sub));
  });

  return msg;
}
