import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Box, CssBaseline, Snackbar, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
      const targetTweak = allTweaks.find((t) => t.id === tweakId);
      const nextStatus = !prev[tweakId];
      const next = { ...prev, [tweakId]: nextStatus };

      storage.set({ [tweakId]: nextStatus });

      const actionText = nextStatus ? "Enabled" : "Disabled";
      const tweakName = targetTweak?.name || tweakId;
      setSnackbarMessage(
        `"${tweakName}" ${actionText}. Reload YouTube to apply?`,
      );
      setSnackbarOpen(true);

      return next;
    });
  };

  const handleReloadYouTube = () => {
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) chrome.tabs.reload(tab.id);
      });
    });
    setSnackbarOpen(false);
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

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          action={
            <>
              <Button
                color="secondary"
                size="small"
                onClick={handleReloadYouTube}
                sx={{ fontWeight: "bold", color: "#64b5f6" }}
              >
                RELOAD
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSnackbarOpen(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{
            bottom: 16,
            "& .MuiSnackbarContent-root": {
              backgroundColor: "#323232",
              color: "#ffffff",
              fontSize: "0.85rem",
            },
          }}
        />
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
