import {ApplicationConfig} from '@loopback/core';
import {BackApplication} from './application';
import { DeviceService } from './services';
import { ImportDevicesJob } from './Jobs/import_devices.job';

export {BackApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new BackApplication(options);
  await app.boot();
  await app.start();

  //Get Import devices job
  const deviceService = app.service(DeviceService);
  const serviceInstance = await deviceService.getValue(app);
  const job = new ImportDevicesJob(serviceInstance);
  job.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
