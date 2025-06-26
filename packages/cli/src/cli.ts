import { program } from "commander";
import { readFileSync } from "fs";
import path from "path";
import { CliConfig, Processer } from "./types";
import { loadSourceFiles } from "./source";
import { OutputHepler } from "./helper";

program
  .description("符合新规则的万能转换工具，支持多转换器扩展")
  .option("-c, --config <path>", "配置文件路径", "./trans.config.json")
  .action(async (options) => {
    try {
      const configPath = path.resolve(options.config);

      // 1. 读取并解析配置
      const configContent = readFileSync(configPath, "utf-8");
      const config = JSON.parse(configContent) as CliConfig;

      // 加载源文件
      const sourceFiles = await loadSourceFiles(config);
      // 处理每个文件
      for (const { path: filePath, content } of sourceFiles) {
        // 初始化各转换器
        for (const [trans, tConfig] of Object.entries(config.transformers)) {
          const { output, ...transConfig } = tConfig;
          const { default: ProcessClz } = await import(trans);
          const helper = new OutputHepler(output, config);
          transConfig.helper = helper;
          const processer = new ProcessClz(transConfig) as Processer;
          const result = await processer.run(JSON.parse(content));

          // 结果缓存目标
          await helper.addFileToDist(
            "result.js",
            JSON.stringify(result, null, 2)
          );

          processer.hooks.done.call(result);

          console.log(
            `[${trans}] 处理文件 ${filePath} 完成，输出至：${output.dist}`
          );
        }
      }
    } catch (error) {
      console.error("全局转换失败：", error);
      process.exit(1);
    }
  });

program.parse(process.argv);
