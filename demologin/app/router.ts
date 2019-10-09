import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/check.node', controller.check.index);
  router.get('/me', controller.home.me);
  router.get('/', controller.home.index);
};
