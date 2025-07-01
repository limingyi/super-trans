import fs from "fs";
import { CliConfig, OutputConfig } from "./types";
import path from "path";

function toAbsPath(filePath: string, context: string) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(context, filePath);
}

export class OutputHepler {
  dist: string;

  constructor(config: OutputConfig, cliConfig: CliConfig) {
    const baseurl = cliConfig.context || process.cwd();
    this.dist = toAbsPath(config.dist || ".", baseurl);
  }

  addFile(dist: string, content: string) {
    const stream = fs.createWriteStream(dist);
    return new Promise((resolve, reject) => {
      stream.write(content, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  async addFileToDist(name: string, content: string) {
    const filePath = path.join(this.dist, name);
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist, { recursive: true });
    }
    return await this.addFile(filePath, content);
  }
}
