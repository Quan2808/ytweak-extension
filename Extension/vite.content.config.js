import { defineConfig } from "vite";
import { resolve } from "path";

const r = (...args) => resolve(__dirname, ...args);

export default defineConfig({
  resolve: {
    alias: {
      "@shared": r("src/shared"),
      "@features": r("src/features"),
      "@entries": r("src/entries"),
      "@public": r("public"),
    },
  },
  build: {
    outDir: r("dist"),
    emptyOutDir: false,
    lib: {
      entry: r("src/entries/content/index.js"),
      name: "content",
      formats: ["iife"],
      fileName: () => "content.js",
    },
  },
});
