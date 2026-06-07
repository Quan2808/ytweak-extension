import fs from "fs";
import { resolve } from "path";

export const r = (...args) => resolve(__dirname, "..", ...args);

export const aliases = {
  "@shared": r("src/shared"),
  "@components": r("src/shared/components"),
  "@features": r("src/features"),
  "@entries": r("src/entries"),
  "@public": r("public"),
};

export function serveLocales() {
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
