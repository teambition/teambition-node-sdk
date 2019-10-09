import TWS from 'tws-auth';

// openapi调用设置
export interface OpenApiOptions {
  appId: string;
  appSecrets: string[];
  apiHost: string; // api 地址, http://teambition.aone.alibaba.net/tb
}

export class ApiClient {
  EXPIRES_DURATION = 72 * 3600;
  protected tws: InstanceType<typeof TWS>;
  protected options: OpenApiOptions;

  constructor(options: OpenApiOptions) {
    this.options = options;

    this.tws = new TWS({ ...options,
      host: options.apiHost,
      timeout: 5000,
    });
  }

  getOptions(): OpenApiOptions {
    return this.options;
  }

  withTenantId(tenantId: string, tenantType?: string): ApiClient {
    const self = Object.create(this);
    self.tws = self.tws.withTenant(tenantId, tenantType);
    return self;
  }

  withHeaders(headers: any): ApiClient {
    const self = Object.create(this);
    self.tws = self.tws.withHeaders(headers);
    return self;
  }

}
