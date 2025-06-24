import { Command } from "commander";
import { readFile } from "fs/promises";
import { CliConfig } from "./types";

const program = new Command();

program
  .name("super-trans")
  .description("符合新规则的万能转换工具，支持多转换器扩展")
  .version("2.0.0")
  .option("-c, --config <path>", "配置文件路径", "trans.config.json")
  .action(async (options) => {
    try {
      // 1. 读取并解析配置
      const configContent = await readFile(options.config, "utf-8");
      const config = JSON.parse(configContent) as CliConfig;

      // 2. 初始化各转换器（支持多转换器任务）
      for (const [trans, transConfig] of Object.entries(config.transformers)) {
        // 动态加载转换器插件
        // TODO 这里如何加载插件
        const { default: processorFun } = await import(trans);
        const processer = processorFun(transConfig);

        // TODO 这里如何执行插件
        await processer.run({
          source: config.source,
          output: transConfig.output,
        });

        console.log(`[${trans}] 转换成功，输出至：${transConfig.output}`);
      }
    } catch (error) {
      console.error("全局转换失败：", error);
      process.exit(1);
    }
  });

program.parse();
