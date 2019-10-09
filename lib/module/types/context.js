import jwtDecode from 'jwt-decode';
import { CookieNames } from './const';
import { Result } from './result';
/**
 * 解析cookie
 * @param header
 */
function parseCookie(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) {
        return cookies;
    }
    cookieHeader.split(';').forEach((item) => {
        const parts = item.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
    return cookies;
}
/**
 * 兼容koa, express的http上下文
 */
export class HttpContext {
    constructor(ctx, req, resp, options) {
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
    getRequestOrContext() {
        if (this.ctx) {
            return this.ctx;
        }
        if (this.req) {
            return this.req;
        }
        throw Result.exception('invalid http context');
    }
    getProtocol() {
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
    getBaseUrl() {
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
            host = this.req.get('host');
        }
        return protocol + '://' + host;
    }
    /**
     * 完成请求地址
     */
    getOriginalUrl() {
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
    getHeaders() {
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
    getCookie(name) {
        if (this.ctx) {
            return this.ctx.cookies.get(name);
        }
        if (this.req) {
            const cookies = parseCookie(this.req.headers.cookie);
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
    setCookie(name, value, options) {
        if (this.ctx) {
            this.ctx.cookies.set(name, value, options);
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
    getQueryParam(name) {
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
    redirect(url) {
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
    write(content) {
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
    isAjaxRequest() {
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
    extractSessionId(accessToken) {
        if (!accessToken) {
            return null;
        }
        const decoded = jwtDecode(accessToken);
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
        let requestOrContext = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90eXBlcy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUduQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFhbEM7OztHQUdHO0FBQ0gsU0FBUyxXQUFXLENBQUMsWUFBb0I7SUFDdkMsTUFBTSxPQUFPLEdBQUcsRUFBUyxDQUFDO0lBQzFCLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDakIsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFFRCxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUlEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFdBQVc7SUFhdEIsWUFBWSxHQUFvQyxFQUFFLEdBQXNCLEVBQUUsSUFBd0IsRUFBRSxPQUF3QjtRQUMxSCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUM5QixJQUFJLENBQUMsT0FBTyxH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