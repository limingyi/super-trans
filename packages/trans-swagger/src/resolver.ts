import { ASTTree, ASTNode, ASTTypes, Resolver } from "@super-trans/core";
import {
  OpenAPIDocument,
  OpenAPIOperation,
  SwaggerTypes,
  OpenAPISchemaObject,
  OpenAPIComponent,
} from "./types";

import { renderDesc } from "@super-trans/share";

function mapSwaggerType(swaggerType?: SwaggerTypes): ASTTypes {
  const typeMap: { [key: string]: ASTTypes } = {
    string: ASTTypes.string,
    number: ASTTypes.number,
    boolean: ASTTypes.boolean,
    object: ASTTypes.object,
    array: ASTTypes.array,
    any: ASTTypes.any,
  };
  return typeMap[swaggerType || "any"] || ASTTypes.any;
}

function parseSchema(
  key: string,
  schema: OpenAPISchemaObject,
  components: any,
  required: boolean = false
): ASTNode {
  let type = mapSwaggerType(schema.type);
  if (schema.$ref) {
    type = ASTTypes.object;
    schema = components[schema.$ref.replace("#/components/schemas/", "")];
  }
  // 预渲染
  const { title, enums } = renderDesc(schema.description || "");
  const node: ASTNode = {
    key,
    name: title || key,
    desc: schema.description || "",
    type: type,
    required,
    enums,
  };
  if (type === "object" && schema.properties) {
    node.properties = Object.entries(schema.properties).map(
      ([k, v]: [string, any]) =>
        parseSchema(k, v, components, schema.required?.includes(k))
    );
  }

  // 处理数组
  if (type === "array" && schema.items) {
    node.properties = [parseSchema(key + "[]", schema.items, components)];
  }

  // 处理枚举
  if (!node.enums && schema.enum) {
    node.enums = schema.enum.map((v: any) => ({ label: String(v), value: v }));
  }
  return node;
}

export class SwaggerResolver implements Resolver {
  constructor() {}

  renderArgs(info: OpenAPIOperation, components: OpenAPIComponent): ASTNode[] {
    const args: ASTNode[] = [];
    const { parameters, requestBody: body } = info;

    parameters?.forEach((p: any) => {
      args.push(parseSchema(p.name, p.schema || {}, components, p.required));
    });

    if (body) {
      const content = body.content && Object.values(body.content)[0];
      if (content && content.schema) {
        args.push(parseSchema("body", content.schema, components));
      }
    }
    return args;
  }

  renderRsp(info: OpenAPIOperation, components: OpenAPIComponent): ASTNode[] {
    const rsps: ASTNode[] = [];
    if (info.responses) {
      Object.keys(info.responses).forEach((code) => {
        const rsp = info.responses[code];
        const content = rsp.content && Object.values(rsp.content)[0];
        if (content && content.schema) {
          rsps.push(parseSchema(code, content.schema, components));
        }
      });
    }
    return rsps;
  }

  async resolve(swaggerJson: OpenAPIDocument): Promise<ASTTree[]> {
    const trees: ASTTree[] = [];

    Object.keys(swaggerJson.paths).forEach((path) => {
      Object.keys(swaggerJson.paths[path]).forEach((method) => {
        const methodInfo = swaggerJson.paths[path][method];
        trees.push({
          key: path,
          name: methodInfo.description || "",
          longname: `${path}.${method}`,
          desc: methodInfo.summary || "",
          type: "Function",
          args: this.renderArgs(methodInfo, swaggerJson.components?.schemas!),
          rsp: this.renderRsp(methodInfo, swaggerJson.components?.schemas!),
        });
      });
    });

    return trees;
  }
}
