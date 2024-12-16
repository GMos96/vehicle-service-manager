import { Injectable } from '@nestjs/common';
import { CreateServiceLogDTO } from './dto/create-service-log-dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ServiceLog,
  ServiceLogDescription,
  ServiceLogType,
} from './entities/service-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceLogService {
  constructor(
    @InjectRepository(ServiceLog)
    private serviceLogRepository: Repository<ServiceLog>,
  ) {}

  create(serviceLog: CreateServiceLogDTO) {
    serviceLog.serviceDate ??= new Date();
    return this.serviceLogRepository.save(serviceLog);
  }

  async findAll(vehicleId: number, userId: number) {
    const serviceLogs = await this.serviceLogRepository.findBy({
      vehicleId,
      userId,
    });
    return serviceLogs.map((serviceLog) => {
      return {
        ...serviceLog,
        serviceType: ServiceLogDescription[serviceLog.serviceType],
      };
    });
  }

  getServiceLogTypes() {
    return [
      ServiceLogType.OIL_CHANGE,
      ServiceLogType.TIRE_ROTATION,
      ServiceLogType.OTHER,
    ];
  }
}
