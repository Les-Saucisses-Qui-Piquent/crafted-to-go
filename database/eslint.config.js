import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    files: ["**/*.ts"],
    rules: {
      // Turn off the base rule as it can report incorrect errors with TypeScript
      "no-unused-vars": "off",
      // Use the TypeScript-specific rule instead with strict settings
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          ignoreRestSiblings: false,
        },
      ],
      "no-console": "warn",
    },
  },
];
