# @super-trans/cli

## 简介

命令行工具，负责代码/配置的解析、转换与构建流程调度，支持通过配置文件驱动多转换器任务。

## 功能特性

- 配置驱动：支持读取`trans.config.json`配置文件
- 多任务处理：可同时执行多个转换器（如`@super-trans/trans-swagger`）
- 流程钩子：提供全流程 Hook 支持（文件遍历、AST 转换、结果输出等）

## 安装

```bash
pnpm add -g @super-trans/cli
```

## 快速开始

### 1. 创建配置文件（trans.config.json）

```json
{
  "context": ".",
  "source": {
    "include": ["src/**/*.ts"],
    "exclude": ["**/test/*"]
  },
  "transformers": {
    "@super-trans/trans-swagger": {
      "output": "dist/swagger",
      "plugins": []
    }
  }
}
```

### 2. 执行转换

```bash
npx super-trans --config trans.config.json
```

## 命令参数

| 参数     | 说明         | 默认值            |
| -------- | ------------ | ----------------- |
| --config | 配置文件路径 | trans.config.json |
| --help   | 查看帮助信息 | -                 |
