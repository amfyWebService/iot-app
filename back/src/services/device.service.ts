import { bind, /* inject, */ BindingScope, inject } from '@loopback/core';
import { IotApiService } from './iot-api.service';
import { repository } from '@loopback/repository';
import { IotApiDevice, Device } from '../models';
import { DeviceRepository } from '../repositories';

export class DeviceService {
  constructor(
    @repository(DeviceRepository) private deviceRepository: DeviceRepository,
    @inject('services.IotApiService') private iotApiService: IotApiService
  ) {
    console.log("coucocoucou")
    this.hydrateDevices();
  }

  sayHello(){
    console.log("Hello");
  }
  async hydrateDevices() {
    const [temp, wind, humidity] = await Promise.all([
      this.iotApiService.getTemperature(),
      this.iotApiService.getWind(),
      this.iotApiService.getHumidity(),
    ]);

    for (let tempItem of temp) {
      let apiDevice = new IotApiDevice(tempItem);

      // wind
      let indexWind = wind.findIndex(value => value.id === apiDevice.getId());
      if (indexWind >= 0) {
        apiDevice.wind = wind[indexWind].wind;
      }
      // end wind

      // humidity
      let indexHumidity = humidity.findIndex(value => value.id === apiDevice.getId());
      if (indexHumidity >= 0) {
        apiDevice.humidity = wind[indexHumidity].humidity;
      }
      // end humidity

      this.apiDeviceToMongoDevice(apiDevice);
    }
  }

  async apiDeviceToMongoDevice(apiDevice: IotApiDevice){
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

      mongoDevice.measurements.unshift({
        temperature: apiDevice.celsius,
        wind: apiDevice.wind,
        humidity: apiDevice.humidity,
        date: new Date(),
      });

      if(mongoDevice.measurements.length > 20){
        mongoDevice.measurements.splice(20, 1);
      }

      this.deviceRepository.save(mongoDevice);
    } catch (e) {
      console.error("[DeviceService]: ", e);
    }
  }
}
