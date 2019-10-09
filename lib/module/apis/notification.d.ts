import { AppNotificationRule, IncreaseUnreadCountOptions } from '../types/notification';
import { ApiClient, OpenApiOptions } from './client';
export declare class NotificationApi extends ApiClient {
    urlPrefix: string;
    constructor(options: OpenApiOptions);
    withTenantId(tenantId: string, tenantType?: string): NotificationApi;
    withHeaders(headers: any): ApiClient;
    postNotification(body: IncreaseUnreadCountOptions): Promise<{
        message: string;
    }>;
    getAppNotificationRule(_appId: string): Promise<any>;
    postAppNotificationRule(_appId: string, data: AppNotificationRule): Promise<any>;
}
