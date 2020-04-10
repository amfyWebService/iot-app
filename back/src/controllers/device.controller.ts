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
import { Device } from '../models';
import { DeviceRepository } from '../repositories';

export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) { }

  @get('/devices/count', {
    responses: {
      '200': {
        description: 'Device model count',
        content: { 'application/json': { schema: CountSchema } },
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
              items: getModelSchemaRef(Device, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    // @param.filter(Device) filter?: Filter<Device>,
    @param.query.string("name") name?: string
  ): Promise<Device[]> {
    const filter = { where: {} };

    if (name) {
      filter.where = { name: name };
    }

    return this.deviceRepository.find(filter);
  }

  @get('/devices/{id}', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Device, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<Device> {
    return this.deviceRepository.findById(id);
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
                felt: { type: 'number' }
              }
            }
          },
        },
      },
    },
  })
  async findFeltTemperatureById(
    @param.path.string('id') id: string,
    @param.filter(Device, { exclude: 'where' }) filter?: FilterExcludingWhere<Device>
  ): Promise<object> {

    let result = await this.deviceRepository.findById(id).then(
      device => {
        let lastMesure : any; 
        if (device && device.measurements && device.measurements.length){
          lastMesure = device.measurements[0];
          console.log("mesure", lastMesure);
          if (lastMesure.temperature && lastMesure.temperature != 0 && lastMesure.wind  ){
            return lastMesure.wind / lastMesure.temperature;
          }
          else if (lastMesure.temperature && lastMesure.temperature == 0 && lastMesure.wind){
            return lastMesure.wind / 1;
          }
        }
      }
    )
    return {
      felt : result
    };
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
                feltTemperature: { type: 'number' },
              }
            }
          },
        },
      },
    },
  })
  async findTemperatureAverageById(
    @param.path.string('id') id: string,
    @param.filter(Device, { exclude: 'where' }) filter?: FilterExcludingWhere<Device>
  ):
    Promise<object> {
    
    let results = await this.deviceRepository.findById(id).then(
      result => {
        let temperatures: number[] = []
        if(result && result.measurements && result.measurements.length){
          temperatures = result.measurements.filter(x => x.temperature!==null && x.temperature!==undefined).map(x =>x.temperature || 0)
        }
        return temperatures;
      }
    )
    return {
      feltTemperature : results.length  ?  results.reduce((a,b) => a + b, 0) / results.length : 0
    };
  }
}
