import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";

import { t } from "@shared/utils/i18n";
import manifestDataLocal from "@public/manifest.json";

export default function Introduce({ onBack }) {
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

  const subheader = (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        minHeight: 56,
      }}
    >
      <Box sx={{ minWidth: 40, display: "flex", alignItems: "center" }}>
        <IconButton onClick={onBack} size="small" sx={{ ml: -0.75 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
        {t("introduce_title")}
      </Typography>
    </ListItem>
  );

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
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav>
        <List dense subheader={subheader} sx={{ paddingTop: 0 }}>
          <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t("appName")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("intro_welcome_msg")}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {introItems.map((item) => (
            <ListItem key={item.id} sx={{ px: 2, py: 1 }}>
              {item.icon}
              <ListItemText
                id={item.id}
                primary={item.name}
                {...(item.description ? { secondary: item.description } : {})}
              />
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
}
