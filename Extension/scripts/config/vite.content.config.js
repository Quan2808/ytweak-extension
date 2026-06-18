import { defineConfig } from "vite";

import { r, aliases } from "./vite.shared.js";

export default defineConfig({
  resolve: { alias: aliases },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development",
    ),
    "process.env": "{}",
  },
  build: {
    outDir: r("dist"),
    emptyOutDir: false,
    lib: {
      entry: r("src/entries/content/index.js"),
      name: "content",
      formats: ["iife"],
      fileName: () => "content/content.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "content/content.[ext]",
      },
    },
  },
});
