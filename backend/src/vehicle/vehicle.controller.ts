import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
    @CurrentUser() user: number,
  ) {
    return this.vehicleService.create(createVehicleDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.vehicleService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.vehicleService.findOne(+id, user.userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDTO,
    @CurrentUser() userId: number,
  ) {
    return this.vehicleService.update(+id, updateVehicleDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.vehicleService.remove(+id, user.userId);
  }
}
