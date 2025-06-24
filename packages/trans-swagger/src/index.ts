import { SwaggerReleaser } from "./releaser";
import { SwaggerResolver } from "./resolver";
import { SwaggerTransformer } from "./transformer";
import { FormSchema, TableColumn } from "./types";

export { SwaggerResolver, SwaggerTransformer, FormSchema, TableColumn };

export default async function swaggerTrans(swaggerJson: any) {
  const resolver = new SwaggerResolver();
  const transformer = new SwaggerTransformer();
  const releaser = new SwaggerReleaser();

  const astTrees = await resolver.resolve(swaggerJson);

  astTrees.forEach((ast) => {
    const nodes = transformer.parse(ast);
    releaser.collect(nodes);
  });

  return await releaser.generate();
}
