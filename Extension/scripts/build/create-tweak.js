import fs from "fs";
import path from "path";
import readline from "readline";

import {
  rootDir,
  toKebabCase,
  toCamelCase,
  handleMenuNavigation,
} from "./shared.js";

const FEATURES_DIR = path.resolve(rootDir, "src/features");
const INDEX_FILE_PATH = path.resolve(FEATURES_DIR, "index.js");

const LOCALE_PATH = path.resolve(rootDir, "public/_locales/en/messages.json");

if (!fs.existsSync(INDEX_FILE_PATH)) {
  console.error(`\n❌ Error: Cannot find file at ${INDEX_FILE_PATH}`);
  process.exit(1);
}

function getLocaleMessages() {
  try {
    return JSON.parse(fs.readFileSync(LOCALE_PATH, "utf-8"));
  } catch (e) {
    console.warn(
      "⚠️ Warning: Could not parse localization files. Using raw keys instead.",
    );
  }
  return {};
}

const locales = getLocaleMessages();
const indexContent = fs.readFileSync(INDEX_FILE_PATH, "utf-8");

const categoryBlockRegex =
  /\{\s*id:\s*["']([^"']+)["'][\s\S]*?get label\(\)\s*\{\s*return\s+t\(["']([^"']+)["']\);\s*\},[\s\S]*?\}/g;

const menuOptions = [];
let match;

while ((match = categoryBlockRegex.exec(indexContent)) !== null) {
  const [_, catId, catLabelKey] = match;

  if (catId !== "test") {
    const cleanLabel = locales[catLabelKey]?.message || catLabelKey;

    menuOptions.push({
      label: `Existing: \x1b[35m${cleanLabel}\x1b[0m (\x1b[90m${catId}\x1b[0m)`,
      type: "existing",
      value: catId,
    });
  }
}

menuOptions.push({
  label: "✨ Create a completely NEW Category",
  type: "new",
  value: null,
});

let selectedIndex = 0;

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function renderCategoryMenu() {
  console.clear();
  console.log(
    "\n\x1b[36m========== YTweak Extension Feature Creator ==========\x1b[0m",
  );
  console.log(
    "Use \x1b[33m↑/↓ (Arrow keys)\x1b[0m to navigate, press \x1b[33mEnter\x1b[0m to select Category:\n",
  );

  menuOptions.forEach((opt, index) => {
    const isSelected = index === selectedIndex;
    const prefix = isSelected ? "\x1b[36m❯ ●\x1b[0m" : "    ○";
    const label = isSelected ? `\x1b[36m${opt.label}\x1b[0m` : opt.label;

    console.log(` ${prefix} ${label}`);
  });
  console.log("----------------------------------------------------");
}

renderCategoryMenu();

const handleMenuKeyPress = (str, key) => {
  const previousIndex = selectedIndex;
  selectedIndex = handleMenuNavigation(key, selectedIndex, menuOptions.length);

  if (previousIndex !== selectedIndex) {
    renderCategoryMenu();
  }

  if (key.name === "return" || key.name === "enter") {
    process.stdin.removeListener("keypress", handleMenuKeyPress);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }

    askTweakDetails(menuOptions[selectedIndex]);
  }
};

process.stdin.on("keypress", handleMenuKeyPress);

function askTweakDetails(selectedOpt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (selectedOpt.type === "new") {
    rl.question(
      "\n⌨️ Enter ID for the NEW Category (e.g. short, ads): ",
      (newCatId) => {
        const categoryId = newCatId.trim().toLowerCase();
        if (!categoryId) {
          console.error("❌ Category ID cannot be empty!");
          rl.close();
          process.exit(1);
        }
        askTweakName(rl, categoryId, true);
      },
    );
  } else {
    askTweakName(rl, selectedOpt.value, false);
  }
}

