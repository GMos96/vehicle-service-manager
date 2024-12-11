import { Module } from '@nestjs/common';
import { ServiceLogService } from './service-log.service';
import { ServiceLogController } from './service-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceLog } from './entities/service-log.entity';

@Module({
  controllers: [ServiceLogController],
  providers: [ServiceLogService],
  imports: [TypeOrmModule.forFeature([ServiceLog])],
})
export class ServiceLogModule {}
