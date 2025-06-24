## 项目概述 ​

- ​ 目标 ​：构建一个基于 AST 的万能转换核心（@super-trans/core），实现任意文本 ↔ AST 树 ↔ 任意文本的双向转换，并通过模块化设计支持扩展（如 Swagger 转 Ant Design 配置）。

## ​ 核心特点 ​：

- ​ 分层架构 ​：输入层 → 转换层 → 输出层
- ​ 跨环境支持 ​：Node.js 与浏览器环境兼容
- ​ 可扩展性 ​：通过 Hook 机制扩展各层逻辑
- ​ 多包管理 ​：基于 Monorepo 组织核心包、工具包、示例包

## 技术栈：

| 工具       | 用途                            |
| ---------- | ------------------------------- |
| pnpm       | 包管理及 Workspace 支持         |
| turbo      | 多包任务管理（构建/测试）       |
| tsup       | TypeScript 构建（支持 ESM/CJS） |
| changeset  | 多包版本控制与发布              |
| TypeScript | 核心开发语言                    |

## 目录结构 ​：

super-trans/  
├── packages/  
│ ├── cli/ # 命令行：@super-trans/cli  
│ ├── share/ # 基础工具包：@super-trans/share  
│ ├── core/ # 核心转换层：@super-trans/core  
│ ├── trans-swagger/ # Swagger 转换器：@super-trans/trans-swagger  
│ ├── trans-ts2md/ # 将 API 的 TS 声明转换为 Markdown 文档：@super-trans/trans-ts2md  
│ └── playground/ # 功能演示：playground  
├── package.json  
└── tsconfig.json # 全局配置

## 功能模块

### 基础工具包 (@super-trans/share)​​

- 主要职责 ​：提供通用工具函数
  - 遍历方法 ​：深度优先/广度优先 AST 遍历
  - 类型判断 ​：校验 AST 节点数据类型（object/array/enum 等）
  - 通用渲染 ​：
    - 从 desc 中提取枚举信息
    - 从 desc 中提取参数信息

### 核心转换引擎 (@super-trans/core)​​

- 抽象类 Resolver 加载器，功能：
  - resolve 负责加载输入内容并转换为 AST 树；
- 抽象类 Transformer 转换器，功能：
  - parse 将 AST 树转换为目标内容；
- 抽象类 Releaser 发布器，功能：

  - collect 收集转换结果
  - generate 生成最终结果

- 抽象类 Processer 处理器，串联编译流程，并使用 tapable 支持 Hooks 扩展

#### AST 数据结构：

```typescript
type ASTTree = {
  key: string; // 接口英文标识
  name: string; // 接口中文名称
  longname: string; // 接口全路径
  desc: string; // 描述-汉字
  type: "Promise" | "Function"; // 接口类型
  args: ASTNode[]; // 输入参数
  rsp: ASTNode[]; // 返回值
  example?: string; // 调用示例
  config?: { [index: string]: any }; // 接口配置信息
};

enum ASTTypes {
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "enum",
  "any",
  "void",
  "Function",
  "Promise",
}

type ASTNode = {
  key: string; // 英文标识（e.g. `userName`）
  name: string; // 中文名称（e.g. "用户名"）
  desc: string; // 字段描述
  type: ASTTypes;
  properties?: ASTNode[]; // 子属性（对象/数组时使用）
  enums?: {
    // 枚举值
    label: string;
    value: any;
  }[];
  refer?: ASTNode; // 引用类型
  required?: boolean; // 是否必填
  parent?: ASTNode; // 指向父节点
};
```

### 命令行处理 (@super-trans/cli)​​

- 命令行工具，负责代码/配置的解析、转换与构建流程调度。

- 工作流：

  - 读取、解析、合并配置信息
  - 读取源文件
  - 应用转换器
  - 输出写入到目标文件

