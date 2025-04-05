import { Injectable } from '@nestjs/common';
import { CreateServiceLogDTO } from './dto/create-service-log-dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ServiceLog,
  ServiceLogDescription,
  ServiceLogType,
} from './entities/service-log.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceLogEvent } from './events/service-log-event';

@Injectable()
export class ServiceLogService {
  constructor(
    @InjectRepository(ServiceLog)
    private serviceLogRepository: Repository<ServiceLog>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(serviceLog: CreateServiceLogDTO) {
    serviceLog.serviceDate ??= new Date();
    this.eventEmitter.emit(ServiceLogEvent.serviceLogCreated, serviceLog);
    return this.serviceLogRepository.save(serviceLog);
  }

  async findAll(vehicleId: number, userId: number) {
    const serviceLogs = await this.serviceLogRepository
      .createQueryBuilder('serviceLog')
      .where('serviceLog.vehicleId = :vehicleId', { vehicleId })
      .andWhere('serviceLog.userId = :userId', { userId })
      .getMany();

    return serviceLogs.map((serviceLog) => {
      return {
        ...serviceLog,
        serviceType: ServiceLogDescription[serviceLog.serviceType],
      };
    });
  }

  getServiceLogTypes() {
    return [
      {
        value: ServiceLogType.OIL_CHANGE,
        label: ServiceLogDescription.OIL_CHANGE,
      },
      {
        value: ServiceLogType.TIRE_ROTATION,
        label: ServiceLogDescription.TIRE_ROTATION,
      },
      { value: ServiceLogType.OTHER, label: ServiceLogDescription.OTHER },
    ];
  }
}
