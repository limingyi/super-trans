import { Releaser } from "@super-trans/core";

export class SwaggerReleaser implements Releaser {
  temp: any[];
  constructor() {
    this.temp = [];
  }

  async collect(result: any) {
    this.temp.push(result);
  }

  async generate() {
    return this.temp;
  }
}
