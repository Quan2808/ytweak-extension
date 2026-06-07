import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

console.log("\n🔍 Running linter check...");
try {
  execSync("npm run lint", { stdio: "inherit" });
} catch (error) {
  console.error(
    "\n❌ Lint check failed. Please fix the errors before building.",
  );
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const currentVersion = pkg.version;

function getNextVersion(type) {
  const [major, minor, patch] = currentVersion.split(".").map(Number);
  if (type === "patch") return `${major}.${minor}.${patch + 1}`;
  if (type === "minor") return `${major}.${minor + 1}.0`;
  if (type === "major") return `${major + 1}.0.0`;
  return currentVersion;
}

const options = [
  { label: "None", desc: "Keep current version", next: currentVersion },
  {
    label: "Patch",
    desc: "Bug fixes, refactoring",
    next: getNextVersion("patch"),
  },
  {
    label: "Minor",
    desc: "New features (backward compatible)",
    next: getNextVersion("minor"),
  },
  {
    label: "Major",
    desc: "Breaking changes, manifest/API updates",
    next: getNextVersion("major"),
  },
];

let selectedIndex = 0;

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function renderMenu() {
  console.clear();
  console.log(
    "\n\x1b[36m========== Ytweak Extension Build Manager ==========\x1b[0m",
  );
  console.log(`Current Version: \x1b[32mv${currentVersion}\x1b[0m`);
  console.log("----------------------------------------------------");
  console.log(
    "Use \x1b[33m↑/↓ (Arrow keys)\x1b[0m to navigate, press \x1b[33mEnter\x1b[0m to select:\n",
  );

  options.forEach((opt, index) => {
    const isSelected = index === selectedIndex;
    const prefix = isSelected ? "\x1b[36m❯ ●\x1b[0m" : "  ○";
    const label = isSelected
      ? `\x1b[36m${opt.label.padEnd(6)}\x1b[0m`
      : opt.label.padEnd(6);
    const details = isSelected
      ? `\x1b[90m(${opt.desc})\x1b[0m -> \x1b[36mv${opt.next}\x1b[0m`
      : `\x1b[90m(${opt.desc}) -> v${opt.next}\x1b[0m`;

    console.log(` ${prefix} ${label} ${details}`);
  });
  console.log("----------------------------------------------------");
}

renderMenu();

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  }

  if (key.name === "up") {
    selectedIndex = (selectedIndex - 1 + options.length) % options.length;
    renderMenu();
  }

  if (key.name === "down") {
    selectedIndex = (selectedIndex + 1) % options.length;
    renderMenu();
  }

  if (key.name === "return" || key.name === "enter") {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    executeBuild(options[selectedIndex]);
  }
});

function executeBuild(selectedOpt) {
  let versionCommand = "";

  if (selectedOpt.label === "Patch") versionCommand = "npm run version:patch";
  if (selectedOpt.label === "Minor") versionCommand = "npm run version:minor";
  if (selectedOpt.label === "Major") versionCommand = "npm run version:major";

  try {
    if (versionCommand) {
      console.log(
        `\n🔄 Bumping version to \x1b[32mv${selectedOpt.next}\x1b[0m...`,
      );
      execSync(versionCommand, { stdio: "inherit" });
    } else {
      console.log(
        `\n🔹 Keeping version \x1b[32mv${currentVersion}\x1b[0m, proceeding with build...`,
      );
    }

    console.log("\n📦 Running production build...\n");
    execSync("npm run build:core", { stdio: "inherit" });

    console.log("\n✨ \x1b[32mBuild completed successfully!\x1b[0m\n");
  } catch (error) {
    console.error("\n❌ Build failed:", error.message);
    process.exit(1);
  }
}
