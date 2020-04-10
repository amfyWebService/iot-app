import {ApplicationConfig} from '@loopback/core';
import {BackApplication} from './application';
import { DeviceService } from './services';

export {BackApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new BackApplication(options);
  await app.boot();
  await app.start();

  (await app.service(DeviceService).getValue(app)).start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
