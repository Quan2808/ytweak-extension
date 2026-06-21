import { t } from "@shared/utils/i18n";

import customHeaderLogo from "@features/general/change-header-logo";
import linkSanitizer from "@features/general/link-sanitizer";
import addLoopButton from "@features/player/add-loop-button";
import addPipButton from "@features/player/add-pip-button";
import expandTheaterMode from "@features/player/expand-theater-mode";
import hidePremiumVideoQualityTitle from "@features/player/hide-premium-video-quality-title";
import returnYoutubeDislike from "@features/return-youtube-dislike/ryd";
import showThumbnailOnPause from "@features/player/show-thumbnail-on-pause";
import hideStatementBanner from "@features/ads/hide-statement-banner";
import hideHomeAds from "@features/ads/hide-home-ads";
import hideSidebarAds from "@features/ads/hide-sidebar-ads";

// Category page components
import GeneralCategoryPage from "@features/general/components/GeneralCategoryPage";
import FeedCategoryPage from "@features/feed/components/FeedCategoryPage";
import PlayerCategoryPage from "@features/player/components/PlayerCategoryPage";
import RYDCategoryPage from "@features/return-youtube-dislike/components/RYDCategoryPage";
import AdsPage from "@features/ads/components/AdsPage";
import hidePlayerAds from "@features/ads/hide-player-ads";
import hideStoreShelf from "@features/ads/hide-store-shelf";
import removePlaylistFromHome from "@features/feed/remove-playlist-from-home";

export const categories = [
  {
    id: "general",
    get label() {
      return t("category_general_label");
    },
    icon: "Settings",
    tweaks: [customHeaderLogo, linkSanitizer],
    component: GeneralCategoryPage,
  },
  {
    id: "ads",
    get label() {
      return t("category_ads_label");
    },
    icon: "Ads",
    tweaks: [
      hideSidebarAds,
      hideStatementBanner,
      hideHomeAds,
      hideStoreShelf,
      // hidePlayerAds,
    ],
    component: AdsPage,
  },
  {
    id: "feed",
    get label() {
      return t("category_feed_label");
    },
    icon: "Feed",
    tweaks: [
      removePlaylistFromHome,
    ],
    component: FeedCategoryPage,
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
    component: PlayerCategoryPage,
  },
  {
    id: "returnYouTubeDislike",
    get label() {
      return t("category_returnYouTubeDislike_label");
    },
    icon: "RYD",
    tweaks: [returnYoutubeDislike],
    component: RYDCategoryPage,
  },
  {
    id: "test",
    get label() {
      return t("category_comingSoon_label");
    },
    icon: "MoreHoriz",
    tweaks: [],
    component: null,
  },
];

export const allTweaks = categories.flatMap((c) => c.tweaks);
export const getTweakById = (id) => allTweaks.find((t) => t.id === id);
