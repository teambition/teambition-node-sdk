"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const client_1 = require("./client");
class NotificationApi extends client_1.ApiClient {
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
    postNotification(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tws.post(`${this.urlPrefix}/v1/notifications`, body);
                return data;
            }
            catch (error) {
                throw types_1.Result.exception(`Create Notification error: ${error}`);
            }
        });
    }
    // GET /soa/v1/app-rule
    getAppNotificationRule(_appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tws.get(`${this.urlPrefix}/v1/app-rule?appId=${_appId}`);
                return data;
            }
            catch (error) {
                throw types_1.Result.exception(`get app notification rule error: ${error}`);
            }
        });
    }
    // POST /soa/v1/app-rule
    postAppNotificationRule(_appId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.tws.post(`${this.urlPrefix}/v1/app-rule?appId=${_appId}`, data);
            }
            catch (error) {
                throw types_1.Result.exception(`post app notification rule error: ${error}`);
            }
        });
    }
}
exports.NotificationApi = NotificationApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaXMvbm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsb0NBQWtDO0FBRWxDLHFDQUFxRDtBQUVyRCxNQUFhLGVBQWdCLFNBQVEsa0JBQVM7SUFFNUMsWUFBWSxPQUF1QjtRQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFGakIsY0FBUyxHQUFHLGdCQUFnQixDQUFDO0lBRzdCLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBZ0IsRUFBRSxVQUFtQjtRQUNoRCxPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBb0IsQ0FBQztJQUNyRSxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQVk7UUFDdEIsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBb0IsQ0FBQztJQUN2RCxDQUFDO0lBRUQsd0JBQXdCO0lBQ2xCLGdCQUFnQixDQUFFLElBQWdDOztZQUN0RCxJQUFJO2dCQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQXNCLEdBQUcsSUFBSSxDQUFDLFNBQVMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2xHLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLGNBQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDL0Q7UUFDSCxDQUFDO0tBQUE7SUFFRCx1QkFBdUI7SUFDakIsc0JBQXNCLENBQUMsTUFBYzs7WUFDekMsSUFBSTtnQkFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsc0JBQXNCLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ3RGLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZixNQUFNLGNBQU0sQ0FBQyxTQUFTLENBQUMsb0NBQW9DLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDcEU7UUFDSCxDQUFDO0tBQUE7SUFFRCx3QkFBd0I7SUFDbEIsdUJBQXVCLENBQUMsTUFBYyxFQUFFLElBQXlCOztZQUNyRSxJQUFJO2dCQUNGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxzQkFBc0IsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDbEY7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLGNBQU0sQ0FBQyxTQUFTLENBQUMscUNBQXFDLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDdEU7UUFDSCxDQUFDO0tBQUE7Q0FFRjtBQTNDRCwwQ0EyQ0MifQ==