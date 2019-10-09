import * as Egg from 'egg';
import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { Context } from 'koa';

import { CookieNames } from './const';
import { Result } from './result';
import { AccessTokenInfo } from './user';

export type Nullable<T> = T | null | undefined;

export interface ExpressRequest extends Request {
  state?: any;
}

export interface ContextOptions {
  baseUrl?: string;
}

/**
 * 解析cookie
 * @param header
 */
function parseCookie(cookieHeader: string): any {
  const cookies = {} as any;
  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach((item: string) => {
    const parts = item.split('=');
    cookies[parts[0].trim()] = (parts[1] || '').trim();
  });

  return cookies;
}

export type RequestOrContext = Context | ExpressRequest | Egg.Context;

/**
 * 兼容koa, express的http上下文
 */
export class HttpContext {
  // 登陆相关的上下文数据，放入context中
  accessToken: Nullable<string>;
  tenantType: Nullable<string>;
  tenantId: Nullable<string>;
  organizationId: Nullable<string>;
  sessionId: Nullable<string>;
  accessTokenInfo: Nullable<AccessTokenInfo>;
  baseUrl: Nullable<string>;
  ctx: Nullable<Context | Egg.Context>;
  req: Nullable<Request>;
  private resp: Nullable<Response>;

  constructor(ctx: Nullable<Context | Egg.Context>, req: Nullable<Request>, resp: Nullable<Response>, options?: ContextOptions) {
    this.ctx = ctx;
    this.req = req;
    this.resp = resp;
    if (options && options.baseUrl) {
      this.baseUrl = options.baseUrl;
    }
  }

  /**
   * 获取上下文
   */
  getRequestOrContext(): RequestOrContext {
    if (this.ctx) {
      return this.ctx;
    }

    if (this.req) {
      return this.req;
    }

    throw Result.exception('invalid http context');
  }

  getProtocol(): string {
    if (this.ctx) {
      return this.ctx.protocol;
    }

    if (this.req) {
      return this.req.protocol;
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 服务器地址
   */
  getBaseUrl(): string {
    if (this.baseUrl) {
      return this.baseUrl;
    }

    let protocol = '';
    let host = '';
    if (this.ctx) {
      protocol = this.ctx.protocol;
      host = this.ctx.host;
    }

    if (this.req) {
      protocol = this.req.protocol;
      host = this.req.get('host') as string;
    }

    return protocol + '://' + host;
  }

  /**
   * 完成请求地址
   */
  getOriginalUrl(): string {
    if (this.ctx) {
      return this.ctx.originalUrl;
    }

    if (this.req) {
      return this.req.originalUrl;
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 获取带参数的短url
   */
  getUrl() {
    if (this.ctx) {
      return this.ctx.url;
    }

    if (this.req) {
      return this.req.url;
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 获取请求的path
   */
  getPath() {
    if (this.ctx) {
      return this.ctx.path;
    }

    if (this.req) {
      return this.req.path;
    }

    throw Result.exception('invalid http context');
  }

  /**
   * headers
   */
  getHeaders(): any {
    if (this.ctx) {
      return this.ctx.headers;
    }

    if (this.req) {
      return this.req.headers;
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 获取cookie
   * @param name
   */
  getCookie(name: string): Nullable<string> {
    if (this.ctx) {
      return this.ctx.cookies.get(name);
    }

    if (this.req) {
      const cookies = parseCookie(this.req.headers.cookie as string);
      return cookies[name];
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 设置cookie
   * @param name
   * @param value
   * @param options
   */
  setCookie(name: string, value: Nullable<string>, options?: any) {
    if (this.ctx) {
      this.ctx.cookies.set(name, value as string, options);
      return;
    }

    if (this.resp) {
      this.resp.cookie(name, value, options);
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 获取query参数
   * @param name
   */
  getQueryParam(name: string): any {
    if (this.ctx && this.ctx.query) {
      return this.ctx.query[name];
    }

    if (this.req && this.req.query) {
      return this.req.query[name];
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 重定向
   * @param url
   */
  redirect(url: string) {
    if (this.ctx) {
      return this.ctx.redirect(url);
    }

    if (this.resp) {
      return this.resp.redirect(url);
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 输出
   * @param content
   */
  write(content: string) {
    if (this.ctx) {
      this.ctx.body = content;
      return;
    }

    if (this.resp) {
      this.resp.send(content);
    }

    throw Result.exception('invalid http context');
  }

  /**
   * 判断是否ajax请求
   */
  isAjaxRequest(): boolean {
    const headers = this.getHeaders();
    const requestedWith = headers['x-requested-with'];
    if (!requestedWith) {
      return false;
    }

    return requestedWith.toLowerCase() === 'XMLHttpRequest'.toLowerCase();
  }

  /**
   * 获取sessionId
   * @param accessToken
   */
  extractSessionId(accessToken: string) {
    if (!accessToken) {
      return null;
    }

    const decoded = jwtDecode(accessToken) as any;
    return decoded.jti;
  }

  // 初始化上下文，从cookie/session加载上下文数据
  init() {
    this.accessToken = this.getCookie(CookieNames.TB_ACCESS_TOKEN);
    this.tenantType = this.getCookie(CookieNames.TB_TENANT_TYPE);
    this.tenantId = this.getCookie(CookieNames.TB_TENANT_ID);

    // 企业 ID 优先通过地址中读取。切换企业时会通过地址改变企业 ID
    this.organizationId = this.getQueryParam('organizationId') ||
      this.getQueryParam('_organizationId') || this.getCookie(CookieNames.TB_ORGANIZATION_ID);

    this.tenantType = !this.tenantType ? 'organization' : this.tenantType;

    if (this.accessToken) {
      this.sessionId = this.extractSessionId(this.accessToken);
    }

    if (this.organizationId === 'undefined' || this.organizationId === 'null') {
      this.organizationId = null;
    }

    if (this.tenantId === 'undefined' || this.tenantId === 'null') {
      this.tenantId = null;
    }

    if (this.tenantType === 'undefined' || this.tenantType === 'null') {
      this.tenantType = null;
    }

    let requestOrContext: Nullable<RequestOrContext> = null;
    if (this.ctx) {
      requestOrContext = this.ctx;
    }

    if (this.req) {
      requestOrContext = this.req;
    }

    if (!requestOrContext) {
      throw Result.exception('invalid http context');
    }

    requestOrContext.state = requestOrContext.state || {};
    requestOrContext.state = { ...requestOrContext.state, ...this, _httpContext: this };
  }
}
