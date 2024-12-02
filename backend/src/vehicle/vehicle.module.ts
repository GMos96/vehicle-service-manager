import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Oil } from './entities/oil.entity';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService],
  imports: [TypeOrmModule.forFeature([Vehicle, Oil])],
})
export class VehicleModule {}
