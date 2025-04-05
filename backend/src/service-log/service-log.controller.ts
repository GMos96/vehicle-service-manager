import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ServiceLogService } from './service-log.service';
import { CreateServiceLogDTO } from './dto/create-service-log-dto';
import { CurrentUser } from '../common/decorators/current-user';
import { AuthenticatedUser } from '../auth/authenticated-user';

@Controller('serviceLog')
export class ServiceLogController {
  constructor(private readonly serviceLogService: ServiceLogService) {}

  @Post()
  create(
    @Body() createServiceLogDto: CreateServiceLogDTO,
    @CurrentUser() { userId }: AuthenticatedUser,
  ) {
    return this.serviceLogService.create({ ...createServiceLogDto, userId });
  }

  @Get()
  findAll(
    @Query('vehicleId') vehicleId: number,
    @CurrentUser() { userId }: AuthenticatedUser,
  ) {
    return this.serviceLogService.findAll(vehicleId, userId);
  }

  @Get('types')
  findAllTypes() {
    return this.serviceLogService.getServiceLogTypes();
  }
}
