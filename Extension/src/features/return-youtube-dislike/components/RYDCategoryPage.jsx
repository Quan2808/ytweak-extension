import TweakCategory from "@shared/components/TweakCategory";
import { categories } from "@features/index";
import { t } from "@shared/utils/i18n";

/**
 * Category page cho nhóm Return YouTube Dislike.
 */
export default function RYDCategoryPage({ enabledMap, onToggle, onBack }) {
  const category = categories.find((c) => c.id === "returnYouTubeDislike");

  return (
    <TweakCategory
      title={t("category_returnYouTubeDislike_label")}
      tweaks={category?.tweaks ?? []}
      enabledMap={enabledMap}
      onToggle={onToggle}
      onBack={onBack}
    >
      {/* Custom UI cho RYD — thêm vào đây nếu cần */}
    </TweakCategory>
  );
}
