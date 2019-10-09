import { AccessTokenInfo, Nullable, UserInfo } from '../types';
import { ApiClient, OpenApiOptions } from './client';
export declare class UserApi extends ApiClient {
    options: OpenApiOptions;
    urlPrefix: string;
    constructor(options: OpenApiOptions);
    withTenantId(tenantId: string, tenantType?: string): UserApi;
    withHeaders(headers: any): ApiClient;
    /**
     * 按cookie获取用户
     * @param context
     * @param sessionId
     * @param sessionSig
     */
    getUserByCookie(sessionId: string, sessionSig: string): Promise<Nullable<UserInfo>>;
    /**
     * 按 teambition 手机端 jwt token 获取用户
     * @param context
     * @param sessionId
     * @param sessionSig
     */
    getUserByTbMobileToken(token: string): Promise<Nullable<UserInfo>>;
    /**
     * 按openId取用户
     * @param context
     * @param accessToken
     */
    getUserById(userId: string): Promise<Nullable<UserInfo>>;
    /**
     * 按userIds批量获取取用户，上线5000条
     * @param context
     * @param accessToken
     */
    getUserByIds(ids: string[]): Promise<UserInfo[]>;
    /**
     * 按openId取用户
     * @param context
     * @param accessToken
     */
    getUserByOpenId(openId: string): Promise<Nullable<UserInfo>>;
    /**
     * 按用户token获取用户信息
     *
     * @param accessToken 用户 token
     */
    getUserByToken(accessToken: string): Promise<Nullable<UserInfo>>;
    getFullUserInfoById(userId: string): Promise<UserInfo>;
    /**
     * 回调auth码换取token
     * @param authorizationCode 三方登陆回调auth码
     */
    getAccessToken(authorizationCode: string): Promise<AccessTokenInfo>;
    /**
     * 刷新accessToken
     *
     * @param refreshToken 刷新的token
     */
    refreshAccessToken(refreshToken: string): Promise<AccessTokenInfo>;
    /**
     * logout
     * @param account
     * @param password
     */
    logout(userId: string): Promise<boolean>;
}
