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
