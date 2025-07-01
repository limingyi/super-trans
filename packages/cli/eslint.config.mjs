import { baseEslintConfig } from '../../eslint.config.base.mjs';
export default [
  ...baseEslintConfig,
  {
    rules: {
      ...baseEslintConfig.rules,
      'no-irregular-whitespace': [
        'error',
        {
          skipComments: true,      // 日志说明中可能包含
          skipRegExps: true,       // 正则表达式常见
          skipTemplates: true       // SQL 查询等需要
        }
      ]
    }
  }
];
