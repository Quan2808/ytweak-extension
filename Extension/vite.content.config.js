import { defineConfig } from "vite";
import { r, aliases } from "./vite.shared.js";

export default defineConfig({
  resolve: { alias: aliases },
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
