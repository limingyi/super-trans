# @super-trans/trans-swagger

## 简介
Swagger转换器，实现OpenAPI 3.0规范解析 → 标准AST树 → Ant Design表单/表格配置的双向转换。

## 功能特性
- **输入层**：解析Swagger JSON/yml文件生成AST树
- **转换层**：AST树→FormSchema（表单配置）、AST树→TableColumn（表格列配置）
- **输出层**：支持CLI命令输出和API调用返回

## 安装
```bash
pnpm add @super-trans/trans-swagger
```

## 使用示例
### CLI方式
```bash
npx super-trans --config trans.config.json
# 配置文件中指定trans-swagger输出目录
```

### API方式
```typescript
import swaggerTrans from '@super-trans/trans-swagger';

const swaggerJson = { /* OpenAPI 3.0文档 */ };
const { formSchema, tableColumns } = swaggerTrans(swaggerJson);

// 表单配置示例
console.log(formSchema);
// [{
//   label: "用户名",
//   field: "userName",
//   component: "Input",
//   required: true
// }]

// 表格列配置示例
console.log(tableColumns);
// [{
//   title: "用户ID",
//   dataIndex: "userId",
//   format: "int64"
// }]
```