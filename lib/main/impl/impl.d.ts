import * as Egg from 'egg';
import { Request, Response } from 'express';
import { Context } from 'koa';
import { OpenApiOptions } from '../apis/client';
import { HttpContext, RequestOrContext, UserInfo } from '../types';
/**
 * authorize相关配置
 */
export interface AuthOptions extends OpenApiOptions {
    oauthHost: string;
    orgSelectUrl?: string;
    oauthPath?: string;
    callbackPath?: string;
    tenantVerify?: boolean;
    exclusions?: string[];
    baseUrl?: string;
}
/**
 *  uc sdk 实现类
 */
export declare class UcSDK {
    private oauthPath;
    private callbackPath;
    private userApi;
    private options;
    private callback;
    constructor(options: AuthOptions);
    /**
     * 设置callback
     * @param callback
     */
    setCallback(callback: AuthCallback): void;
    readonly callbackSSO: string;
    /**
     * 清除cookies
     * @param ctx
     */
    removeCookies(ctx: HttpContext): void;
    /**
     * 登陆跳转
     * @param ctx
     * @param callback
     */
    loginRedirect(ctx: RequestOrContext): void;
    /**
     * koa2 中间件
     *
     */
    koa2Middleware(): (ctx: Context | Egg.Context, next: any) => Promise<void>;
    /**
     * express 中间件，midway 4 适用
     *
     * @param callback 回调实现
     */
    expMiddleware(): (req: Request, resp: Response, next: any) => Promise<void>;
    /**
     * koa1 中间件, midway 5 适用
     * @param callback 回调实现
     */
    koa1Middleware(): (this: any, next: any) => Generator<any, void, unknown>;
    /**
     * 是否跳过登陆检查
     * @param path
     */
    isLoginExcludes(path: string): boolean;
    private getSecure;
    /**
     * 写cookie
     *
     * @param ctx
     */
    private setTenantCookies;
    /**
     * 处理登陆
     * @param ctx
     * @param callback
     */
    private handleLogin;
    /**
     * 从state 解析出 nextUrl
     * @param ctx
     */
    private getNextUrlFromState;
    /**
     * call next
     * @param next
     */
    private callNext;
    /**
     * 处理登陆成功的回调
     *
     * @param ctx http上下文
     */
    private handleCallback;
    /**
     * 处理租户选择
     * @param ctx
     */
    private handleOrgSelect;
    /**
     * 三方登陆中间件
     *
     * @param ctx http上下文
     * @param next next
     * @param callback 回调实现
     */
    private middleware;
    /**
     * 处理登陆前回调
     * @param ctx
     * @param callback
     */
    private handleBeforeLogin;
    /**
     * 登陆完成回调
     */
    private handleAfterLogin;
    /**
     * 处理用户回调
     * @param ctx
     * @param callback
     * @param userInfo
     */
    private handleUser;
    /**
     * 处理登陆错
     * @param ctx
     */
    private handleInvalidSession;
}
/**
 * 回调函数
 */
export interface AuthCallback {
    beforeLogin?: (ctx: RequestOrContext) => any;
    afterLogin?: (ctx: RequestOrContext) => any;
    handleUser?: (ctx: RequestOrContext, userInfo: UserInfo) => any;
    handleLoginRedirect?: (ctx: RequestOrContext, isAjaxRequest: boolean) => boolean;
    handleInvalidSession?: (ctx: RequestOrContext, isAjaxRequest: boolean, errJson: string) => boolean;
}
