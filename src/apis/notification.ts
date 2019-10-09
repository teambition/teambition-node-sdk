import { Result } from '../types';
import { AppNotificationRule, IncreaseUnreadCountOptions } from '../types/notification';
import { ApiClient, OpenApiOptions } from './client';

export class NotificationApi extends ApiClient {
  urlPrefix = '/notifications';
  constructor(options: OpenApiOptions) {
    super(options);
  }

  withTenantId(tenantId: string, tenantType?: string): NotificationApi {
    return super.withTenantId(tenantId, tenantType) as NotificationApi;
  }

  withHeaders(headers: any): ApiClient {
    return super.withHeaders(headers) as NotificationApi;
  }

  // /soa/v1/notifications
  async postNotification (body: IncreaseUnreadCountOptions) {
    try {
      const data = await this.tws.post<{ message: string }>(`${this.urlPrefix}/v1/notifications`, body);
      return data;
    } catch (error) {
      throw Result.exception(`Create Notification error: ${error}`);
    }
  }

  // GET /soa/v1/app-rule
  async getAppNotificationRule(_appId: string) {
    try {
      const data = await this.tws.get<any>(`${this.urlPrefix}/v1/app-rule?appId=${_appId}`);
      return data;
    } catch (error) {
     throw Result.exception(`get app notification rule error: ${error}`);
    }
  }

  // POST /soa/v1/app-rule
  async postAppNotificationRule(_appId: string, data: AppNotificationRule) {
    try {
      return this.tws.post<any>(`${this.urlPrefix}/v1/app-rule?appId=${_appId}`, data);
    } catch (error) {
      throw Result.exception(`post app notification rule error: ${error}`);
    }
  }

}
