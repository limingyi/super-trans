import { Plugin } from "@super-trans/core";
import { OutputHepler } from "./helper";
export { Processer } from "@super-trans/core";

export type OutputConfig = {
  dist: string;
};

export type TransformerConfig = {
  output: OutputConfig; // 输出目录（必填）
  plugins?: Plugin[]; // 可选，插件扩展列表
  helper?: OutputHepler;
};

export type CliConfig = {
  context: string; // 基础路径（用于解析相对路径）
  source: {
    include: string | string[]; // 必填，源码扫描路径（如 `["src/​**​/*.ts"]`）
    exclude: string | string[]; // 可选，排除路径（如 `["**​/test/*"]`）
  };
  transformers: {
    // 转换器插件配置
    [transformer: string]: TransformerConfig;
  };
};
