import {inject} from '@loopback/context';
import {get, Request, ResponseObject, RestBindings} from '@loopback/rest';
import { MongoDataSource } from '../datasources';
import { service } from '@loopback/core';
import { IotApiService } from '@/services';
import { IotApiDevice } from '../models';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          datasources: {
            type: 'object',
            additionalProperties: true,
          },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request, 
  @inject("datasources.mongo") private mongoDs: MongoDataSource,
  //@service(IotApiService) private iotApiService:IotApiService  
  @inject("services.IotApiService") private iotApiService:IotApiService  
  ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  async ping(): Promise<object> {
    let mongoIsUp: string = "no";

    try{
      await this.mongoDs.ping();
      mongoIsUp = "yes";
    } catch(e){
      mongoIsUp = "error";
    }
    
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from Iot App',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
      datasources: {
        "mongo": mongoIsUp,
      }
    };
  }
}
