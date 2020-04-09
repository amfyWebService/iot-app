import { bind, /* inject, */ BindingScope, inject } from '@loopback/core';
import { IotApiService } from './iot-api.service';
import { repository } from '@loopback/repository';
import { DeviceRepository } from '@/repositories';
import { IotApiDevice, Device } from '@/models';

@bind({ scope: BindingScope.TRANSIENT })
export class DeviceService {
  constructor(
    @repository(DeviceRepository) private deviceRepository: DeviceRepository,
    @inject('services.IotApiService') private iotApiService: IotApiService
  ) { }

  async hydrateDevices() {
    const [temp, wind, humidity] = await Promise.all([
      this.iotApiService.getTemperature(),
      this.iotApiService.getWind(),
      this.iotApiService.getHumidity(),
    ]);

    const iotApiDevices: IotApiDevice[] = [];

    for (let tempItem of temp) {
      let apiDevice = new IotApiDevice(tempItem);

      // wind
      let indexWind = wind.findIndex(value => value.id === apiDevice.getId());
      if (indexWind >= 0) {
        apiDevice.wind = wind[indexWind].wind;
      }
      // end wind

      // humidity
      let indexFarsen = humidity.findIndex(value => value.id === apiDevice.getId());
      if (indexFarsen >= 0) {
        apiDevice.humidity = wind[indexFarsen].humidity;
      }
      // end humidity

      //
      let mongoDevice: Device | null;
      try {
        mongoDevice = await this.deviceRepository.findOne({ where: { name: apiDevice.id } });

        if (!mongoDevice) {
          mongoDevice = new Device({
            name: apiDevice.id,
          });
        }

        const [latitude, longitude] = apiDevice.zone.split(',');
        if (latitude && longitude) {
          mongoDevice.latitude = latitude;
          mongoDevice.longitude = longitude;
        }

        //mongoDevice.measurements?.push

      } catch (e) {

      }

      iotApiDevices.push(apiDevice);
    }
  }
}
