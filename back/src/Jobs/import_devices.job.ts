import { inject, service } from '@loopback/core';
import { DeviceService } from '../services';
import util from 'util';


export class ImportDevicesJob {
  private readonly timeLoop: number = 1 * 5 * 1000;

  constructor(
    private deviceService: DeviceService
  ) {}

  async start() {
    setInterval(() => this.eachMinute(), this.timeLoop);
  }

  private async eachMinute() {
    console.log('Start ImportDevicesJob');
    await this.deviceService.importDevices();
    console.log('End ImportDevicesJob');
  }
}