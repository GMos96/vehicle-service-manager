import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { Oil } from '../entities/oil.entity';
import { OilFilter } from '../entities/oil-filter.entity';
import { Tire } from '../entities/tire.entity';

export class UpdateVehicleDTO extends PartialType(CreateVehicleDto) {
  oil?: Oil;
  oilFilter?: OilFilter;
  tire?: Tire;
}
