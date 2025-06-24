import { ASTNode } from "@super-trans/core";

// 类型判断工具
export function isObjectNode(node: ASTNode): boolean {
  return node.type === "object";
}

/** 是否是数组节点 */
export function isArrayNode(node: ASTNode): boolean {
  return node.type === "array";
}

/** 是否是枚举节点 */
export function isEnumNode(node: ASTNode): boolean {
  return !!(node.type === "enum" && node.enums?.length);
}
