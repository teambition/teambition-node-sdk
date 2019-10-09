import { AccessTokenInfo, Nullable, UserInfo } from '../types';
import { ApiClient, OpenApiOptions } from './client';

export class UserApi extends ApiClient {
  options: OpenApiOptions;
  urlPrefix = '/user';
  constructor(options: OpenApiOptions) {
    super(options);
    this.options = options;
  }

  withTenantId(tenantId: string, tenantType?: string): UserApi {
    return super.withTenantId(tenantId, tenantType) as UserApi;
  }

  withHeaders(headers: any): ApiClient {
    return super.withHeaders(headers) as UserApi;
  }

  /**
   * 按cookie获取用户
   * @param context
   * @param sessionId
   * @param sessionSig
   */
  async getUserByCookie(sessionId: string, sessionSig: string): Promise<Nullable<UserInfo>> {
    const res = await this.tws.post<any>(
      `${this.urlPrefix}/v1/users/verify/cookie`,
      {
        cookie: sessionId,
        signed: sessionSig,
      },
    );

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
  async getUserByTbMobileToken(token: string): Promise<Nullable<UserInfo>> {
    const res = await this.tws.post<any>(
      `${this.urlPrefix}/v1/users/verify/token`,
      { token },
    );

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
  async getUserById(userId: string): Promise<Nullable<UserInfo>> {
    const user = await this.tws.get<any>(
      `${this.urlPrefix}/v1/users/info?selectBy=_id`,
      {
        value: userId,
      },
    );

    return user;
  }

  /**
   * 按userIds批量获取取用户，上线5000条
   * @param context
   * @param accessToken
   */
  async getUserByIds(ids: string[]): Promise<UserInfo[]> {
    const users = await this.tws.post<any>(
      `${this.urlPrefix}/v1/users:batchGetByIDs`,
      {
        ids,
      },
    );

    return users;
  }

  /**
   * 按openId取用户
   * @param context
   * @param accessToken
   */
  async getUserByOpenId(openId: string): Promise<Nullable<UserInfo>> {
    const user = await this.tws.get<any>(
      `${this.urlPrefix}/v1/users/info?selectBy=openId`,
      {
        value: openId,
      },
    );

    return user;
  }

  /**
   * 按用户token获取用户信息
   *
   * @param accessToken 用户 token
   */
  async getUserByToken(accessToken: string): Promise<Nullable<UserInfo>> {
    const user = await this.tws.post<any>(
      `/app/v1/apps/users/info`,
      {
        access_token: accessToken,
      },
    );

    return user;
  }

  // 获取用户完整信息
  async getFullUserInfoById(userId: string) {
    const user = await this.tws.get<UserInfo>(
      `${this.urlPrefix}/v1/users/allinfo`,
      { _id: userId },
    );

    return user;
  }

  /**
   * 回调auth码换取token
   * @param authorizationCode 三方登陆回调auth码
   */
  async getAccessToken(authorizationCode: string) {
    return this.tws.post<AccessTokenInfo>(
      `${this.urlPrefix}/v1/oauth/token`,
      {
        grant_type: 'authorization_code',
        code: authorizationCode,
        expires_in: this.EXPIRES_DURATION,
      },
    );
  }

  /**
   * 刷新accessToken
   *
   * @param refreshToken 刷新的token
   */
  async refreshAccessToken(refreshToken: string) {
    return this.tws.post<AccessTokenInfo>(
      `${this.urlPrefix}/v1/oauth/token`,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        expires_in: this.EXPIRES_DURATION,
      },
    );
  }

  /**
   * logout
   * @param account
   * @param password
   */
  async logout(userId: string) {
    await this.tws.post<any>(
      `${this.urlPrefix}/v1/users/${userId}/logout:byCookie`,
    );

    return true;
  }

}
