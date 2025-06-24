# super-trans

基于AST的万能转换核心工具集，实现任意文本 ↔ AST树 ↔ 任意文本的双向转换，支持模块化扩展（如Swagger转Ant Design配置、TS-API转Markdown文档等）。

## 核心特点

- **分层架构**：输入层→转换层→输出层，各层解耦支持灵活扩展
- **跨环境兼容**：同时支持Node.js与浏览器环境运行
- **可扩展性**：通过Tapable Hook机制扩展各层逻辑
- **多包管理**：基于Monorepo组织核心包、工具包、示例包

## 技术栈

| 工具       | 用途                            |
| ---------- | ------------------------------- |
| pnpm       | 包管理及Workspace支持          |
| turbo      | 多包任务管理（构建/测试）       |
| tsup       | TypeScript构建（支持ESM/CJS）   |
| changeset  | 多包版本控制与发布              |
| TypeScript | 核心开发语言                    |

## 目录结构

```
super-trans/
├── packages/
│ ├── cli/       # 命令行工具：@super-trans/cli
│ ├── share/     # 基础工具包：@super-trans/share
│ ├── core/      # 核心转换引擎：@super-trans/core
│ ├── trans-swagger/ # Swagger转换器
│ ├── trans-ts2md/   # TS-API转Markdown文档
│ └── playground/    # 功能演示工程
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## 快速开始

### 安装依赖
```bash
pnpm install
```

### 构建所有包
```bash
pnpm build
```

### 运行演示工程
```bash
cd packages/playground
pnpm dev
```

## 核心模块简介

- **@super-trans/core**：抽象转换流程（Resolver→Transformer→Releaser），通过Hook机制支持扩展
- **@super-trans/cli**：命令行工具，支持配置驱动的多转换器任务调度
- **@super-trans/trans-swagger**：解析Swagger 3.0规范，生成表单配置（FormSchema）和表格列配置（TableColumn）
- **@super-trans/trans-ts2md**：解析TS接口声明及JSDoc，生成结构化Markdown文档
- **@super-trans/share**：提供AST遍历、类型判断、通用渲染等基础工具函数

## 开发规范

### Git 提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，提交信息格式如下：

```
<类型>(<作用域>): <描述>
```

#### 类型说明
| 类型    | 说明                     | 示例                  |
|---------|--------------------------|-----------------------|
| feat    | 新增功能                 | feat(core): 添加AST遍历钩子 |
| fix     | 修复缺陷                 | fix(cli): 修复配置文件解析错误 |
| docs    | 文档更新                 | docs(readme): 补充Git提交规范 |
| style   | 代码风格调整（不影响功能）| style(share): 统一缩进格式    |
| refactor| 代码重构（非功能/缺陷）  | refactor(ts2md): 优化Markdown模板生成逻辑 |
| test    | 测试用例修改             | test(swagger): 新增枚举类型测试 |
| chore   | 构建/工具链调整          | chore(ci): 优化turbo构建缓存策略 |

#### 作用域（可选）
指定修改涉及的模块，如：`core`（核心引擎）、`cli`（命令行工具）、`trans-swagger`（Swagger转换器）等。

#### 描述要求
- 使用英文小写开头，简洁描述变更内容（不超过50字符）
- 避免技术细节，聚焦用户可见的影响
