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
      ],
      'max-len': [
        'error',
        {
          code: 120, // 每行最大长度（可根据需求调整）
          ignoreComments: true, // 忽略注释行长度
          ignoreUrls: true, // 忽略URL长度
          ignoreStrings: true, // 忽略字符串长度
          ignoreTemplateLiterals: true // 忽略模板字符串长度
        }
      ]
    },
  },
];
