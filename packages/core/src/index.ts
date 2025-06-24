import { ASTTree } from "./types";
// 输入层：加载器抽象类
export abstract class Resolver {
  abstract resolve(data: any): Promise<ASTTree[]>;
}

// 转换层：转换器抽象类
export abstract class Transformer {
  abstract parse(ast: ASTTree): any;
}

// 输出层：发布器抽象类
export abstract class Releaser {
  abstract collect(result: any): Promise<any>;
  abstract generate(output?: any): Promise<any>;
}

// 核心处理器，串联三层
export abstract class Processer {
  // 执行完整流程
  abstract run(content: any): any;
}

// 配置
export type CoreConfig = {
  resolver: Resolver;
  transformer: Transformer;
  releaser: Releaser;
};

// 核心处理器默认的实现
export class CoreProcesser implements Processer {
  resolver: Resolver;
  transformer: Transformer;
  releaser: Releaser;

  constructor(config: CoreConfig) {
    this.resolver = config.resolver;
    this.transformer = config.transformer;
    this.releaser = config.releaser;
  }

  // 执行完整流程（支持配置驱动）
  async run(content: any) {
    // 输入阶段
    const astList = await this.resolver.resolve(content);

    // 转换阶段
    astList.forEach((ast) => {
      this.releaser.collect(this.transformer.parse(ast));
    });

    // 输出阶段
    this.releaser.generate();
  }
}

export * from "./types";
