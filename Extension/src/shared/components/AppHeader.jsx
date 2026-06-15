import { Tooltip } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import { useI18n } from "@shared/contexts/I18nContext";
import { t } from "@shared/utils/i18n";

import LanguageSelector from "@components/header/SelectLocalization";

export default function AppHeader({ currentMode, onToggleTheme }) {
  useI18n();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ backgroundColor: currentMode ? "transparent" : "#FF0033" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'TWeak Logo', sans-serif !important",
              fontWeight: 700,
              fontSize: "1.75rem",
              letterSpacing: "-1.4px",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {t("appName")}
          </Typography>
          <div>
            <LanguageSelector />
            <Tooltip title={t("tooltip_github")} arrow>
              <IconButton
                aria-label="github repository"
                color="inherit"
                component="a"
                href={t("github_url")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                currentMode ? t("tooltip_theme_dark") : t("tooltip_theme_light")
              }
              arrow
            >
              <IconButton
                aria-label="themeToggle"
                onClick={onToggleTheme}
                color="inherit"
              >
                {currentMode ? (
                  <LightModeRoundedIcon />
                ) : (
                  <DarkModeRoundedIcon />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
