import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

import JSZip from "jszip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const releaseDir = path.resolve(rootDir, "release");
const pkgPath = path.resolve(rootDir, "package.json");

console.log("\n🔍 Running linter check... 🛠️");
try {
  execSync("npm run lint", { stdio: "inherit" });
} catch (error) {
  console.error(
    "\n❌ Lint check failed. Please fix the errors before building.",
  );
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
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
    const prefix = isSelected ? "\x1b[36m❯ ●\x1b[0m" : "   ○";
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

const handleMenuKeyPress = (str, key) => {
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
    process.stdin.removeListener("keypress", handleMenuKeyPress);
    executeBuild(options[selectedIndex]);
  }
};

process.stdin.on("keypress", handleMenuKeyPress);

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

    console.log("\n✨ \x1b[32mBuild completed successfully!\x1b[0m");

    askForZip(selectedOpt.next);
  } catch (error) {
    console.error("\n❌ Build failed:", error.message);
    process.exit(1);
  }
}

function askForZip(targetVersion) {
  let zipIndex = 0;

  const renderZipMenu = () => {
    console.clear();
    console.log(
      "\n\x1b[36m📦 Production Build Success! Ready for Release? \x1b[0m",
    );
    console.log(`Target Version: \x1b[32mv${targetVersion}\x1b[0m`);
    console.log("----------------------------------------------------");
    console.log(
      "Do you want to export this build to a \x1b[33m.zip\x1b[0m file?\n",
    );
    console.log(
      ` ${zipIndex === 0 ? "\x1b[36m❯ ● Yes, zip it please\x1b[0m" : "   ○ Yes, zip it please"}`,
    );
    console.log(
      ` ${zipIndex === 1 ? "\x1b[31m❯ ● No, keep dist directory only\x1b[0m" : "   ○ No, keep dist directory only"}`,
    );
    console.log("----------------------------------------------------");
    console.log(
      "Use \x1b[33m↑/↓ (Arrow keys)\x1b[0m, press \x1b[33mEnter\x1b[0m to confirm.",
    );
  };

  renderZipMenu();

  const handleZipKeyPress = (str, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    }

    if (key.name === "up" || key.name === "down") {
      zipIndex = zipIndex === 0 ? 1 : 0;
      renderZipMenu();
    }

    if (key.name === "return" || key.name === "enter") {
      process.stdin.removeListener("keypress", handleZipKeyPress);

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();

      if (zipIndex === 0) {
        executeZip(targetVersion);
      } else {
        console.log(
          "\n👋 \x1b[33mSkipped zip creation. Pure build files are ready in 'dist/'.\x1b[0m\n",
        );
        process.exit(0);
      }
    }
  };

  process.stdin.on("keypress", handleZipKeyPress);
}

function addDirectoryToZip(zip, targetDir, currentDir = targetDir) {
  const files = fs.readdirSync(currentDir);

  for (const file of files) {
    const filePath = path.join(currentDir, file);
    const stat = fs.statSync(filePath);

    const relativePath = path.relative(targetDir, filePath).replace(/\\/g, "/");

    if (stat.isDirectory()) {
      addDirectoryToZip(zip, targetDir, filePath);
    } else {
      zip.file(relativePath, fs.readFileSync(filePath));
    }
  }
}

async function executeZip(version) {
  const zipFileName = `${pkg.name}-v${version}.zip`;
  const zipFilePath = path.join(releaseDir, zipFileName);

  if (!fs.existsSync(distDir)) {
    console.error(
      `\n❌ Error: 'dist/' directory not found! Please build again.`,
    );
    process.exit(1);
  }

  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  } else {
    const existingFiles = fs.readdirSync(releaseDir);
    let deletedCount = 0;

    for (const file of existingFiles) {
      if (file.endsWith(".zip") && file.startsWith(`${pkg.name}-v`)) {
        fs.unlinkSync(path.join(releaseDir, file));
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      console.log(
        `\n🧹 Cleaned up \x1b[33m${deletedCount}\x1b[0m old zip release package(s).`,
      );
    }
  }

  console.log(
    `\n🤐 Compressing production files into \x1b[36mrelease/${zipFileName}\x1b[0m...`,
  );

  try {
    const zip = new JSZip();

    addDirectoryToZip(zip, distDir);

    const content = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    fs.writeFileSync(zipFilePath, content);

    const sizeInMB = (content.length / 1024 / 1024).toFixed(2);
    console.log(`\n🎉 \x1b[32mZip package created successfully!\x1b[0m`);
    console.log(`📁 Path: \x1b[36mrelease/${zipFileName}\x1b[0m`);
    console.log(`⚡ Size: \x1b[33m${sizeInMB} MB\x1b[0m\n`);
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Compression failed:", err.message);
    process.exit(1);
  }
}
