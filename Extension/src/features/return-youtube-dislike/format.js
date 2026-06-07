import { extConfig, cLog } from "./config.js";

export function roundDown(num) {
  if (num < 1000) return num;
  const int = Math.floor(Math.log10(num) - 2);
  const decimal = int + (int % 3 ? 1 : 0);
  const value = Math.floor(num / 10 ** decimal);
  return value * 10 ** decimal;
}

export function getNumberFormatter(optionSelect) {
  let userLocales;

  if (document.documentElement.lang) {
    userLocales = document.documentElement.lang;
  } else if (navigator.language) {
    userLocales = navigator.language;
  } else {
    try {
      userLocales = new URL(
        Array.from(document.querySelectorAll("head > link[rel='search']"))
          ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
          ?.getAttribute("href"),
      )?.searchParams?.get("locale");
    } catch {
      cLog("Cannot find browser locale. Use en as default for number formatting.");
      userLocales = "en";
    }
  }

  let formatterNotation;
  let formatterCompactDisplay;

  switch (optionSelect) {
    case "compactLong":
      formatterNotation = "compact";
      formatterCompactDisplay = "long";
      break;
    case "standard":
      formatterNotation = "standard";
      formatterCompactDisplay = "short";
      break;
    case "compactShort":
    default:
      formatterNotation = "compact";
      formatterCompactDisplay = "short";
  }

  return Intl.NumberFormat(userLocales, {
    notation: formatterNotation,
    compactDisplay: formatterCompactDisplay,
  });
}

export function numberFormat(numberState) {
  const numberDisplay = extConfig.numberDisplayRoundDown ? roundDown(numberState) : numberState;
  return getNumberFormatter(extConfig.numberDisplayFormat).format(numberDisplay);
}

export function getColorFromTheme(voteIsLike) {
  switch (extConfig.colorTheme) {
    case "accessible":
      return voteIsLike ? "dodgerblue" : "gold";
    case "neon":
      return voteIsLike ? "aqua" : "magenta";
    case "classic":
    default:
      return voteIsLike ? "lime" : "red";
  }
}
