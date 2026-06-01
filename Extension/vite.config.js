import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { r, aliases, serveLocales } from "./vite.shared.js";

export default defineConfig(() => ({
  root: r("src/entries/popup"),
  resolve: { alias: aliases },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    serveLocales(),
  ],
  build: {
    outDir: r("dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: r("src/entries/popup/index.html"),
        background: r("src/entries/background/index.js"),
      },
      output: {
        entryFileNames: ({ name }) =>
          name === "background" ? "[name].js" : "popup/[name].js",
        chunkFileNames: "popup/[name].js",
        assetFileNames: ({ name }) => {
          if (
            name &&
            (name.endsWith(".ttf") ||
              name.endsWith(".woff") ||
              name.endsWith(".woff2"))
          ) {
            return "assets/fonts/[name].[ext]";
          }
          return "popup/[name].[ext]";
        },
      },
    },
  },
  publicDir: r("public"),
}));
