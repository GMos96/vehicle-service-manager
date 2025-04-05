import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Oil } from './entities/oil.entity';
import { OilFilter } from './entities/oil-filter.entity';
import { Tire } from './entities/tire.entity';
import { VehicleEventService } from './event/vehicle-event.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, VehicleEventService],
  imports: [TypeOrmModule.forFeature([Vehicle, Oil, OilFilter, Tire])],
})
export class VehicleModule {}
