import TWS from 'tws-auth';
export interface OpenApiOptions {
    appId: string;
    appSecrets: string[];
    apiHost: string;
}
export declare class ApiClient {
    EXPIRES_DURATION: number;
    protected tws: InstanceType<typeof TWS>;
    protected options: OpenApiOptions;
    constructor(options: OpenApiOptions);
    getOptions(): OpenApiOptions;
    withTenantId(tenantId: string, tenantType?: string): ApiClient;
    withHeaders(headers: any): ApiClient;
}
