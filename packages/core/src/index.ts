import { ASTTree } from "./types";
import {
  AsyncParallelHook,
  AsyncSeriesBailHook,
  SyncBailHook,
  SyncHook,
} from "tapable";
// 输入层：加载器抽象类
export abstract class Resolver {
  // TODO Tree存储优化
  abstract resolve(data: any): ASTTree[];
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

export abstract class Plugin {
  abstract apply(_processer: Processer): void;
}

export type ProcessConfig = {
  helper?: any;
  plugins?: Plugin[];
  [index: string]: any;
};

/**
 * 流程管理器
 */
export class Processer {
  hooks: {
    prepare: AsyncSeriesBailHook<any, any>; // 准备阶段，可以预加载一些配置，报错弹出
    resolve: SyncBailHook<any, ASTTree[]>; // 将配置的内容转为 ASTTree，可能会出现多个 ASTTree，报错弹出
    transform: SyncBailHook<ASTTree, any>; // 将单个 ASTTress 转化为想要的内容，同步
    collect: AsyncParallelHook<any, any>; // 单个树转换完触发
    generate: AsyncSeriesBailHook<any, any>; // 所有树处理完后触发
    fail: SyncHook<[Error]>; // 报错
    done: SyncHook<[any]>; // 整个流程结束后触发，在cli 模式中生效
  };

  config: any;
  helper: any;

  constructor(_opts: ProcessConfig) {
    this.hooks = {
      prepare: new AsyncSeriesBailHook(["context"]),
      resolve: new SyncBailHook(["data"]),
      transform: new SyncBailHook(["ast"]),
      collect: new AsyncParallelHook(["result"]),
      generate: new AsyncSeriesBailHook(["final"]),
      done: new SyncHook(["finish"]),
      fail: new SyncHook(["error"]),
    };

    const { plugins, helper, ...config } = _opts;

    if (plugins) {
      plugins.forEach((plugin) => {
        plugin.apply(this);
      });
    }

    this.helper = helper;
    this.config = config;
  }

  // 执行完整流程（支持配置驱动）
  async run(content: any) {
    try {
      // 准备阶段
      const config = await this.hooks.prepare.promise(content);

      // 输入转换
      const astList = this.hooks.resolve.call(config || content);
      if (!astList || !astList.length) {
        throw new Error("Resolve ASTTree is empty");
      }

      // 主转换，并行处理
      await Promise.all(
        astList.map(async (ast: ASTTree): Promise<void> => {
          const transformedResult = this.hooks.transform.call(ast);
          await this.hooks.collect.promise(transformedResult);
        })
      );
      // 输出阶段
      return await this.hooks.generate.promise(astList);
    } catch (err) {
      this.hooks.fail.call(err as Error);
    }
  }
}

export * from "./types";
