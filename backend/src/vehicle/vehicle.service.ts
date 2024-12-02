import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDTO } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Oil } from './entities/oil.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Oil) private oilRepository: Repository<Oil>,
  ) {}

  create(createVehicleDto: CreateVehicleDto, userId: number) {
    return this.vehicleRepository.save({
      ...createVehicleDto,
      userId,
    });
  }

  findAll(userId: number) {
    return this.vehicleRepository.findBy({ userId });
  }

  findOne(id: number, userId: number) {
    return this.vehicleRepository.findOneBy({ id, userId });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDTO, userId: number) {
    await this.oilRepository.save({ ...updateVehicleDto.oil, userId });
    return this.vehicleRepository.save({ id, ...updateVehicleDto });
  }

  remove(id: number, userId: number) {
    return this.vehicleRepository.delete({ userId });
  }
}
