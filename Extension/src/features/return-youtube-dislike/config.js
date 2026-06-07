export const extConfig = {
  showUpdatePopup: false,
  disableVoteSubmission: false,
  disableLogging: true,
  coloredThumbs: false,
  coloredBar: false,
  colorTheme: "classic", // classic | accessible | neon
  numberDisplayFormat: "compactShort", // compactShort | compactLong | standard
  numberDisplayRoundDown: true,
  tooltipPercentageMode: "none", // none | dash_like | dash_dislike | both | only_like | only_dislike
  numberDisplayReformatLikes: false,
  rateBarEnabled: false,
};

export const LIKED_STATE = "LIKED_STATE";
export const DISLIKED_STATE = "DISLIKED_STATE";
export const NEUTRAL_STATE = "NEUTRAL_STATE";

export const isMobile = location.hostname === "m.youtube.com";
export const isShorts = () => location.pathname.startsWith("/shorts");

export function cLog(text, subtext = "") {
  if (!extConfig.disableLogging) {
    subtext = subtext.trim() === "" ? "" : `(${subtext})`;
    console.log(`[Return YouTube Dislikes] ${text} ${subtext}`);
  }
}
