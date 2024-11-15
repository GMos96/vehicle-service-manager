import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService],
  imports: [TypeOrmModule.forFeature([Vehicle])],
})
export class VehicleModule {}
