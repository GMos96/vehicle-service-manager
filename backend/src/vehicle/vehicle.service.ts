import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../auth/authenticated-user';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
  ) {}

  create(createVehicleDto: CreateVehicleDto, userId: number) {
    return this.vehicleRepository.create({
      ...createVehicleDto,
      userId,
    });
  }

  findAll(userId: number) {
    return this.vehicleRepository.findBy({ userId });
  }

  findOne(id: number, userId: number) {
    return this.vehicleRepository.findBy({ id, userId });
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto, userId: number) {
    return this.vehicleRepository.update(id, updateVehicleDto);
  }

  remove(id: number, userId: number) {
    return this.vehicleRepository.delete({ userId });
  }
}
