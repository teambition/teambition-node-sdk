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
const client_1 = require("./client");
class UserApi extends client_1.ApiClient {
    constructor(options) {
        super(options);
        this.urlPrefix = '/user';
        this.options = options;
    }
    withTenantId(tenantId, tenantType) {
        return super.withTenantId(tenantId, tenantType);
    }
    withHeaders(headers) {
        return super.withHeaders(headers);
    }
    /**
     * 按cookie获取用户
     * @param context
     * @param sessionId
     * @param sessionSig
     */
    getUserByCookie(sessionId, sessionSig) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.tws.post(`${this.urlPrefix}/v1/users/verify/cookie`, {
                cookie: sessionId,
                signed: sessionSig,
            });
            if (res && res.result) {
                return res.result.user;
            }
            return null;
        });
    }
    /**
     * 按 teambition 手机端 jwt token 获取用户
     * @param context
     * @param sessionId
     * @param sessionSig
     */
    getUserByTbMobileToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.tws.post(`${this.urlPrefix}/v1/users/verify/token`, { token });
            if (res && res.result) {
                return res.result.user;
            }
            return null;
        });
    }
    /**
     * 按openId取用户
     * @param context
     * @param accessToken
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.tws.get(`${this.urlPrefix}/v1/users/info?selectBy=_id`, {
                value: userId,
            });
            return user;
        });
    }
    /**
     * 按userIds批量获取取用户，上线5000条
     * @param context
     * @param accessToken
     */
    getUserByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.tws.post(`${this.urlPrefix}/v1/users:batchGetByIDs`, {
                ids,
            });
            return users;
        });
    }
    /**
     * 按openId取用户
     * @param context
     * @param accessToken
     */
    getUserByOpenId(openId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.tws.get(`${this.urlPrefix}/v1/users/info?selectBy=openId`, {
                value: openId,
            });
            return user;
        });
    }
    /**
     * 按用户token获取用户信息
     *
     * @param accessToken 用户 token
     */
    getUserByToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.tws.post(`/app/v1/apps/users/info`, {
                access_token: accessToken,
            });
            return user;
        });
    }
    // 获取用户完整信息
    getFullUserInfoById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.tws.get(`${this.urlPrefix}/v1/users/allinfo`, { _id: userId });
            return user;
        });
    }
    /**
     * 回调auth码换取token
     * @param authorizationCode 三方登陆回调auth码
     */
    getAccessToken(authorizationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.post(`${this.urlPrefix}/v1/oauth/token`, {
                grant_type: 'authorization_code',
                code: authorizationCode,
                expires_in: this.EXPIRES_DURATION,
            });
        });
    }
    /**
     * 刷新accessToken
     *
     * @param refreshToken 刷新的token
     */
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.post(`${this.urlPrefix}/v1/oauth/token`, {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                expires_in: this.EXPIRES_DURATION,
            });
        });
    }
    /**
     * logout
     * @param account
     * @param password
     */
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tws.post(`${this.urlPrefix}/v1/users/${userId}/logout:byCookie`);
            return true;
        });
    }
}
exports.UserApi = UserApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxxQ0FBcUQ7QUFFckQsTUFBYSxPQUFRLFNBQVEsa0JBQVM7SUFHcEMsWUFBWSxPQUF1QjtRQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFGakIsY0FBUyxHQUFHLE9BQU8sQ0FBQztRQUdsQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCLEVBQUUsVUFBbUI7UUFDaEQsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQVksQ0FBQztJQUM3RCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQVk7UUFDdEIsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBWSxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNHLGVBQWUsQ0FBQyxTQUFpQixFQUFFLFVBQWtCOztZQUN6RCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUM3QixHQUFHLElBQUksQ0FBQyxTQUFTLHlCQUF5QixFQUMxQztnQkFDRSxNQUFNLEVBQUUsU0FBUztnQkFDakIsTUFBTSxFQUFFLFVBQVU7YUFDbkIsQ0FDRixDQUFDO1lBRUYsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtnQkFDckIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUN4QjtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDRyxzQkFBc0IsQ0FBQyxLQUFhOztZQUN4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUM3QixHQUFHLElBQUksQ0FBQyxTQUFTLHdCQUF3QixFQUN6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