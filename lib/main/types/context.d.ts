import * as Egg from 'egg';
import { Request, Response } from 'express';
import { Context } from 'koa';
import { AccessTokenInfo } from './user';
export declare type Nullable<T> = T | null | undefined;
export interface ExpressRequest extends Request {
    state?: any;
}
export interface ContextOptions {
    baseUrl?: string;
}
export declare type RequestOrContext = Context | ExpressRequest | Egg.Context;
/**
 * 兼容koa, express的http上下文
 */
export declare class HttpContext {
    accessToken: Nullable<string>;
    tenantType: Nullable<string>;
    tenantId: Nullable<string>;
    organizationId: Nullable<string>;
    sessionId: Nullable<string>;
    accessTokenInfo: Nullable<AccessTokenInfo>;
    baseUrl: Nullable<string>;
    ctx: Nullable<Context | Egg.Context>;
    req: Nullable<Request>;
    private resp;
    constructor(ctx: Nullable<Context | Egg.Context>, req: Nullable<Request>, resp: Nullable<Response>, options?: ContextOptions);
    /**
     * 获取上下文
     */
    getRequestOrContext(): RequestOrContext;
    getProtocol(): string;
    /**
     * 服务器地址
     */
    getBaseUrl(): string;
    /**
     * 完成请求地址
     */
    getOriginalUrl(): string;
    /**
     * 获取带参数的短url
     */
    getUrl(): string;
    /**
     * 获取请求的path
     */
    getPath(): string;
    /**
     * headers
     */
    getHeaders(): any;
    /**
     * 获取cookie
     * @param name
     */
    getCookie(name: string): Nullable<string>;
    /**
     * 设置cookie
     * @param name
     * @param value
     * @param options
     */
    setCookie(name: string, value: Nullable<string>, options?: any): void;
    /**
     * 获取query参数
     * @param name
     */
    getQueryParam(name: string): any;
    /**
     * 重定向
     * @param url
     */
    redirect(url: string): void;
    /**
     * 输出
     * @param content
     */
    write(content: string): void;
    /**
     * 判断是否ajax请求
     */
    isAjaxRequest(): boolean;
    /**
     * 获取sessionId
     * @param accessToken
     */
    extractSessionId(accessToken: string): any;
    init(): void;
}
