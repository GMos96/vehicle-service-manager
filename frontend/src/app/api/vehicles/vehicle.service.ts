import { CreateVehicleDto } from "@/vehicles/types/dto/create-vehicle.dto";
import { getDataSource } from "@/core/datasource/data-source";
import { Vehicle } from "@/entities/vehicles/vehicle.entity";
import { UpdateVehicleDTO } from "@/app/vehicles/types";
import { Oil } from "@/entities/vehicles/oil.entity";
import { OilFilter } from "@/entities/vehicles/oil-filter.entity";
import { Tire } from "@/entities/vehicles/tire.entity";

export const createVehicle = async (
  createVehicleDTO: CreateVehicleDto,
  userId: number,
) => {
  const dataSource = await getDataSource();
  const vehicleRepository = dataSource.getRepository(Vehicle);

  return await vehicleRepository.save({
    ...createVehicleDTO,
    userId,
  });
};

export const findAllVehicles = async (userId: number) => {
  const dataSource = await getDataSource();
  const vehicleRepository = dataSource.getRepository(Vehicle);

  return await vehicleRepository.findBy({ userId });
};

export const findOneVehicle = async (id: number, userId: number) => {
  const dataSource = await getDataSource();
  const vehicleRepository = dataSource.getRepository(Vehicle);

  return vehicleRepository.findOneBy({ id, userId });
};

export const updateVehicle = async (
  id: number,
  updateVehicleDTO: Partial<Vehicle>,
  userId: number,
) => {
  const dataSource = await getDataSource();
  const vehicleRepository = dataSource.getRepository(Vehicle);

  const vehicle = await vehicleRepository.findOneBy({ id, userId });
  return vehicleRepository.save({ ...vehicle, ...updateVehicleDTO });
};

export const removeVehicle = async (id: number, userId: number) => {
  const dataSource = await getDataSource();
  const vehicleRepository = dataSource.getRepository(Vehicle);

  return vehicleRepository.delete({ id, userId });
};

export const updateOil = async (
  vehicleId: number,
  updateVehicleDTO: UpdateVehicleDTO,
  userId: number,
) => {
  const dataSource = await getDataSource();
  const oilRepository = dataSource.getRepository(Oil);

  return await oilRepository.save({
    ...updateVehicleDTO.oil,
    userId,
    vehicleId,
  });
};

export const updateOilFilter = async (
  vehicleId: number,
  updateVehicleDTO: UpdateVehicleDTO,
  userId: number,
) => {
  const dataSource = await getDataSource();
  const oilFilterRepository = dataSource.getRepository(OilFilter);

  return await oilFilterRepository.save({
    ...updateVehicleDTO.oilFilter,
    userId,
    vehicleId,
  });
};

export const updateTire = async (
  vehicleId: number,
  updateVehicleDTO: UpdateVehicleDTO,
  userId: number,
) => {
  const dataSource = await getDataSource();
  const tireRepository = dataSource.getRepository(Tire);

  return await tireRepository.save({
    ...updateVehicleDTO.tire,
    userId,
    vehicleId,
  });
};

export const updateAllVehicleData = async (
  vehicleId: number,
  updateVehicleDTO: UpdateVehicleDTO,
  userId: number,
) => {
  if (updateVehicleDTO.oil) {
    await updateOil(vehicleId, updateVehicleDTO, userId);
  }

  if (updateVehicleDTO.oilFilter) {
    await updateOilFilter(vehicleId, updateVehicleDTO, userId);
  }

  if (updateVehicleDTO.tire) {
    await updateTire(vehicleId, updateVehicleDTO, userId);
  }

  return await updateVehicle(
    vehicleId,
    {
      ...updateVehicleDTO,
      oil: undefined,
      oilFilter: undefined,
      tire: undefined,
    },
    userId,
  );
};
