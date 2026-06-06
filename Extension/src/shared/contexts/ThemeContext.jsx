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
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
