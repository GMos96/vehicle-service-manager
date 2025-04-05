import { Injectable, Logger } from '@nestjs/common';
import { ServiceLogEvent } from '../../service-log/events/service-log-event';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceLogType } from '../../service-log/entities/service-log.entity';
import { VehicleService } from '../vehicle.service';

@Injectable()
export class VehicleEventService {
  private readonly logger = new Logger(VehicleEventService.name);

  constructor(private readonly vehicleService: VehicleService) {}

  @OnEvent(ServiceLogEvent.serviceLogCreated)
  onServiceLogCreated({
    vehicleId,
    mileage,
    serviceType,
    userId,
  }: ServiceLogEvent) {
    if (serviceType === ServiceLogType.OIL_CHANGE) {
      this.vehicleService.update(vehicleId, { mileage }, userId).then(() => {
        this.logger.log(`Vehicle ${vehicleId} mileage updated to ${mileage}`);
      });
    }
  }
}
