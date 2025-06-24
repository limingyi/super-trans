import { Transformer, ASTTree, ASTTypes } from "@super-trans/core";
import { dfsTravel } from "@super-trans/share";
import { FormSchema, TableColumn } from "./types";

export class SwaggerTransformer implements Transformer {
  constructor() {}

  parse(ast: ASTTree): {
    formSchema: FormSchema[];
    tableColumns: TableColumn[];
  } {
    const formSchema: FormSchema[] = [];
    const tableColumns: TableColumn[] = [];

    // 转换输入参数到表单配置
    ast.args?.forEach((arg) => {
      dfsTravel(arg, (node) => {
        if (node.type === ASTTypes.object || node.type === ASTTypes.array)
          return;
        formSchema.push({
          label: node.name,
          field: node.key,
          component: this.getComponentByType(node.type),
          componentProps: node.enums ? { options: node.enums } : {},
          required: node.required || false,
        });
      });
    });

    // 转换返回值到表格列配置
    ast.rsp?.forEach((rsp) => {
      dfsTravel(rsp, (node) => {
        if (node.type === ASTTypes.object || node.type === ASTTypes.array)
          return;
        tableColumns.push({
          title: node.name,
          dataIndex: node.key,
        });
      });
    });

    return { formSchema, tableColumns };
  }

  private getComponentByType(type: ASTTypes): FormSchema["component"] {
    switch (type) {
      case ASTTypes.enum:
        return "Select";
      case ASTTypes.string:
        return "Input";
      case ASTTypes.number:
        return "InputNumber";
      default:
        return "Input";
    }
  }
}
