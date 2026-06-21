import { categories } from "@features/index";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import TweakCategory from "@shared/components/TweakCategory";
import { t } from "@shared/utils/i18n";

export default function RYDCategoryPage({ enabledMap, onToggle, onBack }) {
  const category = categories.find((c) => c.id === "ads");

  return (
    <TweakCategory
      title={t("category_ads_label")}
      tweaks={category?.tweaks ?? []}
      enabledMap={enabledMap}
      onToggle={onToggle}
      onBack={onBack}
    />
  );
}
