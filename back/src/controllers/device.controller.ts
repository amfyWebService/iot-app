import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {Device} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository : DeviceRepository,
  ) {}

  @get('/devices/count', {
    responses: {
      '200': {
        description: 'Device model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Device) where?: Where<Device>,
  ): Promise<Count> {
    return this.deviceRepository.count(where);
  }

  @get('/devices', {
    responses: {
      '200': {
        description: 'Array of Device model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Device, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Device) filter?: Filter<Device>,
  ): Promise<Device[]> {
    return this.deviceRepository.find(filter);
  }

  @get('/devices/{id}', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Device, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Device, {exclude: 'where'}) filter?: FilterExcludingWhere<Device>
  ): Promise<Device> {
    return this.deviceRepository.findById(id, filter);
  }

  @get('/devices/{id}/felt-temperature', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'feltTemperatureByDeviceId',
              properties: {
                felt : {type: 'number'}
              }
            }
          },
        },
      },
    },
  })
  async findFeltTemperatureById(
    @param.path.string('id') id: string,
    @param.filter(Device, {exclude: 'where'}) filter?: FilterExcludingWhere<Device>
  ): Promise<Device> {
    return this.findFeltTemperatureById(id, filter);
  }

  @get('/devices/{id}/average', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'feltTemperatureByDeviceId',
              properties: {
                temperature : {type: 'number'},
                wind : {type : 'number'},
                humidity : {type : 'number'}
              }
            }
          },
        },
      },
    },
  })
  async findTemperatureAverageById(
    @param.path.string('id') id: string,
    @param.filter(Device, {exclude: 'where'}) filter?: FilterExcludingWhere<Device>
  ): Promise<Device> {
    return this.findTemperatureAverageById(id, filter);
  }
}
