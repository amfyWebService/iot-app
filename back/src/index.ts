import {ApplicationConfig} from '@loopback/core';
import {BackApplication} from './application';

export {BackApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new BackApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
