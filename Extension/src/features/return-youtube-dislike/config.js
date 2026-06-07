export const extConfig = {
  disableLogging: true,
  numberDisplayFormat: "compactShort", // compactShort | compactLong | standard
  numberDisplayRoundDown: true,
  numberDisplayReformatLikes: false,
  tooltipPercentageMode: "none", // none | dash_like | dash_dislike | both | only_like | only_dislike
  rateBarEnabled: false,
};

export const isMobile = location.hostname === "m.youtube.com";
export const isShorts = () => location.pathname.startsWith("/shorts");

export function cLog(text, subtext = "") {
  if (!extConfig.disableLogging) {
    subtext = subtext.trim() === "" ? "" : `(${subtext})`;
    console.log(`[Return YouTube Dislikes] ${text} ${subtext}`);
  }
}
