# @super-trans/core

## 简介

核心转换引擎，提供输入层、转换层、输出层的抽象类，支持通过 Hook 机制扩展各层逻辑，实现任意文本 ↔ AST 树 ↔ 任意文本的双向转换。

## 功能特性

- 分层架构：输入层（Resolver）、转换层（Transformer）、输出层（Releaser）
- 可扩展性：基于 tapable 的 Hook 系统，支持插件扩展
- 跨环境兼容：Node.js 与浏览器环境适配

## 安装

```bash
pnpm add @super-trans/core
```

## 使用示例

```typescript
import { Resolver, Transformer, Releaser } from "@super-trans/core";

class MyResolver extends Resolver {
  resolve(content: string) {
    // 实现输入解析逻辑
  }
}

class MyTransformer extends Transformer {
  parse(ast: ASTTree) {
    // 实现AST转换逻辑
  }
}

class MyReleaser extends Releaser {
  generate(result: any) {
    // 实现输出生成逻辑
  }
}
```

## 扩展机制

通过继承抽象类并注册 Hook，可扩展各层功能：

```typescript
const processer = new Processer();
processer.hooks.beforeParse.tap("MyPlugin", (ast) => {
  // 预处理AST
});
```
