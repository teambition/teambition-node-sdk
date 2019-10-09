import { URL } from 'url';
import { UserApi } from '../apis/user';
import { CookieNames, HttpContext, InvalidSession, Result } from '../types';
// 3天超时
const EXPIRE_SECONDS = 72 * 3600 * 1000;
/**
 *  uc sdk 实现类
 */
export class UcSDK {
    constructor(options) {
        this.oauthPath = '/oauth/authorize';
        this.callbackPath = '/callback.sso';
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
        ctx.setCookie(CookieNames.TB_ACCESS_TOKEN, null, { maxAge: 0 });
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
        return async (ctx, next) => {
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
        return async (req, resp, next) => {
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
        const sdk = this;
        return function* (next) {
            const ctx = this;
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
            ctx.setCookie(CookieNames.TB_TENANT_TYPE, ctx.tenantType, { maxAge: EXPIRE_SECONDS, secure });
        }
        if (ctx.tenantId) {
            ctx.setCookie(CookieNames.TB_TENANT_ID, ctx.tenantId, { maxAge: EXPIRE_SECONDS * 3, secure });
        }
        if (ctx.accessToken) {
            ctx.setCookie(CookieNames.TB_ACCESS_TOKEN, ctx.accessToken, { maxAge: EXPIRE_SECONDS, secure });
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
    async callNext(next) {
        if (typeof next === 'function') {
            await next();
        }
    }
    /**
     * 处理登陆成功的回调
     *
     * @param ctx http上下文
     */
    async handleCallback(ctx) {
        const code = ctx.getQueryParam('code');
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
        ctx.setCookie(CookieNames.TB_ACCESS_TOKEN, ctx.accessToken, { maxAge: EXPIRE_SECONDS, secure });
        ctx.redirect(nextUrl);
        return true; // callback successful
    }
    /**
     * 处理租户选择
     * @param ctx
     */
    async handleOrgSelect(ctx) {
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
    async middleware(ctx, next) {
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
    async handleBeforeLogin(ctx) {
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
    async handleAfterLogin(ctx) {
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
    async handleUser(ctx, userInfo) {
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
    async handleInvalidSession(ctx, errmsg) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbXBsL2ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUUxQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxXQUFXLEVBQ2xCLFdBQVcsRUFDWCxjQUFjLEVBR2QsTUFBTSxFQUNHLE1BQU0sVUFBVSxDQUFDO0FBZTVCLE9BQU87QUFDUCxNQUFNLGNBQWMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztBQUV4Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxLQUFLO0lBT2hCLFlBQVksT0FBb0I7UUFOeEIsY0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQy9CLGlCQUFZLEdBQUcsZUFBZSxDQUFDO1FBTXJDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLFFBQXNCO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBQyxHQUFn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