import { Controller } from 'egg';
import { TWS } from 'teambition-node-sdk';

export default class HomeController extends Controller {

  public async me() {
    const { ctx } = this;
    ctx.body = ctx.state.user;
  }

  public async index() {
    const { ctx } = this;
    const userId = ctx.state.user._id;

    const appId = '*';
    const appSecret = '*';
    const apiHost = 'https://www.teambitionapis.com/tbs';
    const client = new TWS({
      appId,
      appSecrets: [ appSecret ],
      host: apiHost,
    });
    ctx.body = await client.get('/user/v1/users/info?selectBy=_id', {
      value: userId,
    });
  }
}
