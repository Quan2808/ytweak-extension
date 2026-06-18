import TweakCategory from "@shared/components/TweakCategory";
import { categories } from "@features/index";
import { t } from "@shared/utils/i18n";

export default function PlayerCategoryPage({ enabledMap, onToggle, onBack }) {
  const category = categories.find((c) => c.id === "player");

  return (
    <TweakCategory
      title={t("category_player_label")}
      tweaks={category?.tweaks ?? []}
      enabledMap={enabledMap}
      onToggle={onToggle}
      onBack={onBack}
    ></TweakCategory>
  );
}
