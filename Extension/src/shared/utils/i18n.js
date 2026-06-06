const isChromeExtension =
  typeof chrome !== "undefined" && !!chrome.i18n?.getMessage;

const flatLocales = { en: {}, vi: {} };
let currentLang = "en";
let isReady = false;

// Hàm hỗ trợ làm phẳng JSON
const flatten = (messages) =>
  Object.fromEntries(Object.entries(messages).map(([k, v]) => [k, v.message]));

/**
 * Hàm khởi tạo i18n bất đồng bộ, nạp file ngôn ngữ khi cần
 */
export async function initI18n(lang = "en") {
  currentLang = lang;

  // Nếu chưa nạp dữ liệu cho ngôn ngữ này, tiến hành nạp dynamic
  if (
    !isReady ||
    !flatLocales[lang] ||
    Object.keys(flatLocales[lang]).length === 0
  ) {
    try {
      if (lang === "vi") {
        const viJson = await import("@public/_locales/vi/messages.json");
        flatLocales.vi = flatten(viJson.default);
      } else {
        const enJson = await import("@public/_locales/en/messages.json");
        flatLocales.en = flatten(enJson.default);
      }
    } catch (e) {
      console.error("Không thể nạp file ngôn ngữ:", e);
    }
  }
  isReady = true;
}

export async function setLang(lang) {
  await initI18n(lang);
}

export function getLang() {
  return currentLang;
}

export function t(key, ...substitutions) {
  const cleanKey = key.toLowerCase();

  let msg =
    flatLocales[currentLang]?.[cleanKey] ?? flatLocales[currentLang]?.[key];

  if (!msg && isChromeExtension) {
    const chromeMsg = chrome.i18n.getMessage(
      cleanKey,
      substitutions.map(String),
    );
    if (chromeMsg) return chromeMsg;

    return "";
  }

  if (!msg) {
    msg = flatLocales.en[cleanKey] ?? flatLocales.en[key] ?? key;
  }

  // Xử lý thay thế biến $1, $2...
  substitutions.forEach((sub, i) => {
    msg = msg.replace(`$${i + 1}`, String(sub));
  });

  return msg;
}
