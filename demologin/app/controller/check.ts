import { Context, Controller } from 'egg';

export default class CheckController extends Controller {
  constructor(ctx: Context) {
    super(ctx);
  }

  async index(ctx: Context) {
    ctx.body = 'success';
  }
}
