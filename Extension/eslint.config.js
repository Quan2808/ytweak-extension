import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import { createOxcImportResolver } from "eslint-import-resolver-oxc";
import { flatConfigs } from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import globals from "globals";

const ALIAS_PATTERNS = [
  "@shared/",
  "@components/",
  "@features/",
  "@entries/",
  "@public/",
];

const UNRESOLVED_IGNORE = [
  "^@mui/",
  "^react-dom/",
  ...ALIAS_PATTERNS.map((alias) => `^${alias}`),
];

const resolverFor = async (configFile) => ({
  "import-x/resolver-next": [
    await createOxcImportResolver({ bundlerConfig: configFile }),
  ],
});

const resolverPopup = await resolverFor("./scripts/vite.config.js");
const resolverContent = await resolverFor("./scripts/vite.content.config.js");

const COMMON_RULES = {
  "import-x/order": [
    "warn",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      pathGroups: [
        { pattern: "@mui/material", group: "external", position: "before" },
        { pattern: "@mui/material/**", group: "external", position: "before" },
        {
          pattern: "@mui/icons-material/**",
          group: "external",
          position: "before",
        },
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

  "no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "no-var": "error",
  "prefer-const": "warn",

  "object-shorthand": "warn",
  "prefer-template": "warn",
  "no-nested-ternary": "warn",
  eqeqeq: ["error", "always", { null: "ignore" }],

  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",

  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-debugger": "warn",
};

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**", "*.min.js"]),

  {
    files: [
      "scripts/vite.config.js",
      "scripts/vite.content.config.js",
      "scripts/vite.shared.js",
      "scripts/build-prompt.js",
      "eslint.config.js",
    ],
    extends: [js.configs.recommended, flatConfigs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      ...COMMON_RULES,
      "import-x/no-unresolved": "off",
      "no-console": "off",
    },
  },

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
      "no-restricted-globals": [
        "error",
        {
          name: "XMLHttpRequest",
          message: "Use fetch() in service workers.",
        },
      ],
    },
  },

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
