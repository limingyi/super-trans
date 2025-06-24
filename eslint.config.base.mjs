import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export const baseEslintConfig = [
  globalIgnores(['**/dist/']),
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "warn",
      'no-unused-vars': "off",
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        }
      ]
    },
  },
];
