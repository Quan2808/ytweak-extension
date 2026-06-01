import { createContext, useContext, useState, useEffect } from "react";
import { storage } from "@shared/utils/storage";
import { initI18n, setLang } from "@shared/utils/i18n";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    storage.get("lang").then((stored) => {
      const saved = stored?.lang ?? "en";
      initI18n(saved);
      setLangState(saved);
      setReady(true);
    });
  }, []);

  async function changeLang(newLang) {
    if (newLang === lang) return;

    await storage.set({ lang: newLang });

    setLang(newLang);
    setLangState(newLang);

    window.location.reload();

    // if (typeof chrome !== "undefined" && chrome.runtime) {
    //   window.location.reload();
    // }
  }

  if (!ready) return null;

  return (
    <I18nContext.Provider value={{ lang, changeLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
