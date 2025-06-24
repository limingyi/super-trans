export enum ASTTypes {
  "string" = "string",
  "number" = "number",
  "boolean" = "boolean",
  "object" = "object",
  "array" = "array",
  "enum" = "enum",
  "any" = "any",
  "void" = "void",
  "Function" = "Function",
  "Promise" = "Promise",
}

export type ASTNode = {
  key: string;
  name: string;
  desc: string;
  type: ASTTypes;
  properties?: ASTNode[];
  enums?: {
    label: string;
    value: any;
  }[];
  refer?: ASTNode;
  required?: boolean;
  parent?: ASTNode;
};

export type ASTTree = {
  key: string;
  name: string;
  longname: string;
  desc: string;
  type: "Promise" | "Function";
  args: ASTNode[];
  rsp: ASTNode[];
  config?: { [index: string]: any };
  example?: string;
};
