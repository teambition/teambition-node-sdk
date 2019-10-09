# @ali/tb-uc-sdk

## Installation

```shell
npm i --save git://github.com/teambition/teambition-node-sdk.git
```

## Usage

### express
```js

const UcSDK = require('teambition-node-sdk')

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
  appId: '**',
  appSecrets: ['**'],
  oauthHost: 'https://account.teambition.com',
  tbsApiHost: 'https://www.teambitionapis.com/tbs',
  baseUrl: 'http://127.0.0.1:7001',
})

sdk.setCallback(callback);

const authOptions = {
  beforeLogin(ctx) {
    console.log('before login...', ctx.organizationId)
  },

  afterLogin(ctx, userInfo) {
    console.log('after login...x')
    console.log('user: ', userInfo, ctx.organizationId)
  },
}

const express = require('express')

const app = express()
app.use(sdk.expMiddleware(authOptions))

app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(7001, function() {
  console.log('app is listening at port 7001')
})

```

### Koa2
```js
const UcSDK = require('teambition-node-sdk')

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
  appId: '**',
  appSecrets: ['**'],
  oauthHost: 'https://account.teambition.com',
  tbsApiHost: 'https://www.teambitionapis.com/tbs',
  baseUrl: 'http://127.0.0.1:7001',
})

sdk.setCallback(callback);

const authOptions = {
  beforeLogin(ctx) {
    console.log('before login...', ctx.organizationId)
  },

  afterLogin(ctx, userInfo) {
    console.log('after login...x')
    console.log('user: ', userInfo, ctx.organizationId)
  },
}

const Koa = require('koa')
const app = new Koa()
app.use(sdk.koa2Middleware(authOptions))

app.use(async(ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

app.listen(7001);

```