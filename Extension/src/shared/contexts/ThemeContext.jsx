import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";

import { createContext, useContext, useState, useMemo, useEffect } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export function AppThemeProvider({ children }) {
  const preferDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(preferDarkMode);

  useEffect(() => {
    setMode(preferDarkMode);
  }, [preferDarkMode]);

  const toggleTheme = () => {
    setMode((prev) => !prev);
  };

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
