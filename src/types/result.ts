import { Nullable } from '../types';

export class Result<T> {
  static OK = 200;
  static RESOURCE_CREATED = 201;
  static PENDING = 202;
  static NO_CONTENT = 204;
  static ERROR = 400;
  static NO_AUTHORIZE = 401;
  static ACCESS_FORBIDDEN = 403;
  static NOT_FOUND = 404;
  static METHOD_NOT_ALLOWED = 405;
  static RESOURCE_MISMATCH = 406;
  static REQUEST_TIMEOUT = 408;
  static REQUEST_TOO_LARGE = 413;
  static SERVICE_ERROR = 500;
  static BAD_GATEWAY = 502;
  static SERVICE_NOT_AVAILABLE = 503;

  static lang = 'zh';
  static i18nMessages: { [key: string]: string } = {};

  code: number = Result.OK;
  result: Nullable<T> = null;
  message: Nullable<string> = '';
  success: boolean = false;
  raw: boolean = false;

  constructor(code: number, result: T, message?: string, raw: boolean = false) {
    this.code = code;
    this.result = result;
    this.message = message;
    this.raw = raw;
    this.success = this.code === Result.OK;
  }

  static success<K>(result: K, message: string = 'ok') {
    return new Result(Result.OK, result, message);
  }

  static raw<K>(result: K, message: string = 'ok') {
    return new Result(Result.OK, result, message, true);
  }

  static fail<K>(result: K, message: string, code?: number) {
    code = code || Result.ERROR;
    return new Result(Result.ERROR, result, message || 'failed');
  }

  /**
   * 抛异常
   *
   * @param message
   * @param code
   */
  static exception(message: string, name: string = 'error', code?: number) {
    code = code || Result.ERROR;
    const error = new Error(message);
    error.name = name;

    const messages = Result.i18nMessages[Result.lang] as any;
    if (messages && messages[error.name]) {
      error.message = messages[error.name];
    }

    (error as any).code = code;
    return error;
  }

  /**
   * 判断是否result
   *
   * @param result
   */
  static isResult(result: any): boolean {
    return result instanceof Result;
  }

}
