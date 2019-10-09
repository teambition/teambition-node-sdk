import { Nullable } from '../types';
export declare class Result<T> {
    static OK: number;
    static RESOURCE_CREATED: number;
    static PENDING: number;
    static NO_CONTENT: number;
    static ERROR: number;
    static NO_AUTHORIZE: number;
    static ACCESS_FORBIDDEN: number;
    static NOT_FOUND: number;
    static METHOD_NOT_ALLOWED: number;
    static RESOURCE_MISMATCH: number;
    static REQUEST_TIMEOUT: number;
    static REQUEST_TOO_LARGE: number;
    static SERVICE_ERROR: number;
    static BAD_GATEWAY: number;
    static SERVICE_NOT_AVAILABLE: number;
    static lang: string;
    static i18nMessages: {
        [key: string]: string;
    };
    code: number;
    result: Nullable<T>;
    message: Nullable<string>;
    success: boolean;
    raw: boolean;
    constructor(code: number, result: T, message?: string, raw?: boolean);
    static success<K>(result: K, message?: string): Result<K>;
    static raw<K>(result: K, message?: string): Result<K>;
    static fail<K>(result: K, message: string, code?: number): Result<K>;
    /**
     * 抛异常
     *
     * @param message
     * @param code
     */
    static exception(message: string, name?: string, code?: number): Error;
    /**
     * 判断是否result
     *
     * @param result
     */
    static isResult(result: any): boolean;
}
