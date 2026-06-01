import { t } from "@shared/utils/i18n";

const TRACKING_PARAMS = ["si", "pp", "feature", "src", "ved", "usp"];

function stripParams(url) {
  try {
    const parsed = new URL(url);
    let changed = false;
    TRACKING_PARAMS.forEach((p) => {
      if (parsed.searchParams.has(p)) {
        parsed.searchParams.delete(p);
        changed = true;
      }
    });
    return changed ? parsed.toString() : null;
  } catch (_) {
    return null;
  }
}

function sanitizeShareInput() {
  const input = document.getElementById("share-url");
  if (!input) return;
  const cleaned = stripParams(input.value);
  if (cleaned) input.value = cleaned;
}

function sanitizeAllLinks() {
  document
    .querySelectorAll(
      'a[href*="youtu.be"]:not([data-sanitized]), a[href*="youtube.com"]:not([data-sanitized])',
    )
    .forEach((link) => {
      const cleaned = stripParams(link.href);
      if (cleaned) {
        link.href = cleaned;
        link.setAttribute("data-sanitized", "");
      }
    });
}

function sanitize() {
  sanitizeShareInput();
  sanitizeAllLinks();
}

let observer = null;

export default {
  id: "link-sanitizer",
  get name() {
    return t("tweak_linkSanitizer_name");
  },
  get description() {
    return t("tweak_linkSanitizer_desc");
  },
  default: true,

  enable() {
    observer = new MutationObserver(() => {
      sanitize();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    sanitize();
  },

  disable() {
    if (observer) {
      clearInterval(observer);
      observer = null;
    }
    document.querySelectorAll("[data-sanitized]").forEach((el) => {
      el.removeAttribute("data-sanitized");
    });
  },
};
