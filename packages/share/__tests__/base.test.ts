import { isObjectNode, isArrayNode, isEnumNode } from "../src/base";
import { ASTTypes } from "@super-trans/core";

describe("share/base", () => {
  const objectNode = { key: "a", name: "A", desc: "", type: ASTTypes.object };
  const arrayNode = { key: "b", name: "B", desc: "", type: ASTTypes.array };
  const enumNode = { key: "c", name: "C", desc: "", type: ASTTypes.enum, enums: [{ label: "X", value: 1 }] };

  it("isObjectNode", () => {
    expect(isObjectNode(objectNode)).toBe(true);
    expect(isObjectNode(arrayNode)).toBe(false);
  });

  it("isArrayNode", () => {
    expect(isArrayNode(arrayNode)).toBe(true);
    expect(isArrayNode(objectNode)).toBe(false);
  });

  it("isEnumNode", () => {
    expect(isEnumNode(enumNode)).toBe(true);
    expect(isEnumNode(objectNode)).toBe(false);
  });
}); 