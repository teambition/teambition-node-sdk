
import * as Egg from 'egg';
import { Request, Response } from 'express';
import { Context } from 'koa';
import { URL } from 'url';
import { OpenApiOptions } from '../apis/client';
import { UserApi } from '../apis/user';
import { CookieNames,
  HttpContext,
  InvalidSession,
  Nullable,
  RequestOrContext,
  Result,
  UserInfo} from '../types';

/**
 * authorize相关配置
 */
export interface AuthOptions extends OpenApiOptions {
  oauthHost: string; // oauth 地址， http://teambition.aone.alibaba.net
  orgSelectUrl?: string; // 企业选择服务地址
  oauthPath?: string; // oauth 路径
  callbackPath?: string; // oauth callback 路径
  tenantVerify?: boolean; // 校验租户
  exclusions?: string[]; // 排除的地址
  baseUrl?: string; // 应用基础 url
}

// 3天超时
const EXPIRE_SECONDS = 72 * 3600 * 1000;

/**
 *  uc sdk 实现类
 */
export class UcSDK {
  private oauthPath = '/oauth/authorize';
  private callbackPath = '/callback.sso';
  private userApi: UserApi;
  private options: AuthOptions;
  private callback: Nullable<AuthCallback>;

  constructor(options: AuthOptions) {
    this.options = { ...options };
    this.oauthPath = this.options.oauthPath || this.oauthPath;
    this.callbackPath = this.options.callbackPath || this.callbackPath;
    this.callback = null;

    this.userApi = new UserApi(options);
  }

  /**
   * 设置callback
   * @param callback
   */
  setCallback(callback: AuthCallback) {
    this.callback = callback;
  }

  get callbackSSO(this: UcSDK): string {
    return this.callbackPath;
  }

  /**
   * 清除cookies
   * @param ctx
   */
  removeCookies(ctx: HttpContext) {
    ctx.setCookie(CookieNames.TB_ACCESS_TOKEN, null, { maxAge: 0 });
  }

  /**
   * 登陆跳转
   * @param ctx
   * @param callback
   */
  loginRedirect(ctx: RequestOrContext) {
    const httpContext = ctx.state._httpContext as HttpContext;
    const nextUrl = httpContext.getOriginalUrl();

    // 不需要登陆跳转，直接接口报错
    if (httpContext.isAjaxRequest()) {
      this.handleInvalidSession(httpContext, 'invalid session');
      return;
    }

    const redirectUrl = new URL(this.oauthPath, this.options.oauthHost);
    redirectUrl.searchParams.set('response_type', 'code');
    redirectUrl.searchParams.set('scope', 'app_user');

    if (httpContext.organizationId) {
      redirectUrl.searchParams.set('audience', httpContext.organizationId);
    }

    const callbackUrl = httpContext.getBaseUrl() + this.callbackPath + '?logstate=' + Buffer.from(nextUrl).toString('base64');
    redirectUrl.searchParams.set('client_id', this.options.appId);
    redirectUrl.searchParams.set('redirect_uri', callbackUrl);
    httpContext.redirect(redirectUrl.toString());
    return;
  }

  /**
   * koa2 中间件
   *
   */
  koa2Middleware() {
    return async (ctx: Context | Egg.Context, next: any) => {
      const httpContext = new HttpContext(ctx, null, null, {
        baseUrl: this.options.baseUrl,
      });
      return this.middleware(httpContext, next);
    };
  }

  /**
   * express 中间件，midway 4 适用
   *
   * @param callback 回调实现
   */
  expMiddleware() {
    return async (req: Request, resp: Response, next: any) => {
      const httpContext = new HttpContext(null, req, resp, {
        baseUrl: this.options.baseUrl,
      });
      return this.middleware(httpContext, next);
    };
  }

  /**
   * koa1 中间件, midway 5 适用
   * @param callback 回调实现
   */
  koa1Middleware() {
    const sdk = this as any;
    return function*(this: any, next: any) {
      const ctx = this as any;
      const httpContext = new HttpContext(ctx, null, null, {
        baseUrl: this.options.baseUrl,
      });
      yield sdk.middleware(httpContext, next);
    };
  }

  /**
   * 是否跳过登陆检查
   * @param path
   */
  isLoginExcludes(path: string) {
    if (!this.options.exclusions || this.options.exclusions.length <= 0) {
      return false;
    }

    for (const pattern of this.options.exclusions) {
      const regex = new RegExp(pattern, 'gi');
      if (regex.test(path)) {
        return true;
      }
    }

    return false;
  }

