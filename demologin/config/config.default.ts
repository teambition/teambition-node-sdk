import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.keys = appInfo.name + '_1561702248728_346';

  // 返回通用result格式的
  config.formattedUrlPrefixs = [ '/api/' ];

  config.middleware = [ 'authorize' ];

  // 配置监听接口
  const port = process.env.PORT && parseInt(process.env.PORT) || 7001;
  config.cluster = {
    listen: {
      port,
    },
  };

  // 跨域定义
  config.cors = {
    credentials: true,
    // origin 如果没有配置默认使用 security 中的 domainWhiteList 作为白名单处理
    origin () {
      try {
        const ctx = arguments[0];
        return ctx.get('origin');
      } catch (error) {
        return '';
      }
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.static = {
    prefix: '/swagger',
    dir: appInfo.baseDir + '/app/public/swagger/',
  };

  // // buc 鉴权
  // config.buc = {
  //   account: {
  //     host: 'http://teambition.aone.alibaba.net/tbs',
  //   },
  // };

  config.cookie = {
    signed: false,
  };

  // the return config will combines to EggAppConfig
  return config;
};
