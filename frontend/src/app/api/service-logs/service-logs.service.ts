import { getDataSource } from "@/core/datasource/data-source";
import { ServiceLog } from "@/entities/service-log/service-log.entity";
import { CreateServiceLogDTO } from "@/app/vehicles/types";
import { updateVehicle } from "@/app/api/vehicles/vehicle.service";

export const getServiceLogs = async (vehicleId: number, userId: number) => {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(ServiceLog);
  return await repository
    .createQueryBuilder("serviceLog")
    .where("serviceLog.vehicleId = :vehicleId", { vehicleId })
    .andWhere("serviceLog.userId = :userId", { userId })
    .getMany();
};

// Returns all service logs for a vehicle regardless of which user created them.
// Used by analytics and maintenance routes so that logs written by collaborators
// (whose userId differs from the vehicle owner's) are included in calculations.
export const getAllServiceLogsForVehicle = async (vehicleId: number) => {
  const dataSource = await getDataSource();
  return await dataSource
    .getRepository(ServiceLog)
    .createQueryBuilder("serviceLog")
    .where("serviceLog.vehicleId = :vehicleId", { vehicleId })
    .getMany();
};

export const createServiceLog = async (
  serviceLog: CreateServiceLogDTO,
  vehicleId: number,
  userId: number,
) => {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(ServiceLog);
  const updatedLog = await repository.save({
    ...serviceLog,
    repairCost: serviceLog?.repairCost ?? 0,
    vehicleId,
    userId,
  });

  if (serviceLog.mileage) {
    await updateVehicle(vehicleId, { mileage: serviceLog.mileage }, userId);
  }

  return updatedLog;
};
