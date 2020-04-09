import {Entity, model, property} from '@loopback/repository';

@model()
export class Device extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  longitude?: string;

  @property({
    type: 'string',
    required: true,
  })
  latitude: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  measurements?: object[];


  constructor(data?: Partial<Device>) {
    super(data);
  }
}

export interface DeviceRelations {
  // describe navigational properties here
}

export type DeviceWithRelations = Device & DeviceRelations;
