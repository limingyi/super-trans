import SwaggerTrans from "../src/index";

describe("trans-swagger", () => {
  it("swaggerTrans 应能正确生成 AST", () => {
    // 伪造一个最小 Swagger JSON 示例
    const swaggerJson = {
      openapi: "3.0.0",
      info: { title: "Test API", version: "1.0.0" },
      paths: {},
      components: {}
    };
    const swagger = new SwaggerTrans();
    const result = swagger.runByContent(swaggerJson);
    expect(result).toBeDefined();
    // 可根据实际 AST 结构补充断言
  });
}); 