import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "path";
import fs from "fs";

const r = (...args) => resolve(__dirname, ...args);

// Plugin serve /_locales/ từ public/
function serveLocales() {
  return {
    name: "serve-locales",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith("/_locales/")) return next();
        const filePath = r("public", req.url.slice(1));
        if (!fs.existsSync(filePath)) return next();
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync(filePath));
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  root: r("src/entries/popup"),

  resolve: {
    alias: {
      "@shared": r("src/shared"),
      "@features": r("src/features"),
      "@entries": r("src/entries"),
      "@public": r("public"),
    },
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
        content: r("src/entries/content/index.js"),
      },
      output: {
        entryFileNames: ({ name }) =>
          name === "background" || name === "content"
            ? "[name].js"
            : "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },

  publicDir: r("public"),
}));
