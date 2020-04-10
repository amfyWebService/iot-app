import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {IotApiDataSource} from '../datasources';
import { IotApiDevice } from '../models';

export interface IotApiService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
   getTemperature() : Promise<Partial<IotApiDevice>[]>
   getWind() : Promise<Partial<IotApiDevice>[]>
   getHumidity() : Promise<Partial<IotApiDevice>[]>
}

export class IotApiServiceProvider implements Provider<IotApiService> {
  constructor(
    // iotApi must match the name property in the datasource json file
    @inject('datasources.iotApi')
    protected dataSource: IotApiDataSource = new IotApiDataSource(),
  ) {}

  value(): Promise<IotApiService> {
    return getService(this.dataSource);
  }
}
