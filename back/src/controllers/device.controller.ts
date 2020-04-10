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
import { Device, DeviceMeasurement } from '../models';
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

  @get('/api/devices', {
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
    @param.path.string('id') id: string  
    ): Promise<object> {
    const result = await this.deviceRepository.findById(id).then(
      device => {
        if (device.measurements.length){
          const lastMesure : DeviceMeasurement = device.measurements[0];
          console.log("mesure", lastMesure);
          if (lastMesure.temperature && lastMesure.wind){
            return lastMesure.temperature != 0 ? lastMesure.wind / lastMesure.temperature : lastMesure.wind / 1  ;
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
                temperature: { type: 'number' },
                wind : { type: 'number' },
                humidity : { type: 'number' }
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
    
    let averages = await this.deviceRepository.findById(id).then(
      result => {
        let temperatures: number[] = [];
        let winds: number[] = [];
        let humidities: number[] = [];
        if(result && result.measurements && result.measurements.length){
          temperatures = result.measurements.filter(x => x.temperature!==null && x.temperature!==undefined).map(x =>x.temperature || 0)
          humidities = result.measurements.filter(x => x.humidity !==null && x.humidity!==undefined).map(x =>x.humidity || 0)
          winds = result.measurements.filter(x => x.wind!==null && x.wind!==undefined).map(x =>x.wind || 0)
        }
        return {temperatures, humidities, winds};
      }
    )
    return {
      temperature : averages.temperatures.length  ?  averages.temperatures.reduce((a,b) => a + b, 0) / averages.temperatures.length : null,
      wind : averages.winds.length  ?  averages.winds.reduce((a,b) => a + b, 0) / averages.winds.length : null,
      humidity : averages.humidities.length  ?  averages.humidities.reduce((a,b) => a + b, 0) / averages.humidities.length : null,
    };
  }
}
