import { FinalPayload, ReleasePayload, Releaser } from "@super-trans/core";

export class SwaggerReleaser implements Releaser {
  temp: any[];
  constructor() {
    this.temp = [];
  }

  async collect(payload: ReleasePayload) {
    this.temp.push(payload.result);
  }

  async generate(payload: FinalPayload) {
    return {
      ...payload,
      results: JSON.stringify(this.temp, null, 2),
    };
  }
}
