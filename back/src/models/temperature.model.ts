import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Temperature extends Entity {
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
    required: true,
    name: '°C',
  })
  celsius: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Temperature>) {
    super(data);
  }
}

export interface TemperatureRelations {
  // describe navigational properties here
}

export type TemperatureWithRelations = Temperature & TemperatureRelations;
