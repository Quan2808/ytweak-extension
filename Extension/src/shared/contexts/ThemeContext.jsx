import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";

import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export function AppThemeProvider({ children }) {
  const preferDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Initialize from system preference; user can override with toggleTheme.
  const [manualMode, setManualMode] = useState(null);

  // Use manual override if set, otherwise follow system preference
  const mode = manualMode !== null ? manualMode : preferDarkMode;

  const toggleTheme = () => setManualMode((prev) => !(prev ?? preferDarkMode));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode ? "dark" : "light",
        },
        typography: {
          fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "::-webkit-scrollbar": {
                width: "10px",
                height: "10px",
              },
              "::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "::-webkit-scrollbar-corner": {
                background: "none",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: mode
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.2)",
                backgroundClip: "padding-box",
                border: "2px solid transparent",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
              },
              "::-webkit-scrollbar-thumb:hover": {
                backgroundColor: mode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.35)",
              },
              "::-webkit-scrollbar-thumb:active": {
                backgroundColor: mode
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.4)",
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
