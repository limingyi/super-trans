import { readFileSync } from "fs";
import { glob } from "fast-glob";
import { CliConfig } from "./types";
import path from "path";

/**
 * 加载并匹配源文件
 * @param config 配置对象
 * @returns 匹配的文件内容数组（包含路径和内容）
 */
export async function loadSourceFiles(config: CliConfig) {
  const { include, exclude } = config.source;
  // 基础路径（默认当前目录）
  const baseDir = config.context || process.cwd();

  // 标准化include/exclude为数组
  const includes = Array.isArray(include) ? include : include ? [include] : [];
  const excludes = Array.isArray(exclude) ? exclude : exclude ? [exclude] : [];

  // 使用glob匹配文件
  const matchedFiles = await glob(includes, {
    ignore: excludes,
    onlyFiles: true,
    absolute: true,
    cwd: baseDir,
  });

  console.log(`匹配到 ${matchedFiles.length} 个文件：`, matchedFiles);

  // 读取文件内容并返回对象数组
  return matchedFiles.map((filePath) => ({
    path: filePath,
    ...path.parse(filePath),
    content: readFileSync(filePath, "utf-8"),
  }));
}
