import { bind, /* inject, */ BindingScope, inject } from '@loopback/core';
import { IotApiService } from './iot-api.service';
import { repository } from '@loopback/repository';
import { IotApiDevice, Device } from '../models';
import { DeviceRepository } from '../repositories';

export class DeviceService {
  private task: NodeJS.Timeout;

  constructor(
    @repository(DeviceRepository) private deviceRepository: DeviceRepository,
    @inject('services.IotApiService') private iotApiService: IotApiService
  ) {}

  public async importDevices() {
    const [temp, wind, humidity] = await Promise.all([
      this.iotApiService.getTemperature(),
      this.iotApiService.getWind(),
      this.iotApiService.getHumidity(),
    ]);

    const promises: Promise<void>[] = [];

    for (const tempItem of temp) {
      const apiDevice = new IotApiDevice(tempItem);
      // wind
      const indexWind = wind.findIndex(value => value.id === apiDevice.getId());
      
      if (indexWind >= 0) {
        apiDevice.wind = new IotApiDevice(wind[indexWind]).wind;
      }
      // end wind

      // humidity
      const indexHumidity = humidity.findIndex(value => value.id === apiDevice.getId());
      if (indexHumidity >= 0) {
        apiDevice.humidity = new IotApiDevice(humidity[indexHumidity]).humidity;
      }
      // end humidity

      promises.push(this.apiDeviceToMongoDevice(apiDevice));
    }

    await Promise.all(promises);
  }

  private async apiDeviceToMongoDevice(apiDevice: IotApiDevice){
    let mongoDevice: Device | null;
    try {
      mongoDevice = await this.deviceRepository.findOne({ where: { name: apiDevice.id } });
      console.log("[DeviceService]: handle device ", apiDevice.getId(), mongoDevice?.getId());

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

      if(mongoDevice._id)
        this.deviceRepository.update(mongoDevice);
      else
        this.deviceRepository.save(mongoDevice);
    } catch (e) {
      console.error("[DeviceService]: ", e);
    }
  }
}
