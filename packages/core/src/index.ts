import { ASTTree } from "./types";
import {
  AsyncParallelHook,
  AsyncSeriesWaterfallHook,
  SyncHook,
  SyncWaterfallHook,
} from "tapable";

export type ResolvePayload = {
  config?: { [index: string]: any };
  content?: any; // 内容
  asts?: ASTTree[];
};
// 输入层：加载器抽象类
export abstract class Resolver {
  // TODO Tree存储优化
  abstract resolve(payload: ResolvePayload): ResolvePayload;
}

export type ReleasePayload = {
  config?: { [index: string]: any };
  result?: any; // 内容
  ast?: ASTTree;
};

// 转换层：转换器抽象类
export abstract class Transformer {
  abstract parse(ast: ReleasePayload): ReleasePayload;
}

export type FinalPayload = {
  config?: { [index: string]: any };
  results?: string; // 最终内容
};
// 输出层：发布器抽象类
export abstract class Releaser {
  abstract collect(payload: ReleasePayload): Promise<void>;
  abstract generate(payLoad: FinalPayload): Promise<FinalPayload>;
}

export abstract class Plugin {
  abstract apply(_processer: Processer): void;
}

export type ProcessConfig = {
  helper?: any;
  plugins?: Plugin[];
  [index: string]: any;
};

export type ProcessOptions = {
  config?: ProcessConfig;
  resolver?: Resolver;
  transformer?: Transformer;
  releaser?: Releaser;
};

/**
 * 流程管理器
 */
export class Processer {
  hooks: {
    prepare: AsyncSeriesWaterfallHook<ResolvePayload>; // 准备阶段，异步串行，前一个的返回做为下一个的输入
    resolve: SyncWaterfallHook<ResolvePayload>; // 将配置的内容转为 ASTTree，可能会出现多个 ASTTree，同步串行，前一个回调的返回值作为下一个回调的输入
    transform: SyncWaterfallHook<ReleasePayload>; // 将单个 ASTTress 转化为想要的内容，同步串行，前一个回调的返回值作为下一个回调的输入
    collect: AsyncParallelHook<ReleasePayload>; // 处理单个树转换后的信息，异步并行，同时执行所有回调
    generate: AsyncParallelHook<FinalPayload>; // 所有树处理完后触发，异步并行，同时执行所有回调
    // 两种 generate ，一种返回值，一种并行处理不管返回值
    fail: SyncHook<Error>; // 报错
    done: SyncHook<any>; // 整个流程结束后触发，在cli 模式中生效
  };

  resolver?: Resolver;
  transformer?: Transformer;
  releaser?: Releaser;

  config: any;
  helper?: any;

  constructor(_opts: ProcessOptions) {
    this.hooks = {
      prepare: new AsyncSeriesWaterfallHook(["content"]),
      resolve: new SyncWaterfallHook(["data"]),
      transform: new SyncWaterfallHook(["ast"]),
      collect: new AsyncParallelHook(["result"]),
      generate: new AsyncParallelHook(["final"]),
      done: new SyncHook(["finish"]),
      fail: new SyncHook(["error"]),
    };

    const { config, resolver, transformer, releaser } = _opts;
    const { helper, plugins, ...rest } = config || {};

    this.resolver = resolver;
    this.transformer = transformer;
    this.releaser = releaser;

    // 实例化插件
    if (plugins) {
      plugins.forEach((plugin) => {
        plugin.apply(this);
      });
    }

    // 其他
    this.helper = helper;
    this.config = rest;
  }

  // 执行完整流程（支持配置驱动）
  async run(content: any) {
    try {
      const payload: ResolvePayload = {
        config: this.config,
        content,
      };
      // 准备阶段
      const prepare = await this.hooks.prepare.promise(payload);

      // 输入转换
      const defPrepare = this.resolver?.resolve(prepare);
      const resolve = this.hooks.resolve.call(defPrepare || prepare);
      const { asts: astList, config } = resolve;

      if (!astList || !astList.length) {
        throw new Error("Resolve ASTTree is empty");
      }

      // 主转换，并行处理
      await Promise.all(
        astList.map(async (ast: ASTTree): Promise<void> => {
          const payload: ReleasePayload = { config, ast };
          const defPayload = this.transformer?.parse(payload);
          const result = this.hooks.transform.call(defPayload || payload);

          // 收集
          await this.releaser?.collect(result);
          await this.hooks.collect.promise(result);
        })
      );

      // 输出阶段
      const finalPayload: ReleasePayload = { config };
      const final = await this.releaser?.generate(finalPayload);
      await this.hooks.generate.promise(final || finalPayload);
      return final;
    } catch (err) {
      this.hooks.fail.call(err as Error);
    }
  }
}

export * from "./types";
