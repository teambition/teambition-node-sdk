import { ApiClient } from './client';
export class UserApi extends ApiClient {
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
    async getUserByCookie(sessionId, sessionSig) {
        const res = await this.tws.post(`${this.urlPrefix}/v1/users/verify/cookie`, {
            cookie: sessionId,
            signed: sessionSig,
        });
        if (res && res.result) {
            return res.result.user;
        }
        return null;
    }
    /**
     * 按 teambition 手机端 jwt token 获取用户
     * @param context
     * @param sessionId
     * @param sessionSig
     */
    async getUserByTbMobileToken(token) {
        const res = await this.tws.post(`${this.urlPrefix}/v1/users/verify/token`, { token });
        if (res && res.result) {
            return res.result.user;
        }
        return null;
    }
    /**
     * 按openId取用户
     * @param context
     * @param accessToken
     */
    async getUserById(userId) {
        const user = await this.tws.get(`${this.urlPrefix}/v1/users/info?selectBy=_id`, {
            value: userId,
        });
        return user;
    }
    /**
     * 按userIds批量获取取用户，上线5000条
     * @param context
     * @param accessToken
     */
    async getUserByIds(ids) {
        const users = await this.tws.post(`${this.urlPrefix}/v1/users:batchGetByIDs`, {
            ids,
        });
        return users;
    }
    /**
     * 按openId取用户
     * @param context
     * @param accessToken
     */
    async getUserByOpenId(openId) {
        const user = await this.tws.get(`${this.urlPrefix}/v1/users/info?selectBy=openId`, {
            value: openId,
        });
        return user;
    }
    /**
     * 按用户token获取用户信息
     *
     * @param accessToken 用户 token
     */
    async getUserByToken(accessToken) {
        const user = await this.tws.post(`/app/v1/apps/users/info`, {
            access_token: accessToken,
        });
        return user;
    }
    // 获取用户完整信息
    async getFullUserInfoById(userId) {
        const user = await this.tws.get(`${this.urlPrefix}/v1/users/allinfo`, { _id: userId });
        return user;
    }
    /**
     * 回调auth码换取token
     * @param authorizationCode 三方登陆回调auth码
     */
    async getAccessToken(authorizationCode) {
        return this.tws.post(`${this.urlPrefix}/v1/oauth/token`, {
            grant_type: 'authorization_code',
            code: authorizationCode,
            expires_in: this.EXPIRES_DURATION,
        });
    }
    /**
     * 刷新accessToken
     *
     * @param refreshToken 刷新的token
     */
    async refreshAccessToken(refreshToken) {
        return this.tws.post(`${this.urlPrefix}/v1/oauth/token`, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            expires_in: this.EXPIRES_DURATION,
        });
    }
    /**
     * logout
     * @param account
     * @param password
     */
    async logout(userId) {
        await this.tws.post(`${this.urlPrefix}/v1/users/${userId}/logout:byCookie`);
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBa0IsTUFBTSxVQUFVLENBQUM7QUFFckQsTUFBTSxPQUFPLE9BQVEsU0FBUSxTQUFTO0lBR3BDLFlBQVksT0FBdUI7UUFDakMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRmpCLGNBQVMsR0FBRyxPQUFPLENBQUM7UUFHbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQixFQUFFLFVBQW1CO1FBQ2hELE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFZLENBQUM7SUFDN0QsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQVksQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQWlCLEVBQUUsVUFBa0I7UUFDekQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDN0IsR0FBRyxJQUFJLENBQUMsU0FBUyx5QkFBeUIsRUFDMUM7WUFDRSxNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsVUFBVTtTQUNuQixDQUNGLENBQUM7UUFFRixJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ3JCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDeEI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFhO1FBQ3hDLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQzdC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