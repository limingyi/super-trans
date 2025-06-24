import { ASTNode } from "@super-trans/core";

// 遍历方法，当返回break 时中断遍历
export type travelFun = (node: ASTNode) => "break" | any;

// 深度优先遍历节点
export function dfsTravel(node: ASTNode, callback: travelFun) {
  if (callback(node) === "break") return;
  if (node.properties) {
    node.properties.forEach((child) => dfsTravel(child, callback));
  }
}

// 广度优先遍历
export function bfsTravel(node: ASTNode, callback: travelFun) {
  const queue: ASTNode[] = [node];
  while (queue.length) {
    const current = queue.shift()!;
    if (callback(current) === "break") return;
    if (current.properties) {
      queue.push(...current.properties);
    }
  }
}
