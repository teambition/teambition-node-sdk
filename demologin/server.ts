import * as egg from 'egg';

const workers = 1;

egg.startCluster(
  {
    workers,
    baseDir: __dirname,
    port: Number(process.env.PORT) || 3000,
  },
  () => {
    console.info('start server');
  },
);
