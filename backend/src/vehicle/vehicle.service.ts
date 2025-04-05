import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDTO } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Oil } from './entities/oil.entity';
import { OilFilter } from './entities/oil-filter.entity';
import { Tire } from './entities/tire.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Oil) private oilRepository: Repository<Oil>,
    @InjectRepository(OilFilter)
    private oilFilterRepository: Repository<OilFilter>,
    @InjectRepository(Tire) private tireRepository: Repository<Tire>,
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
    const vehicle = await this.vehicleRepository.findOneBy({ id, userId });
    return this.vehicleRepository.save({ ...vehicle, ...updateVehicleDto });
  }

  async fullUpdate(
    id: number,
    updateVehicleDto: UpdateVehicleDTO,
    userId: number,
  ) {
    await Promise.all([
      this.updateOil(id, updateVehicleDto, userId),
      this.updateOilFilter(id, updateVehicleDto, userId),
      this.updateTire(id, updateVehicleDto, userId),
    ]);

    return this.vehicleRepository.save({ id, ...updateVehicleDto });
  }

  remove(id: number, userId: number) {
    return this.vehicleRepository.delete({ userId });
  }

  private async updateOil(
    vehicleId: number,
    updateVehicleDto: UpdateVehicleDTO,
    userId: number,
  ) {
    return this.oilRepository.save({
      ...updateVehicleDto.oil,
      userId,
      vehicleId,
    });
  }

  private async updateOilFilter(
    vehicleId: number,
    updateVehicleDto: UpdateVehicleDTO,
    userId: number,
  ) {
    return this.oilFilterRepository.save({
      ...updateVehicleDto.oilFilter,
      userId,
      vehicleId,
    });
  }

  private async updateTire(
    vehicleId: number,
    updateVehicleDto: UpdateVehicleDTO,
    userId: number,
  ) {
    return this.tireRepository.save({
      ...updateVehicleDto.tire,
      userId,
      vehicleId,
    });
  }
}
