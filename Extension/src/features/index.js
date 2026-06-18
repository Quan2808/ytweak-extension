import { t } from "@shared/utils/i18n";

import customHeaderLogo from "@features/general/change-header-logo";
import linkSanitizer from "@features/general/link-sanitizer";
import addLoopButton from "@features/video/add-loop-button";
import addPipButton from "@features/video/add-pip-button";
import expandTheaterMode from "@features/video/expand-theater-mode";
import hidePremiumVideoQualityTitle from "@features/video/hide-premium-video-quality-title";

import returnYoutubeDislike from "./return-youtube-dislike/ryd";
import showThumbnailOnPause from "./video/show-thumbnail-on-pause";
import hideStatementBanner from "@features/feed/hide-statement-banner";

export const categories = [
  {
    id: "general",
    get label() {
      return t("category_general_label");
    },
    icon: "Settings",
    tweaks: [customHeaderLogo, linkSanitizer],
  },
  {
    id: "feed",
    get label() {
      return t("category_feed_label");
    },
    icon: "Feed",
    tweaks: [hideStatementBanner],
  },
  {
    id: "player",
    get label() {
      return t("category_player_label");
    },
    icon: "PlayArrow",
    tweaks: [
      hidePremiumVideoQualityTitle,
      expandTheaterMode,
      showThumbnailOnPause,
      addPipButton,
      addLoopButton,
    ],
  },
  {
    id: "returnYouTubeDislike",
    get label() {
      return t("category_returnYouTubeDislike_label");
    },
    icon: "RYD",
    tweaks: [returnYoutubeDislike],
  },
  {
    id: "test",
    get label() {
      return t("category_comingSoon_label");
    },
    icon: "MoreHoriz",
    tweaks: [],
  },
];

export const allTweaks = categories.flatMap((c) => c.tweaks);
export const getTweakById = (id) => allTweaks.find((t) => t.id === id);
