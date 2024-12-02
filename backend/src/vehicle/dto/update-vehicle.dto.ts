import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { Oil } from '../entities/oil.entity';

export class UpdateVehicleDTO extends PartialType(CreateVehicleDto) {
  oil: Oil;
}
