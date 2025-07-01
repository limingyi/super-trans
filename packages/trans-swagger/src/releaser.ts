import { FinalPayload, ReleasePayload, Releaser } from "@super-trans/core";

export class SwaggerReleaser implements Releaser {
  temp: any[];
  constructor() {
    this.temp = [];
  }

  async clear() {
    this.temp = [];
  }

  async collect(payload: ReleasePayload) {
    this.temp.push(payload.result);
  }

  async generate(payload: FinalPayload) {
    payload.config.distFileName = `${payload.config?.input?.name || 'res'}.js`;
    return {
      ...payload,
      results: JSON.stringify(this.temp, null, 2),
    };
  }
}
