import {DefaultCrudRepository} from '@loopback/repository';
import {Device, DeviceRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DeviceRepository extends DefaultCrudRepository<
  Device,
  typeof Device.prototype._id,
  DeviceRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Device, dataSource);
  }
}
