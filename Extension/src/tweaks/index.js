import { t } from "../utils/i18n";
// import tweakExample from "./tweak-example";
import customHeaderLogo from "./general/custom-header-logo";
import linkSanitizer from "./general/link-sanitizer";
import volumpeAmp from "./video/volume-amplifier";
import hidePremiumVideoQualityTitle from "./video/hide-premium-video-quality-title";
import addPipButton from "./player/add-pip-button";
import addLoopButton from "./player/add-loop-button";

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
    tweaks: [
      // volumpeAmp,
      hidePremiumVideoQualityTitle,
    ],
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
