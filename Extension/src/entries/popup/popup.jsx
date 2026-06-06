import CssBaseline from "@mui/material/CssBaseline";

import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { I18nProvider } from "@shared/contexts/I18nContext";
import {
  AppThemeProvider,
  useThemeContext,
} from "@shared/contexts/ThemeContext";
import { storage } from "@shared/utils/storage";

import AppHeader from "@components/Header";
import TweakCategory from "@components/TweakCategory";
import TweakList from "@components/TweakList";

import "./popup.css";

import { allTweaks } from "@features/index";

// Theme
// function initEnabledMap() {
//   return Object.fromEntries(allTweaks.map((t) => [t.id, t.default ?? false]));
// }

function PopupContent() {
  const { mode, toggleTheme } = useThemeContext();

  const [currentView, setCurrentView] = useState("list");
  const [enabledMap, setEnabledMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Load settings
  useEffect(() => {
    storage.get(null).then((settings) => {
      const map = Object.fromEntries(
        allTweaks.map((t) => [
          t.id,
          settings[t.id] !== undefined ? settings[t.id] : (t.default ?? false),
        ]),
      );
      setEnabledMap(map);
      setLoaded(true);
    });
  }, []);

  const handleToggle = (tweakId) => {
    setEnabledMap((prev) => {
      const next = { ...prev, [tweakId]: !prev[tweakId] };
      storage.set({ [tweakId]: next[tweakId] });
      return next;
    });
  };

  if (!loaded) return null;

  return (
    <>
      <CssBaseline />
      <I18nProvider>
        <AppHeader currentMode={mode} onToggleTheme={toggleTheme} />
        {currentView === "list" ? (
          <TweakList onNavigate={setCurrentView} />
        ) : (
          <TweakCategory
            categoryId={currentView}
            enabledMap={enabledMap}
            onToggle={handleToggle}
            onBack={() => setCurrentView("list")}
          />
        )}
      </I18nProvider>
    </>
  );
}

export default function Popup() {
  return (
    <AppThemeProvider>
      <PopupContent />
    </AppThemeProvider>
  );
}

// Render
const container = document.getElementById("root");
if (!container._reactRoot) {
  container._reactRoot = createRoot(container);
}

container._reactRoot.render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
