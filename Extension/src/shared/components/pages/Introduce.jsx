import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper"; // ← Thêm

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import manifestDataLocal from "@public/manifest.json";
import { t } from "@shared/utils/i18n";
import { ListItemButton, ListItemIcon } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function Introduce({ onBack, onNavigate }) {
  const getManifest = () => {
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.getManifest
    ) {
      return chrome.runtime.getManifest();
    }
    return manifestDataLocal;
  };

  const manifestData = getManifest();
  const extensionVersion = manifestData.version;

  const introItems = [
    {
      id: "version",
      name: t("intro_version_name"),
      description: `v${extensionVersion}`,
      icon: <InfoOutlinedIcon sx={{ color: "text.secondary", mr: 1 }} />,
    },
    {
      id: "author",
      name: t("intro_developer_name"),
      description: t("intro_developer_desc"),
      icon: <CodeRoundedIcon sx={{ color: "text.secondary", mr: 1 }} />,
    },
    {
      id: "about",
      name: t("intro_about_name"),
      description: t("appDescription"),
      icon: null,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
          bgcolor: "background.paper",
        }}
      >
        <List sx={{ paddingTop: 0, pb: 0 }}>
          <ListItem
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              minHeight: 56,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ minWidth: 40, display: "flex", alignItems: "center" }}>
              <IconButton onClick={onBack} size="small" sx={{ ml: -0.75 }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: 500 }}
            >
              {t("introduce_title")}
            </Typography>
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ overflowY: "auto", height: "calc(100% - 56px)" }}>
        <List sx={{ paddingTop: 0 }}>
          <Box
            sx={{
              px: 2,
              pt: 3,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="img"
              src="assets/icons/logo-transparent.png"
              loading="lazy"
              sx={{
                height: 120,
                width: "auto",
                objectFit: "contain",
                mb: 0.5,
              }}
            />
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
          </Box>

          <Divider sx={{ my: 1.5, mx: 2 }} />

          {introItems.map((item) => (
            <ListItem key={item.id} sx={{ px: 2, py: 0.85 }}>
              {item.icon}
              <ListItemText
                id={item.id}
                primary={item.name}
                {...(item.description ? { secondary: item.description } : {})}
              />
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => onNavigate("license_page")}
              sx={{ px: 2, py: 1.5 }}
            >
              <ListItemText primary={t("license_title")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
