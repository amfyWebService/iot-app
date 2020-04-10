import { inject, service } from '@loopback/core';
import { DeviceService } from '../services';
import util from 'util';


export class ImportDevicesJob {
  private readonly timeLoop: number;

  constructor(
    private deviceService: DeviceService
  ) {
    this.timeLoop = 10 * 1000;
  }

  async start() {
    setInterval(() => this.eachMinute(), this.timeLoop);
  }

  private async eachMinute() {
    console.log('Start Jobs');
    this.deviceService.sayHello();
    console.log('End Jobs');
  }
}