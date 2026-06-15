import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rootDir } from "./shared.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(rootDir, "src/shared/assets/licenses.json");
const outputFile = path.join(rootDir, "src/shared/assets/licenses.json");

try {
  const rawData = JSON.parse(fs.readFileSync(inputFile, "utf8"));

  const cleaned = Object.fromEntries(
    Object.entries(rawData).map(([key, pkg]) => {
      const { path: pkgPath, licenseFile, ...rest } = pkg;
      return [key, rest];
    }),
  );

  fs.writeFileSync(outputFile, JSON.stringify(cleaned, null, 2));

  console.log(`✅ Đã tạo licenses.json sạch!`);
  console.log(`📍 Output: ${outputFile}`);
  console.log(`📊 Tổng số packages: ${Object.keys(cleaned).length}`);
} catch (err) {
  console.error("❌ Lỗi khi dọn licenses:", err.message);
  if (err.code === "ENOENT") {
    console.error(
      "   → File licenses.json không tồn tại. Hãy chạy license:scan trước.",
    );
  }
}
