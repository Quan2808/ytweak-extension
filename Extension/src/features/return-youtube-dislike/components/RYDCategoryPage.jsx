import { categories } from "@features/index";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import TweakCategory from "@shared/components/TweakCategory";
import { t } from "@shared/utils/i18n";

export default function RYDCategoryPage({ enabledMap, onToggle, onBack }) {
  const category = categories.find((c) => c.id === "returnYouTubeDislike");

  return (
    <TweakCategory
      title={t("category_returnYouTubeDislike_label")}
      tweaks={category?.tweaks ?? []}
      enabledMap={enabledMap}
      onToggle={onToggle}
      onBack={onBack}
      footer={
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://returnyoutubedislike.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ px: 2, py: 1.5 }}
            >
              <ListItemText
                primary={t("tweak_ryd_footer_name")}
                secondary={t("tweak_ryd_footer_desc")}
              />
            </ListItemButton>
          </ListItem>
        </List>
      }
    />
  );
}
