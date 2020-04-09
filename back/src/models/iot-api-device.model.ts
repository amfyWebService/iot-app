import {Entity, model, property} from '@loopback/repository';

@model()
export class IotApiDevice extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  zone: string;

  @property({
    type: 'number',
    required: false,
  })
  celsius?: number;

  @property({
    type: 'number',
    required: false,
  })
  wind?: number;

  @property({
    type: 'number',
    required: false,
  })
  humidity?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<IotApiDevice>) {
    if(data){
      data.celsius = (data as any)["°C"];
      data.wind = (data as any)["km/h"];
      data.humidity = (data as any)["%"];
    }
    super(data);
  }
}

export interface TemperatureRelations {
  // describe navigational properties here
}

export type TemperatureWithRelations = IotApiDevice & TemperatureRelations;
