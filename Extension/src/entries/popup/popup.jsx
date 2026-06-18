import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Box, CssBaseline } from "@mui/material";

import { I18nProvider } from "@shared/contexts/I18nContext";
import {
  AppThemeProvider,
  useThemeContext,
} from "@shared/contexts/ThemeContext";
import { storage } from "@shared/utils/storage";
import { allTweaks, categories } from "@features/index";

import AppHeader from "@shared/components/AppHeader";
import TweakList from "@components/TweakList";
import Introduce from "@shared/components/pages/Introduce";
import LicensePage from "@shared/components/pages/License";

import "./popup.css";

function PopupContent() {
  const { mode, toggleTheme } = useThemeContext();
  const [currentView, setCurrentView] = useState("list");
  const [enabledMap, setEnabledMap] = useState({});
  const [loaded, setLoaded] = useState(false);

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

  const renderView = () => {
    switch (currentView) {
      case "list":
        return <TweakList onNavigate={setCurrentView} />;

      case "introduce_page":
        return (
          <Introduce
            onBack={() => setCurrentView("list")}
            onNavigate={setCurrentView}
          />
        );

      case "license_page":
        return <LicensePage onBack={() => setCurrentView("introduce_page")} />;

      default: {
        const cat = categories.find((c) => c.id === currentView);
        const CategoryPage = cat?.component;

        if (!CategoryPage) return null;

        return (
          <CategoryPage
            enabledMap={enabledMap}
            onToggle={handleToggle}
            onBack={() => setCurrentView("list")}
          />
        );
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <I18nProvider>
        <AppHeader currentMode={mode} onToggleTheme={toggleTheme} />
        <Box
          sx={{
            height: "calc(400px - 56px)",
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {renderView()}
        </Box>
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

const container = document.getElementById("root");
if (!container._reactRoot) {
  container._reactRoot = createRoot(container);
}

container._reactRoot.render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
