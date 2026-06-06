import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import { createOxcImportResolver } from "eslint-import-resolver-oxc";
import { flatConfigs } from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import globals from "globals";

// ─── Shared alias paths (mirrors vite.shared.js) ────────────────────────────
const ALIAS_PATTERNS = [
  "@shared/",
  "@components/",
  "@features/",
  "@entries/",
  "@public/",
];

// ─── Third-party packages whose deep subpath imports the oxc resolver
// cannot statically verify (e.g. @mui/material/IconButton uses package
// exports with runtime conditions). Ignoring them here is safe because
// TypeScript / Vite will catch missing exports at build time.
const UNRESOLVED_IGNORE = [
  "^@mui/",
  "^react-dom/",
  ...ALIAS_PATTERNS.map((alias) => `^${alias}`),
];

// ─── Resolver settings per vite config ──────────────────────────────────────
// resolver-next requires a live resolver instance (interfaceVersion: 3),
// NOT a name string. createOxcImportResolver() is async and returns that
// instance. import-x/no-cycle is intentionally omitted — it uses legacy
// resolver internals incompatible with resolver-next.
const resolverFor = async (configFile) => ({
  "import-x/resolver-next": [
    await createOxcImportResolver({ bundlerConfig: configFile }),
  ],
});

// Pre-resolve all resolver instances (top-level await via ESM)
const resolverPopup = await resolverFor("./vite.config.js");
const resolverContent = await resolverFor("./vite.content.config.js");

// ─── Shared rules applied to every JS/JSX file ──────────────────────────────
const COMMON_RULES = {
  // Import hygiene
  "import-x/order": [
    "warn",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      pathGroups: [
        // MUI subpath imports must sort together with their root package
        { pattern: "@mui/material", group: "external", position: "before" },
        { pattern: "@mui/material/**", group: "external", position: "before" },
        {
          pattern: "@mui/icons-material/**",
          group: "external",
          position: "before",
        },
        // Internal aliases
        ...ALIAS_PATTERNS.map((pattern) => ({
          pattern: `${pattern}**`,
          group: "internal",
          position: "before",
        })),
      ],
      pathGroupsExcludedImportTypes: ["builtin"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],
  "import-x/no-unresolved": ["error", { ignore: UNRESOLVED_IGNORE }],
  "import-x/no-duplicates": "warn",
  "import-x/no-self-import": "error",
  // import-x/no-cycle is excluded — incompatible with resolver-next API

  // Variables
  "no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "no-var": "error",
  "prefer-const": "warn",

  // Code style
  "object-shorthand": "warn",
  "prefer-template": "warn",
  "no-nested-ternary": "warn",
  eqeqeq: ["error", "always", { null: "ignore" }],

  // Security — critical for browser extensions
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",

  // Debugging
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-debugger": "warn",
};

export default defineConfig([
  // ── Global ignores ──────────────────────────────────────────────────────
  globalIgnores(["dist/**", "node_modules/**", "*.min.js"]),

  // ── Config & build files (Node.js environment) ──────────────────────────
  {
    files: [
      "vite.config.js",
      "vite.content.config.js",
      "vite.shared.js",
      "eslint.config.js",
    ],
    extends: [js.configs.recommended, flatConfigs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
    // No custom resolver needed — Node resolves these natively
    rules: {
      ...COMMON_RULES,
      "import-x/no-unresolved": "off", // path aliases not applicable here
      "no-console": "off", // build scripts may log freely
    },
  },

  // ── Background service worker ────────────────────────────────────────────
  // Runs as a service worker — no DOM, no window, but has chrome.* APIs
  {
    files: ["src/entries/background/**/*.js"],
    extends: [js.configs.recommended, flatConfigs.recommended],
    languageOptions: {
      globals: {
        ...globals.webextensions,
        ...globals.serviceworker,
      },
    },
    settings: resolverPopup,
    rules: {
      ...COMMON_RULES,
      // Service workers must not block the thread — ban synchronous XHR
      "no-restricted-globals": [
        "error",
        {
          name: "XMLHttpRequest",
          message: "Use fetch() in service workers.",
        },
      ],
    },
  },

  // ── Content script ───────────────────────────────────────────────────────
  // Injected into YouTube pages — has DOM + chrome.* APIs
  {
    files: ["src/entries/content/**/*.js"],
    extends: [js.configs.recommended, flatConfigs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    settings: resolverContent,
    rules: {
      ...COMMON_RULES,
      // Avoid polluting the YouTube page's global scope
      "no-restricted-globals": [
        "error",
        {
          name: "window",
          message:
            "Prefer globalThis or document in content scripts to avoid page-scope collisions.",
        },
      ],
    },
  },

  // ── Feature modules & shared utils ──────────────────────────────────────
  // Pure JS modules bundled into the content script
  {
    files: ["src/features/**/*.js", "src/shared/utils/**/*.js"],
    extends: [js.configs.recommended, flatConfigs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    settings: resolverContent,
    rules: {
      ...COMMON_RULES,
    },
  },

  // ── Popup & Options UI (React + browser APIs) ────────────────────────────
  {
    files: [
      "src/entries/popup/**/*.{js,jsx}",
      "src/entries/options/**/*.{js,jsx}",
      "src/shared/components/**/*.{js,jsx}",
      "src/shared/contexts/**/*.{js,jsx}",
    ],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      flatConfigs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: resolverPopup,
    rules: {
      ...COMMON_RULES,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);
