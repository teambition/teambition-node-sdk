import { Result } from '../types';
import { ApiClient } from './client';
export class NotificationApi extends ApiClient {
    constructor(options) {
        super(options);
        this.urlPrefix = '/notifications';
    }
    withTenantId(tenantId, tenantType) {
        return super.withTenantId(tenantId, tenantType);
    }
    withHeaders(headers) {
        return super.withHeaders(headers);
    }
    // /soa/v1/notifications
    async postNotification(body) {
        try {
            const data = await this.tws.post(`${this.urlPrefix}/v1/notifications`, body);
            return data;
        }
        catch (error) {
            throw Result.exception(`Create Notification error: ${error}`);
        }
    }
    // GET /soa/v1/app-rule
    async getAppNotificationRule(_appId) {
        try {
            const data = await this.tws.get(`${this.urlPrefix}/v1/app-rule?appId=${_appId}`);
            return data;
        }
        catch (error) {
            throw Result.exception(`get app notification rule error: ${error}`);
        }
    }
    // POST /soa/v1/app-rule
    async postAppNotificationRule(_appId, data) {
        try {
            return this.tws.post(`${this.urlPrefix}/v1/app-rule?appId=${_appId}`, data);
        }
        catch (error) {
            throw Result.exception(`post app notification rule error: ${error}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaXMvbm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbEMsT0FBTyxFQUFFLFNBQVMsRUFBa0IsTUFBTSxVQUFVLENBQUM7QUFFckQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsU0FBUztJQUU1QyxZQUFZLE9BQXVCO1FBQ2pDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUZqQixjQUFTLEdBQUcsZ0JBQWdCLENBQUM7SUFHN0IsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQixFQUFFLFVBQW1CO1FBQ2hELE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFvQixDQUFDO0lBQ3JFLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBWTtRQUN0QixPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFvQixDQUFDO0lBQ3ZELENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFFLElBQWdDO1FBQ3RELElBQUk7WUFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFzQixHQUFHLElBQUksQ0FBQyxTQUFTLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xHLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUMvRDtJQUNILENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsS0FBSyxDQUFDLHNCQUFzQixDQUFDLE1BQWM7UUFDekMsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxzQkFBc0IsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUN0RixPQUFPLElBQUksQ0FBQztTQUNiO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZixNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxNQUFjLEVBQUUsSUFBeUI7UUFDckUsSUFBSTtZQUNGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxzQkFBc0IsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbEY7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUN0RTtJQUNILENBQUM7Q0FFRiJ9