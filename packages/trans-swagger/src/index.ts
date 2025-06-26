import { SwaggerReleaser } from "./releaser";
import { SwaggerResolver } from "./resolver";
import { SwaggerTransformer } from "./transformer";
import { Processer, Plugin, ProcessConfig } from "@super-trans/core";

class SwaggerPlugin implements Plugin {
  apply(_processer: Processer) {
    const { hooks } = _processer;
    const resolver = new SwaggerResolver();
    const transformer = new SwaggerTransformer();
    const releaser = new SwaggerReleaser();

    hooks.resolve.tap("resolve", (data) => resolver.resolve(data));
    hooks.transform.tap("transform", (ast) => transformer.parse(ast));
    hooks.collect.tapPromise("collect", (result) => releaser.collect(result));
    hooks.generate.tapPromise("generate", () => releaser.generate());
  }
}
// TODO 这部分可优化
export default class SwaggerProcesser extends Processer {
  constructor(config?: ProcessConfig) {
    super({
      plugins: [new SwaggerPlugin(), ...(config?.plugins || [])],
    });
  }
}
