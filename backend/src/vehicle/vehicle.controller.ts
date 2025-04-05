import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDTO } from './dto/update-vehicle.dto';
import { CurrentUser } from '../common/decorators/current-user';
import { AuthenticatedUser } from '../auth/authenticated-user';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @CurrentUser() { userId }: AuthenticatedUser,
  ) {
    return this.vehicleService.create(createVehicleDto, userId);
  }

  @Get()
  findAll(@CurrentUser() { userId }: AuthenticatedUser) {
    return this.vehicleService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() { userId }: AuthenticatedUser,
  ) {
    return this.vehicleService.findOne(+id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDTO,
    @CurrentUser() { userId }: AuthenticatedUser,
  ) {
    return this.vehicleService.fullUpdate(+id, updateVehicleDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() { userId }: AuthenticatedUser,
  ) {
    return this.vehicleService.remove(+id, userId);
  }
}
