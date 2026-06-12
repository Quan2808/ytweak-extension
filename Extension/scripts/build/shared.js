import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, "../..");

export const toKebabCase = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export const handleMenuNavigation = (key, currentIndex, totalLength) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  }
  if (key.name === "up") {
    return (currentIndex - 1 + totalLength) % totalLength;
  }
  if (key.name === "down") {
    return (currentIndex + 1) % totalLength;
  }
  return currentIndex;
};
