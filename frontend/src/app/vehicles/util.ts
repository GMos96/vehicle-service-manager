import { VehicleDTO } from "@/app/vehicles/types";

export function getVehicleDisplayName(vehicle: VehicleDTO): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
}
