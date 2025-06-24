import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import { baseEslintConfig } from '../../eslint.config.base.mjs';

export default defineConfig([
  ...baseEslintConfig,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.tsx"],
    languageOptions: { globals: globals.browser },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      // ========== 核心规则 ==========
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // ========== 类型检查规则 ==========
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "warn",
      'no-unused-vars': "off",
      "@typescript-eslint/no-unused-expressions": "off",
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        }
      ],
    },
    settings: {
      react: {
        version: 'detect', // 自动检测
      }
    },
  },
]);
