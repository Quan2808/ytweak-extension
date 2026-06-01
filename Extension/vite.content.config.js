import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/entries/content/content.js"),
      name: "content",
      formats: ["iife"],
      fileName: () => "assets/content.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // ✅ Tất cả CSS từ bất kỳ tweak nào đều → content.css
          const isFromTweaks = assetInfo.originalFileNames?.some((f) =>
            f.replace(/\\/g, "/").includes("src/tweaks/"),
          );
          if (assetInfo.ext === "css" && isFromTweaks) {
            return "assets/content.[ext]";
          }
          return "assets/content.[ext]";
        },
      },
    },
  },
});
