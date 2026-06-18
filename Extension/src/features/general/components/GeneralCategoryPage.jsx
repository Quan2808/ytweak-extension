import TweakCategory from "@shared/components/TweakCategory";
import { categories } from "@features/index";
import { t } from "@shared/utils/i18n";

export default function GeneralCategoryPage({ enabledMap, onToggle, onBack }) {
  const category = categories.find((c) => c.id === "general");

  return (
    <TweakCategory
      title={t("category_general_label")}
      tweaks={category?.tweaks ?? []}
      enabledMap={enabledMap}
      onToggle={onToggle}
      onBack={onBack}
    ></TweakCategory>
  );
}
