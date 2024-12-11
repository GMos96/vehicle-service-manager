import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServiceLogService } from './service-log.service';
import { CreateServiceLogDTO } from './dto/create-service-log-dto';
import { CurrentUser } from '../common/decorators/current-user';

@Controller('serviceLog')
export class ServiceLogController {
  constructor(private readonly serviceLogService: ServiceLogService) {}

  @Post()
  create(
    @Body() createServiceLogDto: CreateServiceLogDTO,
    @CurrentUser() userId: number,
  ) {
    return this.serviceLogService.create({ ...createServiceLogDto, userId });
  }

  @Get()
  findAll(
    @Param('vehicleId') vehicleId: number,
    @CurrentUser() userId: number,
  ) {
    return this.serviceLogService.findAll(vehicleId, userId);
  }

  @Get('types')
  findAllTypes() {
    return this.serviceLogService.getServiceLogTypes();
  }
}
