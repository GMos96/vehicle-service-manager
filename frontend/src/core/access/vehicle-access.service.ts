import { getDataSource } from "@/core/datasource/data-source";
import { Vehicle } from "@/entities/vehicles/vehicle.entity";
import { VehicleAccess } from "@/entities/vehicle-access/vehicle-access.entity";

export interface VehicleAccessResult {
  canRead: boolean;
  canWrite: boolean;
  isOwner: boolean;
  ownerUserId: number;
  vehicleId: number;
}

export async function resolveVehicleAccess(
  vehicleId: number,
  userId: number,
): Promise<VehicleAccessResult | null> {
  const dataSource = await getDataSource();

  const vehicle = await dataSource.getRepository(Vehicle).findOneBy({ id: vehicleId });
  if (!vehicle) return null;

  if (vehicle.userId === userId) {
    return {
      canRead: true,
      canWrite: true,
      isOwner: true,
      ownerUserId: userId,
      vehicleId,
    };
  }

  const access = await dataSource
    .getRepository(VehicleAccess)
    .findOneBy({ vehicleId, userId });

  if (!access) return null;

  return {
    canRead: true,
    canWrite: access.level === "WRITE",
    isOwner: false,
    ownerUserId: vehicle.userId,
    vehicleId,
  };
}
