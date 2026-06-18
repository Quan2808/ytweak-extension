import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { r, aliases, serveLocales } from "./vite.shared.js";

export default defineConfig(() => ({
  root: r("src/entries/popup"),
  resolve: { alias: aliases },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development",
    ),
  },
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
        assetFileNames: (chunkInfo) => {
          const assetName = chunkInfo.names?.[0] || chunkInfo.fileName || "";

          if (/\.(ttf|woff2?)$/i.test(assetName)) {
            return "assets/fonts/[name].[ext]";
          }

          if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(assetName)) {
            return "assets/icons/[name].[ext]";
          }

          return "popup/[name].[ext]";
        },
      },
    },
  },
  publicDir: r("public"),
}));
