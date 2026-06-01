import { t } from "@shared/utils/i18n";
// import tweakExample from "@features/tweak-example";
import customHeaderLogo from "@features/general/custom-header-logo";
import linkSanitizer from "@features/general/link-sanitizer";
import hidePremiumVideoQualityTitle from "@features/video/hide-premium-video-quality-title";
import addPipButton from "@features/player/add-pip-button";
import addLoopButton from "@features/player/add-loop-button";

export const categories = [
  // Add new category here:
  // {
  //   id: "category-id",
  //   label: "category-label",
  //   icon: "category-icon (use MUI icon)",
  //   tweaks: [tweakExample],
  // },
  {
    id: "general",
    get label() {
      return t("category_general_label");
    },
    icon: "SettingsOutlined",
    tweaks: [customHeaderLogo, linkSanitizer],
  },
  {
    id: "video",
    get label() {
      return t("category_video_label");
    },
    icon: "VideoSettings",
    tweaks: [hidePremiumVideoQualityTitle],
  },
  {
    id: "player",
    get label() {
      return t("category_player_label");
    },
    icon: "PlayArrowOutlined",
    tweaks: [addPipButton, addLoopButton],
  },
  {
    id: "test",
    get label() {
      return t("category_comingSoon_label");
    },
    icon: "SettingsOutlined",
    tweaks: [],
  },
];

export const allTweaks = categories.flatMap((c) => c.tweaks);
export const getTweakById = (id) => allTweaks.find((t) => t.id === id);
