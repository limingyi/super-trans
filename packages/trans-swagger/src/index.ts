import { SwaggerReleaser } from "./releaser";
import { SwaggerResolver } from "./resolver";
import { SwaggerTransformer } from "./transformer";
import { Processer, ProcessConfig } from "@super-trans/core";

// TODO 这部分可优化
export default class SwaggerProcesser extends Processer {
  constructor(config: ProcessConfig) {
    const resolver = new SwaggerResolver();
    const transformer = new SwaggerTransformer();
    const releaser = new SwaggerReleaser();

    super({
      resolver,
      transformer,
      releaser,
      config,
    });
  }
}
