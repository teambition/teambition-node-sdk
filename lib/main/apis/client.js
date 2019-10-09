"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tws_auth_1 = __importDefault(require("tws-auth"));
class ApiClient {
    constructor(options) {
        this.EXPIRES_DURATION = 72 * 3600;
        this.options = options;
        this.tws = new tws_auth_1.default(Object.assign(Object.assign({}, options), { host: options.apiHost, timeout: 5000 }));
    }
    getOptions() {
        return this.options;
    }
    withTenantId(tenantId, tenantType) {
        const self = Object.create(this);
        self.tws = self.tws.withTenant(tenantId, tenantType);
        return self;
    }
    withHeaders(headers) {
        const self = Object.create(this);
        self.tws = self.tws.withHeaders(headers);
        return self;
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaXMvY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQTJCO0FBUzNCLE1BQWEsU0FBUztJQUtwQixZQUFZLE9BQXVCO1FBSm5DLHFCQUFnQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFLM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGtCQUFHLGlDQUFNLE9BQU8sS0FDN0IsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQ3JCLE9BQU8sRUFBRSxJQUFJLElBQ2IsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBZ0IsRUFBRSxVQUFtQjtRQUNoRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FFRjtBQTlCRCw4QkE4QkMifQ==