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
const url_1 = require("url");
const user_1 = require("../apis/user");
const types_1 = require("../types");
// 3天超时
const EXPIRE_SECONDS = 72 * 3600 * 1000;
/**
 *  uc sdk 实现类
 */
class UcSDK {
    constructor(options) {
        this.oauthPath = '/oauth/authorize';
        this.callbackPath = '/callback.sso';
        this.options = Object.assign({}, options);
        this.oauthPath = this.options.oauthPath || this.oauthPath;
        this.callbackPath = this.options.callbackPath || this.callbackPath;
        this.callback = null;
        this.userApi = new user_1.UserApi(options);
    }
    /**
     * 设置callback
     * @param callback
     */
    setCallback(callback) {
        this.callback = callback;
    }
    get callbackSSO() {
        return this.callbackPath;
    }
    /**
     * 清除cookies
     * @param ctx
     */
    removeCookies(ctx) {
        ctx.setCookie(types_1.CookieNames.TB_ACCESS_TOKEN, null, { maxAge: 0 });
    }
    /**
     * 登陆跳转
     * @param ctx
     * @param callback
     */
    loginRedirect(ctx) {
        const httpContext = ctx.state._httpContext;
        const nextUrl = httpContext.getOriginalUrl();
        // 不需要登陆跳转，直接接口报错
        if (httpContext.isAjaxRequest()) {
            this.handleInvalidSession(httpContext, 'invalid session');
            return;
        }
        const redirectUrl = new url_1.URL(this.oauthPath, this.options.oauthHost);
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
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const httpContext = new types_1.HttpContext(ctx, null, null, {
                baseUrl: this.options.baseUrl,
            });
            return this.middleware(httpContext, next);
        });
    }
    /**
     * express 中间件，midway 4 适用
     *
     * @param callback 回调实现
     */
    expMiddleware() {
        return (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            const httpContext = new types_1.HttpContext(null, req, resp, {
                baseUrl: this.options.baseUrl,
            });
            return this.middleware(httpContext, next);
        });
    }
    /**
     * koa1 中间件, midway 5 适用
     * @param callback 回调实现
     */
    koa1Middleware() {
        const sdk = this;
        return function* (next) {
            const ctx = this;
            const httpContext = new types_1.HttpContext(ctx, null, null, {
                baseUrl: this.options.baseUrl,
            });
            yield sdk.middleware(httpContext, next);
        };
    }
    /**
     * 是否跳过登陆检查
     * @param path
     */
    isLoginExcludes(path) {
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
    getSecure(ctx) {
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
    setTenantCookies(ctx) {
        const secure = this.getSecure(ctx);
        if (ctx.tenantType) {
            ctx.setCookie(types_1.CookieNames.TB_TENANT_TYPE, ctx.tenantType, { maxAge: EXPIRE_SECONDS, secure });
        }
        if (ctx.tenantId) {
            ctx.setCookie(types_1.CookieNames.TB_TENANT_ID, ctx.tenantId, { maxAge: EXPIRE_SECONDS * 3, secure });
        }
        if (ctx.accessToken) {
            ctx.setCookie(types_1.CookieNames.TB_ACCESS_TOKEN, ctx.accessToken, { maxAge: EXPIRE_SECONDS, secure });
        }
    }
    /**
     * 处理登陆
     * @param ctx
     * @param callback
     */
    handleLogin(ctx) {
        let processed = false;
        if (!this.callback) {
            throw types_1.Result.exception('invalid callback handler');
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
    getNextUrlFromState(ctx) {
        const state = ctx.getQueryParam('logstate');
        let nextUrl = '';
        if (state) {
            // new Buffer 已被废弃，改为使用 Buffer.from
            try {
                nextUrl = Buffer.from(state, 'base64').toString();
            }
            catch (e) {
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
    callNext(next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof next === 'function') {
                yield next();
            }
        });
    }
    /**
     * 处理登陆成功的回调
     *
     * @param ctx http上下文
     */
    handleCallback(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = ctx.getQueryParam('code');
            const nextUrl = this.getNextUrlFromState(ctx);
            console.log(`code: ${code}, nextUrl: ${nextUrl}`);
            const tokenResp = yield this.userApi.getAccessToken(code);
            if (!tokenResp || tokenResp.error) {
                console.error('getAccessToken failed');
                return false; // 获取accessToken失败
            }
            const secure = this.getSecure(ctx);
            // accessToken写入cookie
            ctx.accessToken = tokenResp.access_token;
            ctx.sessionId = ctx.extractSessionId(ctx.accessToken);
            ctx.setCookie(types_1.CookieNames.TB_ACCESS_TOKEN, ctx.accessToken, { maxAge: EXPIRE_SECONDS, secure });
            ctx.redirect(nextUrl);
            return true; // callback successful
        });
    }
    /**
     * 处理租户选择
     * @param ctx
     */
    handleOrgSelect(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.orgSelectUrl) {
                return;
            }
            if (ctx.isAjaxRequest()) {
                return;
            }
            const nextUrl = new url_1.URL(ctx.getBaseUrl() + ctx.getOriginalUrl());
            nextUrl.searchParams.set('organizationId', '$org_id$');
            const redirectUrl = new url_1.URL(this.options.orgSelectUrl);
            redirectUrl.searchParams.set('appId', this.options.appId);
            redirectUrl.searchParams.set('useNewApi', 'true');
            redirectUrl.searchParams.set('nextUrl', nextUrl.toString());
            ctx.redirect(redirectUrl.toString());
        });
    }
    /**
     * 三方登陆中间件
     *
     * @param ctx http上下文
     * @param next next
     * @param callback 回调实现
     */
    middleware(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = ctx.getPath();
            // 是否跳过登陆态检查
            if (this.isLoginExcludes(path)) {
                yield this.callNext(next);
                return;
            }
            // 上下文初始化
            ctx.init();
            // // 预先写入一些cookies
            // this.setTenantCookies(ctx);
            // 登录前回调
            yield this.handleBeforeLogin(ctx);
            // 处理回调 callback
            if (path === this.callbackPath) {
                const success = yield this.handleCallback(ctx);
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
                yield this.callNext(next);
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
                userInfo = yield this.userApi.getUserByToken(accessToken);
            }
            catch (error) {
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
            yield this.handleUser(ctx, userInfo);
            yield this.handleAfterLogin(ctx);
            // 登陆完成后，如果没有orgSelectUrl，跳转
            if (!ctx.organizationId && this.options.orgSelectUrl && this.options.orgSelectUrl !== '') {
                this.handleOrgSelect(ctx);
                return;
            }
            yield this.callNext(next);
        });
    }
    /**
     * 处理登陆前回调
     * @param ctx
     * @param callback
     */
    handleBeforeLogin(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.callback) {
                throw types_1.Result.exception('invalid callback handler');
            }
            if (typeof this.callback.beforeLogin === 'function') {
                yield this.callback.beforeLogin(ctx.getRequestOrContext());
            }
        });
    }
    /**
     * 登陆完成回调
     */
    handleAfterLogin(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.callback) {
                throw types_1.Result.exception('invalid callback handler');
            }
            // after login
            if (typeof this.callback.afterLogin === 'function') {
                yield this.callback.afterLogin(ctx.getRequestOrContext());
            }
        });
    }
    /**
     * 处理用户回调
     * @param ctx
     * @param callback
     * @param userInfo
     */
    handleUser(ctx, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.callback) {
                throw types_1.Result.exception('invalid callback handler');
            }
            if (typeof this.callback.handleUser === 'function') {
                const context = ctx.getRequestOrContext();
                context.state.user = userInfo;
                yield this.callback.handleUser(context, userInfo);
            }
        });
    }
    /**
     * 处理登陆错
     * @param ctx
     */
    handleInvalidSession(ctx, errmsg) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAjaxRequest = ctx.isAjaxRequest();
            let processed = false;
            const invalid = Object.assign(Object.assign({}, types_1.InvalidSession), { message: errmsg });
            this.removeCookies(ctx);
            if (!this.callback) {
                throw types_1.Result.exception('invalid callback handler');
            }
            if (typeof this.callback.handleInvalidSession === 'function') {
                processed = yield this.callback.handleInvalidSession(ctx.getRequestOrContext(), isAjaxRequest, JSON.stringify(invalid));
            }
            if (processed) {
                return;
            }
            if (isAjaxRequest) {
                ctx.write(JSON.stringify(invalid));
                return;
            }
        });
    }
}
exports.UcSDK = UcSDK;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbXBsL2ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFJQSw2QkFBMEI7QUFFMUIsdUNBQXVDO0FBQ3ZDLG9DQU00QjtBQWU1QixPQUFPO0FBQ1AsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7QUFFeEM7O0dBRUc7QUFDSCxNQUFhLEtBQUs7SUFPaEIsWUFBWSxPQUFvQjtRQU54QixjQUFTLEdBQUcsa0JBQWtCLENBQUM7UUFDL0IsaUJBQVksR0FBRyxlQUFlLENBQUM7UUFNckMsSUFBSSxDQUFDLE9BQU8scUJBQVEsT0FBTyxDQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksY0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQUMsUUFBc0I7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsYUFBYSxDQUFDLEdBQWdCO1FBQzVCLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQVcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVEOzs7O09BSUc7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