  private getSecure(ctx: HttpContext) {
    let secure = false;
    const protocol = ctx.getProtocol();
    if (protocol.toLowerCase() === 'https') {
      secure = true;
    }

    return secure;
  }

  /**
   * 写cookie
   *
   * @param ctx
   */
  private setTenantCookies(ctx: HttpContext) {
    const secure = this.getSecure(ctx);

    if (ctx.tenantType) {
      ctx.setCookie(CookieNames.TB_TENANT_TYPE, ctx.tenantType, { maxAge: EXPIRE_SECONDS, secure});
    }

    if (ctx.tenantId) {
      ctx.setCookie(CookieNames.TB_TENANT_ID, ctx.tenantId, { maxAge: EXPIRE_SECONDS * 3, secure});
    }

    if (ctx.accessToken) {
      ctx.setCookie(CookieNames.TB_ACCESS_TOKEN, ctx.accessToken, { maxAge: EXPIRE_SECONDS, secure});
    }
  }

  /**
   * 处理登陆
   * @param ctx
   * @param callback
   */
  private handleLogin(ctx: HttpContext) {
    let processed = false;

    if (!this.callback) {
      throw Result.exception('invalid callback handler');
    }

    if (typeof this.callback.handleLoginRedirect === 'function') {
      processed = this.callback.handleLoginRedirect(ctx.getRequestOrContext(), ctx.isAjaxRequest());
    }

    if (processed) {
      return;
    }

    this.loginRedirect(ctx.getRequestOrContext());
    return;
  }

  /**
   * 从state 解析出 nextUrl
   * @param ctx
   */
  private getNextUrlFromState(ctx: HttpContext): string {
    const state = ctx.getQueryParam('logstate');
    let nextUrl = '';

    if (state) {
      // new Buffer 已被废弃，改为使用 Buffer.from
      try {
        nextUrl = Buffer.from(state, 'base64').toString();
      } catch (e) {
        const baseUrl = ctx.getBaseUrl();
        console.error(`invalid state: ${state}, redirect ${baseUrl} instead...`);
        nextUrl = baseUrl;
      }
    }

    return nextUrl;
  }

  /**
   * call next
   * @param next
   */
  private async callNext(next: any) {
    if (typeof next === 'function') {
      await next();
    }
  }

  /**
   * 处理登陆成功的回调
   *
   * @param ctx http上下文
   */
  private async handleCallback(ctx: HttpContext) {
    const code: string = ctx.getQueryParam('code');
    const nextUrl = this.getNextUrlFromState(ctx);

    console.log(`code: ${code}, nextUrl: ${nextUrl}`);

    const tokenResp = await this.userApi.getAccessToken(code);
    if (!tokenResp || tokenResp.error) {
      console.error('getAccessToken failed');
      return false; // 获取accessToken失败
    }

    const secure = this.getSecure(ctx);

    // accessToken写入cookie
    ctx.accessToken = tokenResp.access_token;
    ctx.sessionId = ctx.extractSessionId(ctx.accessToken);
    ctx.setCookie(CookieNames.TB_ACCESS_TOKEN, ctx.accessToken, { maxAge: EXPIRE_SECONDS, secure});

    ctx.redirect(nextUrl);
    return true; // callback successful
  }

  /**
   * 处理租户选择
   * @param ctx
   */
  private async handleOrgSelect(ctx: HttpContext) {
    if (!this.options.orgSelectUrl) {
      return;
    }

    if (ctx.isAjaxRequest()) {
      return;
    }

    const nextUrl = new URL(ctx.getBaseUrl() + ctx.getOriginalUrl());
    nextUrl.searchParams.set('organizationId', '$org_id$');

    const redirectUrl = new URL(this.options.orgSelectUrl);
    redirectUrl.searchParams.set('appId', this.options.appId);
    redirectUrl.searchParams.set('useNewApi', 'true');
    redirectUrl.searchParams.set('nextUrl', nextUrl.toString());
    ctx.redirect(redirectUrl.toString());
  }

