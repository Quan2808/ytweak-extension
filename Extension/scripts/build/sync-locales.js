import fs from "fs";
import path from "path";
import readline from "readline";
import { r } from "../config/vite.shared.js";
import { handleMenuNavigation } from "./shared.js";

const LOCALES_DIR = r("public/_locales");
const SOURCE_LANG = "en";
const SOURCE_FILE = path.join(LOCALES_DIR, SOURCE_LANG, "messages.json");

// Keys excluded from "same message" verification (e.g., brand name, URLs)
const IGNORE_SAME_MESSAGE_KEYS = [
  "appName",
  "github_url",
  "category_returnYouTubeDislike_label",
  "tweak_ryd_footer_name",
];

if (!fs.existsSync(SOURCE_FILE)) {
  console.error(`\n❌ Error: Source locale file not found at: ${SOURCE_FILE}`);
  process.exit(1);
}

// 1. Detect target languages dynamically
const targetLangs = fs
  .readdirSync(LOCALES_DIR)
  .filter(
    (dir) =>
      dir !== SOURCE_LANG &&
      fs.statSync(path.join(LOCALES_DIR, dir)).isDirectory(),
  );

if (targetLangs.length === 0) {
  console.error(
    "\n❌ Error: No target translation folders found in public/_locales/",
  );
  process.exit(1);
}

// 2. Setup interactive CLI Menu options
const menuOptions = [
  {
    label: "✨ Sync ALL target localization files",
    value: "all",
  },
  ...targetLangs.map((lang) => ({
    label: `Target Locale: \x1b[35m${lang.toUpperCase()}\x1b[0m (\x1b[90m_locales/${lang}/messages.json\x1b[0m)`,
    value: lang,
  })),
];

let selectedIndex = 0;

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function renderMenu() {
  console.clear();
  console.log(
    "\n\x1b[36m========== YTweak Extension Locale Synchronizer ==========\x1b[0m",
  );
  console.log(
    "Use \x1b[33m↑/↓ (Arrow keys)\x1b[0m to navigate, press \x1b[33mEnter\x1b[0m to select language:\n",
  );

  menuOptions.forEach((opt, index) => {
    const isSelected = index === selectedIndex;
    const prefix = isSelected ? "\x1b[36m❯ ●\x1b[0m" : "    ○";
    const label = isSelected ? `\x1b[36m${opt.label}\x1b[0m` : opt.label;

    console.log(` ${prefix} ${label}`);
  });
  console.log(
    "-----------------------------------------------------------------",
  );
}

renderMenu();

const handleMenuKeyPress = (str, key) => {
  const previousIndex = selectedIndex;
  selectedIndex = handleMenuNavigation(key, selectedIndex, menuOptions.length);

  if (previousIndex !== selectedIndex) {
    renderMenu();
  }

  if (key.name === "return" || key.name === "enter") {
    process.stdin.removeListener("keypress", handleMenuKeyPress);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }

    console.clear();
    const selectedValue = menuOptions[selectedIndex].value;

    if (selectedValue === "all") {
      executeSync(targetLangs);
    } else {
      executeSync([selectedValue]);
    }
  }
};

process.stdin.on("keypress", handleMenuKeyPress);

// 3. Execution logic for sync and verification
function executeSync(languages) {
  console.log(
    `\n\x1b[34m🔄 Initializing translation synchronization engine...\x1b[0m`,
  );

  let sourceData;
  try {
    sourceData = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf-8"));
  } catch (e) {
    console.error(
      `\n❌ Critical Error: Failed to parse primary language JSON (${SOURCE_LANG})`,
    );
    process.exit(1);
  }

  languages.forEach((lang) => {
    const targetFile = path.join(LOCALES_DIR, lang, "messages.json");
    let targetData = {};

    if (fs.existsSync(targetFile)) {
      try {
        targetData = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
      } catch (e) {
        console.warn(
          `⚠️ Warning: Corrupted JSON formatting in [${lang.toUpperCase()}]. Re-initializing layout structure.`,
        );
      }
    }

    const updatedData = {};
    let missingKeysCounter = 0;
    let fallbackWarningsCounter = 0;

    // Synchronize object blocks using standard layout sequence (from English source)
    Object.keys(sourceData).forEach((key) => {
      const sourceObj = sourceData[key];
      const targetObj = targetData[key];

      if (!targetObj) {
        // Automatically inject missing keys maintaining standard localization position
        updatedData[key] = { ...sourceObj };
        missingKeysCounter++;
        console.log(
          `✨ [${lang.toUpperCase()}] Injected missing schema block: "${key}"`,
        );
      } else {
        updatedData[key] = targetObj;

        // Verify fallback conditions (identically duplicated english text)
        // Skip warning if the key is explicitly ignored, OR if both source and target messages are empty strings
        if (
          sourceObj.message === targetObj.message &&
          sourceObj.message.trim() !== "" &&
          !IGNORE_SAME_MESSAGE_KEYS.includes(key)
        ) {
          fallbackWarningsCounter++;
          console.warn(
            `⚠️ [${lang.toUpperCase()}] Untranslated String: Key "${key}" matches english source exactly ("${sourceObj.message}")`,
          );
        }
      }
    });

    // Write synchronized entries back to file safely with standard 2 spaces spacing
    fs.writeFileSync(
      targetFile,
      JSON.stringify(updatedData, null, 2) + "\n",
      "utf-8",
    );

    console.log(
      `-----------------------------------------------------------------`,
    );
    console.log(
      `📦 Locale sync report for [\x1b[35m${lang.toUpperCase()}\x1b[0m]:`,
    );
    console.log(
      `   - Structural anomalies corrected: \x1b[32m${missingKeysCounter}\x1b[0m keys added.`,
    );
    console.log(
      `   - Untranslated fallbacks lingering: \x1b[33m${fallbackWarningsCounter}\x1b[0m keys flagged.`,
    );
  });

  console.log(
    "\n🚀 \x1b[32mAll localization tasks processed successfully!\x1b[0m\n",
  );
  process.exit(0);
}
