import { extConfig, cLog } from "./config.js";

export function roundDown(num) {
  if (num < 1000) return num;
  const int = Math.floor(Math.log10(num) - 2);
  const decimal = int + (int % 3 ? 1 : 0);
  return Math.floor(num / 10 ** decimal) * 10 ** decimal;
}

export function getNumberFormatter(optionSelect) {
  const userLocales =
    document.documentElement.lang ||
    navigator.language ||
    (() => {
      try {
        return new URL(
          Array.from(document.querySelectorAll("head > link[rel='search']"))
            .find((n) => n?.getAttribute("href")?.includes("?locale="))
            ?.getAttribute("href"),
        )?.searchParams?.get("locale");
      } catch {
        cLog("Cannot find browser locale, defaulting to en");
        return "en";
      }
    })();

  const isLong = optionSelect === "compactLong";
  const isStandard = optionSelect === "standard";

  return Intl.NumberFormat(userLocales, {
    notation: isStandard ? "standard" : "compact",
    compactDisplay: isLong ? "long" : "short",
  });
}

export function numberFormat(numberState) {
  const value = extConfig.numberDisplayRoundDown
    ? roundDown(numberState)
    : numberState;
  return getNumberFormatter(extConfig.numberDisplayFormat).format(value);
}
