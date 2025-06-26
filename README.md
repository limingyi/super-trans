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

### 版本发布控制（Changeset）

#### 1. 简介
`changeset` 是用于 Monorepo 多包管理的版本控制工具，支持自动生成版本号、更新依赖关系、生成 CHANGELOG 并发布到 npm，确保多包版本的一致性和可追溯性。

#### 2. 配置步骤
- **安装依赖**：根目录执行 `pnpm add -D @changesets/cli`
- **初始化配置**：执行 `pnpm changeset init` 生成 `.changeset` 目录和 `config.json`
- **配置调整**（可选）：修改 `.changeset/config.json` 自定义发布策略（如关联包版本、忽略包等）

#### 3. 常用命令
| 命令                      | 说明                                      |
|---------------------------|-------------------------------------------|
| `pnpm changeset add`       | 添加版本变更说明（选择受影响包并描述变更）|
| `pnpm changeset version`   | 根据变更生成版本号（更新 package.json）   |
| `pnpm changeset publish`   | 发布更新到 npm（需登录 npm 账号）         |

#### 4. 工作流程
1. 开发完成后执行 `pnpm changeset add`，选择影响的包并填写变更类型（patch/minor/major）
2. 合并到主分支后执行 `pnpm changeset version`，自动更新版本号和依赖
3. 执行 `pnpm changeset publish` 发布到 npm 仓库

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
| refactor|fi 代码重构（非功能/缺陷）  | refactor(ts2md): 优化Markdown模板生成逻辑 |
| test    | 测试用例修改             | test(swagger): 新增枚举类型测试 |
| chore   | 构建/工具链调整          | chore(ci): 优化turbo构建缓存策略 |

#### 作用域（可选）
指定修改涉及的模块，如：`core`（核心引擎）、`cli`（命令行工具）、`trans-swagger`（Swagger转换器）等。

#### 描述要求
- 使用英文小写开头，简洁描述变更内容（不超过50字符）
- 避免技术细节，聚焦用户可见的影响
