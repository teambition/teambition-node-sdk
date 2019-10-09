import { UcSDK, RequestOrContext, UserInfo } from 'teambition-node-sdk'

/**
 * 登陆回调，应用可更改
 */
const callback = {
  /**
   * 处理用户数据
   * @param ctx
   * @param userInfo
   */
  async handleUser(ctx: RequestOrContext, user: UserInfo) {
    if (!user) {
      return null;
    }

    ctx.state.user = user;
    return user;
  },
};

const sdk = new UcSDK({
  appId: '*',
  appSecrets: [ '*' ],
  oauthHost: 'https://account.teambition.com',
  apiHost: 'https://www.teambitionapis.com/tbs',
  baseUrl: 'http://127.0.0.1:7001',
});

export default () => {
  sdk.setCallback(callback);
  return sdk.koa2Middleware();
};