function askTweakName(rl, categoryId, isNewCategory) {
  rl.question(
    "⌨️ Enter Tweak Name (e.g. Hide Shorts Shelf, Auto HD): ",
    (tweakNameInput) => {
      const tweakRawName = tweakNameInput.trim();
      if (!tweakRawName) {
        console.error("❌ Tweak name cannot be empty!");
        rl.close();
        process.exit(1);
      }

      rl.close();
      process.stdin.pause();

      executeGeneration(categoryId, tweakRawName, isNewCategory);
    },
  );
}

function executeGeneration(categoryId, tweakRawName, isNewCategory) {
  const tweakFolder = toKebabCase(tweakRawName);
  const tweakVarName = toCamelCase(tweakFolder);

  const targetDir = path.resolve(FEATURES_DIR, categoryId, tweakFolder);
  const targetFile = path.resolve(targetDir, "index.js");

  if (fs.existsSync(targetFile)) {
    console.error(`\n❌ Error: Tweak already exists at: ${targetFile}`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const tweakTemplate = `import { t } from "@shared/utils/i18n";

const TWEAK_ID = "${tweakFolder}";

export default {
  id: TWEAK_ID,
  get name() {
    return t("tweak_${tweakVarName}_name");
  },
  get description() {
    return t("tweak_${tweakVarName}_desc");
  },
  default: false,
  enable() {
    // Code logic khi kích hoạt tweak viết tại đây
    console.log(\`[YTweak] Enabled: \${TWEAK_ID}\`);
  },
  disable() {
    // Code dọn dẹp khi tắt tweak viết tại đây
    console.log(\`[YTweak] Disabled: \${TWEAK_ID}\`);
  },
};
`;

  fs.writeFileSync(targetFile, tweakTemplate, "utf-8");
  console.log(
    `\n🟩 File created successfully at: \x1b[32m${targetFile}\x1b[0m`,
  );

  let updatedContent = fs.readFileSync(INDEX_FILE_PATH, "utf-8");

  const importStatement = `import ${tweakVarName} from "@features/${categoryId}/${tweakFolder}";\n`;
  const lastImportIndex = updatedContent.lastIndexOf("import ");
  const nextNewLineIndex = updatedContent.indexOf("\n", lastImportIndex);

  updatedContent =
    updatedContent.slice(0, nextNewLineIndex + 1) +
    importStatement +
    updatedContent.slice(nextNewLineIndex + 1);

  if (!isNewCategory) {
    const blockRegex = new RegExp(
      `(id:\\s*["']${categoryId}["'][\\s\\S]*?tweaks:\\s*\\[)([\\s\\S]*?)(\\])`,
      "g",
    );

    updatedContent = updatedContent.replace(
      blockRegex,
      (match, prefix, currentTweaks, suffix) => {
        const trimmedTweaks = currentTweaks.trim();
        const separator = trimmedTweaks ? ",\n      " : "\n      ";
        return `${prefix}${trimmedTweaks}${separator}${tweakVarName},\n    ${suffix}`;
      },
    );
    console.log(
      `🔀 Auto-imported and added code into existing category: \x1b[36m"${categoryId}"\x1b[0m`,
    );
  } else {
    const newCategoryBlock = `  {
    id: "${categoryId}",
    get label() {
      return t("category_${categoryId}_label");
    },
    icon: "Extension",
    tweaks: [${tweakVarName}],
  },
`;

    if (updatedContent.includes('id: "test"')) {
      updatedContent = updatedContent.replace(
        /(\{\s*id:\s*["']test["'])/,
        `${newCategoryBlock}  $1`,
      );
    } else {
      updatedContent = updatedContent.replace(
        /(export const categories = \[\s*)/,
        `$1${newCategoryBlock}`,
      );
    }
    console.log(
      `🔀 Created NEW category block \x1b[36m"${categoryId}"\x1b[0m and attached tweak!`,
    );
  }

  fs.writeFileSync(INDEX_FILE_PATH, updatedContent, "utf-8");
  console.log("\n🚀 \x1b[32mAll tasks completed flawlessly!\x1b[0m\n");
  process.exit(0);
}
