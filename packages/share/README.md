# @super-trans/share

## 简介
基础工具包，提供AST遍历、类型判断、通用渲染等通用工具函数，服务于核心转换引擎及各业务转换器。

## 功能特性
- **AST遍历**：支持深度优先/广度优先遍历算法
- **类型判断**：校验AST节点类型（object/array/enum等）
- **通用渲染**：从节点描述中提取枚举值、参数信息

## 安装
```bash
pnpm add @super-trans/share
```

## 使用示例
### 深度优先遍历AST树
```typescript
import { dfsTraverse } from '@super-trans/share';

const ast = { /* AST节点结构 */ };
const result = dfsTraverse(ast, (node) => {
  if (node.type === 'enum') {
    console.log('枚举节点:', node.enums);
  }
});
```

### 类型校验
```typescript
import { isObjectNode } from '@super-trans/share';

if (isObjectNode(astNode)) {
  console.log('对象节点属性:', astNode.properties);
}
```