  /**
   * 三方登陆中间件
   *
   * @param ctx http上下文
   * @param next next
   * @param callback 回调实现
   */
  private async middleware(ctx: HttpContext, next: any) {
    const path = ctx.getPath();

    // 是否跳过登陆态检查
    if (this.isLoginExcludes(path)) {
      await this.callNext(next);
      return;
    }

    // 上下文初始化
    ctx.init();

    // // 预先写入一些cookies
    // this.setTenantCookies(ctx);

    // 登录前回调
    await this.handleBeforeLogin(ctx);

    // 处理回调 callback
    if (path === this.callbackPath) {
      const success = await this.handleCallback(ctx);
      if (!success) {
        this.handleInvalidSession(ctx, 'login failed');
        return;
      }

      // 回调成功后已跳转，直接返回
      return;
    }

    const accessToken = ctx.accessToken;

    // 如果上下文用户已登陆(可能来自其它中间件)，直接返回
    const context = ctx.getRequestOrContext();
    if (context.state.user) {
      await this.callNext(next);
      return;
    }

    // 未登录，直接引导用户去登录
    if (!accessToken) {
      this.handleLogin(ctx);
      return;
    }

    // 获取用户信息
    let userInfo = null;
    try {
      userInfo = await this.userApi.getUserByToken(accessToken);
    } catch (error) {
      userInfo = null;
      console.log('getUserByToken failed', error);
    }

    if (!userInfo) {
      // console.error('getUserByToken failed');
      // this.handleInvalidSession(ctx, 'getUserByToken failed, login failed');
      // return;
      // 可能token过期了，重新登陆
      this.removeCookies(ctx);
      this.handleLogin(ctx);
      return;
    }

    // 登陆成功后，刷新cookie
    this.setTenantCookies(ctx);

    // handleUser
    await this.handleUser(ctx, userInfo);
    await this.handleAfterLogin(ctx);

    // 登陆完成后，如果没有orgSelectUrl，跳转
    if (!ctx.organizationId && this.options.orgSelectUrl && this.options.orgSelectUrl !== '') {
      this.handleOrgSelect(ctx);
      return;
    }

    await this.callNext(next);
  }

  /**
   * 处理登陆前回调
   * @param ctx
   * @param callback
   */
  private async handleBeforeLogin(ctx: HttpContext) {
    if (!this.callback) {
      throw Result.exception('invalid callback handler');
    }

    if (typeof this.callback.beforeLogin === 'function') {
      await this.callback.beforeLogin(ctx.getRequestOrContext());
    }
  }

  /**
   * 登陆完成回调
   */
  private async handleAfterLogin(ctx: HttpContext) {
    if (!this.callback) {
      throw Result.exception('invalid callback handler');
    }

    // after login
    if (typeof this.callback.afterLogin === 'function') {
      await this.callback.afterLogin(ctx.getRequestOrContext());
    }
  }

  /**
   * 处理用户回调
   * @param ctx
   * @param callback
   * @param userInfo
   */
  private async handleUser(ctx: HttpContext, userInfo: UserInfo) {
    if (!this.callback) {
      throw Result.exception('invalid callback handler');
    }

    if (typeof this.callback.handleUser === 'function') {
      const context = ctx.getRequestOrContext();
      context.state.user = userInfo;
      await this.callback.handleUser(context, userInfo);
    }
  }

  /**
   * 处理登陆错
   * @param ctx
   */
  private async handleInvalidSession(ctx: HttpContext, errmsg?: string) {
    const isAjaxRequest = ctx.isAjaxRequest();
    let processed = false;
    const invalid = { ...InvalidSession, message: errmsg };

    this.removeCookies(ctx);

    if (!this.callback) {
      throw Result.exception('invalid callback handler');
    }

    if (typeof this.callback.handleInvalidSession === 'function') {
      processed = await this.callback.handleInvalidSession(ctx.getRequestOrContext(), isAjaxRequest, JSON.stringify(invalid));
    }

    if (processed) {
      return;
    }

    if (isAjaxRequest) {
      ctx.write(JSON.stringify(invalid));
      return;
    }
  }

}

/**
 * 回调函数
 */
export interface AuthCallback {
  // 登陆之前
  beforeLogin?: (ctx: RequestOrContext) => any;
  // 登陆后的回调
  afterLogin?: (ctx: RequestOrContext) => any;
  // 登陆之后
  handleUser?: (ctx: RequestOrContext, userInfo: UserInfo) => any;
  // 自定义登陆跳转，或输出出错json
  handleLoginRedirect?: (ctx: RequestOrContext, isAjaxRequest: boolean) => boolean;
  // 登陆失败时回调
  handleInvalidSession?: (ctx: RequestOrContext, isAjaxRequest: boolean, errJson: string) => boolean;
}