- 工作流说明：

  - 文件读取部分是同一个
  - 每个转换器 transformer 对应一个任务
  - 每个转换器的 plugins 提取初始化
  - 每个 plugin 能拿到读取源文件的所有流程钩子，包括：
    - 源文件遍历前
    - 源文件开始遍历
    - 单个文本 转换成 AST 前、后
    - 单个 AST 转换成 目标内容 前、后
    - 转换结果输出前（可进行文件合并及其他文件操作）
    - 转换结果输出后

- 命令行：npx super-trans

  - --config 配置文件，默认 trans.config.json
  - --help 查看帮助信息

- 配置文件说明：

  ```json
  {
    "context": "string", // 基础路径（用于解析相对路径）
    "source": {
      "include": "string[]", // 必填，源码扫描路径（如 `["src/​**​/*.ts"]`）
      "exclude": "string[]" // 可选，排除路径（如 `["​**​/test/*"]`）
    },
    "transformers": {
      // 转换器插件配置
      "@super-trans/trans-swagger": {
        "output": "string", // 输出目录（必填）
        "plugins": "any[]" // 可选，插件扩展列表
      }
    }
  }
  ```

### 演示工程 (playground)​​

#### 功能 ​：

- 提供 Web 界面验证转换流程
- 支持输入 Swagger JSON 并实时预览转换结果
- 可切换转换器：
  - @super-trans/trans-swagger
  - @super-trans/trans-ts2md
- 启动命令：npm run dev

### Swagger 转换器 (@super-trans/trans-swagger)​​

#### ​ 输入层 ​：

- 实现 @super-trans/core 中的 Transformer 类
- 解析 Swagger OpenAPI 3.0 规范 → 生成标准 AST 树

#### ​ 转换层：

- 深度优先遍历 AST 树
- 关键转换逻辑 ​：
  - args → FormSchema[]（表单配置）
  - rsp → TableColumn[]（表格列配置）

#### 数据结构：

```typescript
// 表单配置
type FormSchema = {
  label: string; // 字段说明（e.g. "用户名"）
  field: string; // 字段标识（e.g. `userName`）
  component:
    | "Input" // 组件类型
    | "Select"
    | "DatePicker";
  componentProps: any; // 组件属性（e.g. `options` 绑定 `enum`）
  required: boolean; // 是否必填
};

// 表格列配置
type TableColumn = {
  title: string; // 列标题
  dataIndex: string; // 字段标识
  format?: string; // 格式化（e.g. "date:YYYY-MM-DD"）
};
```

#### 输出层：

- 控制台打印结果
- 支持 API 调用：

```typescript
import swaggerTrans from "@super-trans/trans-swagger";
const result = swaggerTrans(swaggerJson);
```

4. TS-API 转换器 (@super-trans/trans-ts2md)​​

#### 功能：

- 实现 @super-trans/core 中的 Transformer 类
- 将 API 接口的 TS 声明转换为 Markdown 文档

#### ​ 输入层 ​：

- 解析 API 的 TS 代码及对应 JSdoc → 生成标准 AST 树

#### ​ 转换层：

- 深度优先遍历 AST 树
- 输出 markdonw 文档模版：

  ```markdown
  ### 接口

  - ASTTree.longname

  ### 功能说明

  - ASTTree.desc

  ### 调用示例

  - ASTTree.example

  ### 输入说明

  - ASTTree.args

  | 字段 | 类型 | 是否必填 | 说明 |
  | ---- | ---- | -------- | ---- |

  ### 输出说明

  - ASTTree.rsp

  | 字段 | 类型 | 说明 |
  | ---- | ---- | ---- |
  ```

#### 输出层：

### 关键设计亮点 ​

1. ​ 抽象核心层 ​：@super-trans/core 不绑定具体转换逻辑，通过子类实现扩展（如 trans-swagger）。
2. ​ 环境兼容 ​：输入层分离文件读取（Node）与文本处理（Browser），避免环境耦合。
3. ​ 标准化 AST​：统一结构支持跨格式转换（Swagger/表单/表格等）。
4. 开箱即用 ​：trans-swagger 同时提供 CLI 和 API 调用方式，适配不同场景。
