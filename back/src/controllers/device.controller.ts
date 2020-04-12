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
  api,
} from '@loopback/rest';
import { Device, DeviceMeasurement } from '../models';
import { DeviceRepository } from '../repositories';
import Feels from "feels";

@api({basePath: '/api/devices', paths: {}})
export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) { }

  @get('/count', {
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

  @get('/', {
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

  @get('/{id}', {
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

  @get('/{id}/felt-temperature', {
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
    const device = await this.deviceRepository.findById(id);
    let felt: number|null = null;

    if(device.measurements.length){
      const lastMeasurement = device.measurements[0];

      const feels = new Feels({
        temp: lastMeasurement.temperature,
        humidity: lastMeasurement.humidity,
        speed: lastMeasurement.wind,
        units: {
          temp: 'c',
          speed: 'kph'
        }
      });

      console.log(device.getId(), lastMeasurement, feels);

      felt = feels.like();
    }
    
    return {
      felt : felt
    };
  }

  @get('/{id}/average', {
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
