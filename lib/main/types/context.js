"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const const_1 = require("./const");
const result_1 = require("./result");
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
class HttpContext {
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
        throw result_1.Result.exception('invalid http context');
    }
    getProtocol() {
        if (this.ctx) {
            return this.ctx.protocol;
        }
        if (this.req) {
            return this.req.protocol;
        }
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        throw result_1.Result.exception('invalid http context');
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
        const decoded = jwt_decode_1.default(accessToken);
        return decoded.jti;
    }
    // 初始化上下文，从cookie/session加载上下文数据
    init() {
        this.accessToken = this.getCookie(const_1.CookieNames.TB_ACCESS_TOKEN);
        this.tenantType = this.getCookie(const_1.CookieNames.TB_TENANT_TYPE);
        this.tenantId = this.getCookie(const_1.CookieNames.TB_TENANT_ID);
        // 企业 ID 优先通过地址中读取。切换企业时会通过地址改变企业 ID
        this.organizationId = this.getQueryParam('organizationId') ||
            this.getQueryParam('_organizationId') || this.getCookie(const_1.CookieNames.TB_ORGANIZATION_ID);
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
            throw result_1.Result.exception('invalid http context');
        }
        requestOrContext.state = requestOrContext.state || {};
        requestOrContext.state = Object.assign(Object.assign(Object.assign({}, requestOrContext.state), this), { _httpContext: this });
    }
}
exports.HttpContext = HttpContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90eXBlcy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsNERBQW1DO0FBR25DLG1DQUFzQztBQUN0QyxxQ0FBa0M7QUFhbEM7OztHQUdHO0FBQ0gsU0FBUyxXQUFXLENBQUMsWUFBb0I7SUFDdkMsTUFBTSxPQUFPLEdBQUcsRUFBUyxDQUFDO0lBQzFCLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDakIsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFFRCxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUlEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBYXRCLFlBQVksR0FBb0MsRUFBRSxHQUFzQixFQUFFLElBQXdCLEVBQUUsT0FBd0I7UUFDMUgsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsbUJBQW1CO1FBQ2pCLElBQUks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