import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "path";
import fs from "fs";

// Plugin serve /_locales/ từ public/
function serveLocales() {
  return {
    name: "serve-locales",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith("/_locales/")) return next();
        const filePath = resolve(__dirname, "public", req.url.slice(1));
        if (!fs.existsSync(filePath)) return next();
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync(filePath));
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  root: resolve(__dirname, "src/entries/popup"),
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    serveLocales(),
  ],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/entries/popup/index.html"),
        background: resolve(__dirname, "src/entries/background/background.js"),
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === "background" ? "[name].js" : "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  publicDir: resolve(__dirname, "public"),
}));
