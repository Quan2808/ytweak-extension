import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import manifestDataLocal from "@public/manifest.json";
import { t } from "@shared/utils/i18n";

import Subheader from "@shared/components/Subheader";
import BrandHeader from "./BrandHeader";
import IntroItem from "./IntroItem";

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
      <Subheader title={t("introduce_title")} onBack={onBack} />

      <Box sx={{ overflowY: "auto", height: "calc(100% - 57px)" }}>
        <List sx={{ paddingTop: 0 }}>
          <BrandHeader />
          <Divider sx={{ my: 1.5, mx: 2 }} />

          {introItems.map((item) => (
            <IntroItem key={item.id} item={item} />
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
