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

      // 初始化各转换器
      for (const [trans, tConfig] of Object.entries(config.transformers)) {
        console.time(`转换器：${trans}`);
        const { output, ...transConfig } = tConfig;
        const { default: ProcessClz } = await import(trans);
        const helper = new OutputHepler(output, config);
        const processer = new ProcessClz({
          ...transConfig,
          helper,
        }) as Processer;

        // 处理每个文件
        for (const { content, ...input } of sourceFiles) {
          console.time(`转换文件：${input.name}`);
          // 准备阶段
          const rPayload = await processer.hooks.prepare.promise({
            content,
            config: {
              input,
              output: {
                path: helper.dist,
                ...output,
              },
              ...transConfig,
            },
          });

          // 运行
          const fPayload = await processer.run(rPayload);

          // 保存结果
          if (fPayload && fPayload.results) {
            helper.addFileToDist(
              fPayload.config?.distFileName || "result.js",
              fPayload.results
            );
          }
          console.timeEnd(`转换文件：${input.name}`);
        }

        // 所有文件处理完成
        processer.hooks.done.call();
        console.timeEnd(`转换器：${trans}`);
        console.log(`[${trans}] 处理完 ${sourceFiles.length} 个文件`);
      }
    } catch (error) {
      console.error("全局转换失败：", error);
      process.exit(1);
    }
  });

program.parse(process.argv);
